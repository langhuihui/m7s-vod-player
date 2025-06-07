import { EventEmitter } from "eventemitter3";
import { MediaSegment } from "./media-segment";
import { catchError, concat, filter, fromEvent, interval, map, merge, never, of, pipe, subject, subscribe, switchMap, switchMapTo, takeUntil, tap } from "fastrx";
import { createPlaylistFromM3U8 } from "./m3u8-parser";
import { MediaSourceProxy } from "./media-source";
import { SoftDecoder } from "./soft-decoder";

export class Engine extends EventEmitter {
    segments: MediaSegment[] = [];
    totalDuration: number = 0;
    position: number = 0;
    debug: boolean = false;
    autoPlay: boolean = false;
    isPlaying: boolean = false;
    softDecoder?: SoftDecoder;
    _playbackRate = 1;
    private log(...args: any[]) {
        if (this.debug) {
            console.log('[Engine]', ...args);
        }
    }
    offset = 0;
    seekOB = subject<number>();
    destroyOB = subject();

    get loadingProgress() {
        const progressInfo = this.segments.map(segment => segment.loadingProgress).reduce((acc, c) => {
            return { loaded: acc.loaded + c.loaded, total: acc.total + c.total };
        }, { loaded: 0, total: 0 });
        return { ...progressInfo, percent: progressInfo.total ? (progressInfo.loaded * 100 / progressInfo.total) : 0 };
    }

    get currentSegment() {
        return this.segments.find(segment => segment.virtualEndTime > this.position)!;
    }
    get bufferStart() {
        return this.video.buffered.length > 0 ? this.video.buffered.start(0) : 0;;
    }
    get bufferEnd() {
        return this.video.buffered.length > 0 ? this.video.buffered.end(this.video.buffered.length - 1) : 0;
    }
    set playbackRate(rate: number) {
        this._playbackRate = rate;
        if (this.softDecoder) this.softDecoder.setPlaybackSpeed(rate);
        else this.video.playbackRate = rate;
    }
    constructor(public video: HTMLVideoElement, opt: { debug: boolean, autoPlay: boolean; } = { debug: false, autoPlay: false }) {
        super();
        this.debug = opt.debug;
        this.autoPlay = opt.autoPlay;
        this.log('Engine initialized with options:', opt);

        const mediaSourceProxy = new MediaSourceProxy(video, {
            debug: this.debug,
        });

        pipe(this.seekOB, switchMap(time => {
            this.log('Seek requested to time:', time);
            this.position = time;
            const currentSegment = this.currentSegment;
            const offsetInSegment = time - currentSegment.virtualStartTime;
            const loadSequence = concat(...this.segments.slice(currentSegment.index + 1).map(segment => mediaSourceProxy.appendSegment(segment)));
            this.log('Offset in segment:', offsetInSegment);
            video.pause();
            const targetTime = offsetInSegment + this.bufferEnd;
            this.offset = time - targetTime;
            const [bufferStart, bufferEnd] = [this.bufferStart, this.bufferEnd];
            return pipe(mediaSourceProxy.appendSegment(currentSegment), tap(() => {
                video.currentTime = targetTime;
                if (bufferEnd > bufferStart) mediaSourceProxy.removeBuffer(bufferStart, bufferEnd);
                if (this.isPlaying) video.play();
            }), switchMapTo(merge(fromEvent(this.video, 'timeupdate'), loadSequence)));
        }), catchError(err => {
            console.error(err);
            this.log(err, 'downgrade');
            // this.softDecoder = new SoftDecoder('', { yuvMode: true });
            // this.video.srcObject = this.softDecoder.canvas.captureStream();
            // this.segments.forEach(segment => segment.downgrade(this.softDecoder!));
            // mediaSourceProxy.appendSegment(this.currentSegment).then(() => {
            //     this.softDecoder?.processInitialFrame();
            // });
            // pipe(fromEvent(video, 'pause'), subscribe(() => {
            //     this.softDecoder?.stop();
            // }));
            return never();
        }), takeUntil(this.destroyOB), subscribe(() => {
            this.position = video.currentTime + this.offset;
        }));


        pipe(fromEvent(video, 'error'), takeUntil(this.destroyOB), subscribe(() => {
            const position = this.position;
            mediaSourceProxy.reset();
            this.segments.forEach(segment => segment.unBuffer());
            this.offset = 0;
            this.seek(position + 1);
            video.playbackRate = this._playbackRate;
        }));

        pipe(fromEvent(video, 'waiting'), takeUntil(this.destroyOB), subscribe(() => {
            if (this.totalDuration - this.position < 1) {
                mediaSourceProxy.reset();
                this.segments.forEach(segment => segment.unBuffer());
                this.offset = 0;
                this.pause();
                this.seek(0);
            }
        }));
    }
    get bufferedLength() {
        return this.bufferEnd - this.video.currentTime;
    }
    async load(url: string) {
        this.log('Loading URL:', url);
        let urlObj: URL;
        try {
            // 尝试直接解析URL
            urlObj = new URL(url);
        } catch (e) {
            // 如果是相对路径，则基于当前页面URL构建完整URL
            urlObj = new URL(url, window.location.href);
        }
        switch (urlObj.pathname.split('.').pop()) {
            case 'm3u8':
                this.log('Processing M3U8 playlist');
                const m3u8Content = await fetch(urlObj.toString()).then(res => res.text());
                const playlist = createPlaylistFromM3U8(m3u8Content, urlObj.origin + urlObj.pathname.split("/").slice(0, -1).join("/"));
                this.log('Playlist created:', playlist);
                this.segments = playlist.segments;
                this.totalDuration = playlist.totalDuration;
                pipe(merge(...this.segments.map(segment => fromEvent(segment, 'progress'))), takeUntil(this.destroyOB), subscribe(() => {
                    this.emit('progress', this.loadingProgress);
                }));
                if (this.autoPlay) {
                    this.log('Auto-play enabled, starting playback');
                    this.play();
                } else {
                    this.log('Seeking to start position');
                    this.seek(0);
                }
                break;
        }
    }

    play() {
        this.log('Play requested');
        this.isPlaying = true;
        this.seekOB.next(this.position);
    }

    pause() {
        this.log('Pause requested');
        this.isPlaying = false;
        this.video.pause();
    }

    seek(time: number) {
        const targetTime = time - this.offset;
        this.log('Seek requested to:', time, `[${this.bufferStart},${this.bufferEnd}]`, targetTime);
        if (this.bufferEnd > targetTime && this.bufferStart < targetTime) {
            this.video.currentTime = targetTime;
        } else this.seekOB.next(time);
    }

    destroy() {
        this.log('Destroying engine');
        this.video.src = '';
        this.destroyOB.next(true);
    }
}
