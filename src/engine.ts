import { EventEmitter } from "eventemitter3";
import { MediaSegment } from "./media-segment";
import { catchError, fromEvent, map, merge, never, pipe, subject, subscribe, switchMap, takeUntil } from "fastrx";
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
    private log(...args: any[]) {
        if (this.debug) {
            console.log('[Engine]', ...args);
        }
    }

    pauseOB = subject();
    seekOB = subject<number>();
    destroyOB = subject();

    get loadingProgress() {
        const progressInfo = this.segments.filter(segment => segment.state === 'loading').map(segment => segment.loadingProgress).reduce((acc, c) => {
            return { loaded: acc.loaded + c.loaded, total: acc.total + c.total };
        }, { loaded: 0, total: 0 })
        return { ...progressInfo, percent: progressInfo.total ? (progressInfo.loaded * 100 / progressInfo.total) : 0 }
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
        if (this.softDecoder) this.softDecoder.setPlaybackSpeed(rate)
        else this.video.playbackRate = rate
    }
    constructor(public video: HTMLVideoElement, opt: { debug: boolean, autoPlay: boolean } = { debug: false, autoPlay: false }) {
        super();
        this.debug = opt.debug;
        this.autoPlay = opt.autoPlay;
        this.log('Engine initialized with options:', opt);

        const mediaSourceProxy = new MediaSourceProxy(video, {
            debug: this.debug,
        });
        let segmentLoading = Promise.resolve(true);
        let offset = 0
        pipe(this.seekOB, switchMap(time => {
            this.log('Seek requested to time:', time);
            this.position = time;
            const currentSegment = this.currentSegment;
            const offsetInSegment = time - currentSegment.virtualStartTime;
            this.log('Offset in segment:', offsetInSegment);
            video.pause()
            return async sink => {
                try {
                    await segmentLoading;
                    if (sink.disposed) return
                    await mediaSourceProxy.ready;
                    if (sink.disposed) return
                    const bufferStart = this.bufferStart;
                    const bufferEnd = this.bufferEnd;
                    this.log('Appending segment:', currentSegment);
                    const appended = await mediaSourceProxy.appendSegment(currentSegment);
                    if (sink.disposed) return
                    if (appended) {
                        this.log('Segment appended successfully');
                        this.segments.filter(segment => segment.ready && segment != currentSegment).forEach(segment => {
                            this.log('Unbuffering segment:', segment);
                            segment.unBuffer()
                        });
                        if (bufferEnd > bufferStart) {
                            this.log('Removing buffer range:', bufferStart, 'to', bufferEnd);
                            await mediaSourceProxy.removeBuffer(bufferStart, bufferEnd);
                            if (sink.disposed) return
                        }
                        const targetTime = offsetInSegment + bufferEnd
                        offset = time - targetTime;
                        this.log('New offset calculated:', offset, 'target:', targetTime, 'position:', time);
                    }
                    const targetTime = time - offset;
                    this.log("Buffer:", `[${this.bufferStart},${this.bufferEnd}]`, "Target:", targetTime)
                    video.currentTime = targetTime;
                    this.log('Set video currentTime to:', video.currentTime);
                    sink.next(true);
                } catch (e) {
                    sink.error(e)
                }
            }
        }), catchError(err => {
            this.log(err, 'downgrade')
            this.softDecoder = new SoftDecoder('', { yuvMode: true })
            this.video.srcObject = this.softDecoder.canvas.captureStream();
            this.segments.forEach(segment => segment.downgrade(this.softDecoder!))
            mediaSourceProxy.appendSegment(this.currentSegment).then(() => {
                this.softDecoder?.processInitialFrame();
              });
            pipe(fromEvent(video, 'pause'), subscribe(() => {
                this.softDecoder?.stop()
            }))
            return never()
        }), takeUntil(this.destroyOB), subscribe(() => {
            if (this.isPlaying) {
                this.log('Resuming playback');
                video.play()
                this.softDecoder?.start()
            }
        }));

        pipe(fromEvent(video, 'timeupdate'), takeUntil(this.destroyOB), subscribe(() => {
            this.position = video.currentTime + offset;
            if (!this.currentSegment) return
            const nextSegment = this.segments[this.currentSegment.index + 1];
            if (nextSegment && !nextSegment.ready) {
                this.log('Loading next segment:', nextSegment);
                segmentLoading = mediaSourceProxy.appendSegment(nextSegment);
            }
        }));

        pipe(fromEvent(video, 'error'), takeUntil(this.destroyOB), subscribe(() => {
            const position = this.position
            mediaSourceProxy.reset()
            this.segments.forEach(segment => segment.unBuffer());
            offset = 0
            this.seek(position + 1)
        }));

        pipe(fromEvent(video, 'waiting'), takeUntil(this.destroyOB), subscribe(() => {
            if (this.totalDuration - this.position < 1) {
                mediaSourceProxy.reset()
                this.segments.forEach(segment => segment.unBuffer());
                offset = 0
                this.pause()
                this.seek(0)
            }
        }));
    }
    get bufferedLength() {
        const currentSegment = this.currentSegment;
        if (!currentSegment) return 0;
        let length = 0;
        for (let i = currentSegment.index; i < this.segments.length; i++) {
            if (this.segments[i].state === 'buffered') {
                length += this.segments[i].duration;
            } else {
                break
            }
        }
        return length - (this.position - currentSegment.virtualStartTime);
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
                    this.emit('progress', this.loadingProgress)
                }))
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
        this.pauseOB.next(true);
        this.video.pause();
    }

    seek(time: number) {
        this.log('Seek requested to:', time);
        this.seekOB.next(time);
    }

    destroy() {
        this.log('Destroying engine');
        this.video.src = '';
        this.destroyOB.next(true);
    }
}
