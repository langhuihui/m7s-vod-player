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

        const errorOB = pipe(fromEvent(video, 'error'), map(() => {
            const position = this.position;
            mediaSourceProxy.reset();
            this.offset = 0;
            return position + 1;
        }));

        const waitOB = pipe(fromEvent(video, 'waiting'), filter(() => this.totalDuration - this.position < 1), map(() => {
            mediaSourceProxy.reset();
            this.offset = 0;
            this.pause();
            return 0;
        }));

        const seekOP = (time: number) => {
            this.position = time;
            const { currentSegment, bufferStart, bufferEnd } = this;
            const offsetInSegment = time - currentSegment.virtualStartTime;
            const targetTime = offsetInSegment + bufferEnd;
            this.log('Seek requested to time:', time, `[${bufferStart},${bufferEnd}]`, 'offsetInSegment', offsetInSegment, 'targetTime', targetTime);
            const loadSequence = concat(...this.segments.slice(currentSegment.index + 1).map(segment => mediaSourceProxy.appendSegment(segment)));
            video.pause();
            this.offset = time - targetTime;
            return pipe(mediaSourceProxy.appendSegment(currentSegment), tap(() => {
                video.currentTime = targetTime;
                if (bufferEnd > bufferStart) mediaSourceProxy.removeBuffer(bufferStart, bufferEnd);
                if (this.isPlaying) video.play();
                video.playbackRate = this._playbackRate;
            }), switchMapTo(merge(fromEvent(this.video, 'timeupdate'), loadSequence)));
        }

        const seekSoftOP = (time: number) => {
            this.position = time;
            const { currentSegment, softDecoder } = this;
            const loadSequence = concat(...this.segments.slice(currentSegment.index + 1).map(segment => mediaSourceProxy.appendSegment(segment)));
            video.pause();
            return pipe(mediaSourceProxy.appendSegment(currentSegment), tap(() => {
                if (this.isPlaying) {
                    this.log('processInitialFrame', softDecoder?.videoBuffer.length);
                    softDecoder?.processInitialFrame();
                    video.play().then(() => {
                        softDecoder?.start()
                        softDecoder?.seek(time)
                    })
                }
            }), switchMapTo(merge(fromEvent(this.video, 'timeupdate'), loadSequence)));
        }

        pipe(merge(this.seekOB, errorOB, waitOB), switchMap(seekOP), takeUntil(this.destroyOB), subscribe(() => {
            this.position = video.currentTime + this.offset;
        }, err => {
            this.log(err, 'downgrade');
            this.softDecoder = new SoftDecoder('', { yuvMode: true });
            this.video.srcObject = this.softDecoder.canvas.captureStream();
            this.segments.forEach(segment => segment.downgrade(this.softDecoder!));
            pipe(this.seekOB, switchMap(seekSoftOP), takeUntil(this.destroyOB), subscribe(() => {
                this.position = (this.softDecoder?.getCurrentTime() ?? 0) / 1000;
            }))
            this.seekOB.next(this.position);
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
        this.softDecoder?.stop();
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
