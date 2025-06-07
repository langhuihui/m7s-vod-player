import { EventEmitter } from "eventemitter3";
import { SourceBufferProxy } from "./source-buffer-proxy";
import { MediaSegment } from "./media-segment";

export class MediaSourceProxy extends EventEmitter {
    mediaSource = new MediaSource();
    sourceBufferProxy = new SourceBufferProxy(this.mediaSource)
    urlSource = URL.createObjectURL(this.mediaSource);
    debug: boolean = false;
    ready = this.init();
    constructor(public video: HTMLVideoElement, opt: { debug: boolean; } = { debug: false }) {
        super();
        this.debug = opt.debug;
        video.src = this.urlSource
    }

    appendSegment(segment: MediaSegment) {
        return segment.load(this.sourceBufferProxy, this.ready);
    }

    async removeBuffer(start: number, end: number): Promise<void> {
        if (!this.sourceBufferProxy) {
            throw new Error('SourceBufferProxy not initialized');
        }
        return this.sourceBufferProxy.remove(start, end);
    }

    destroy(): void {
        this.video.src = ''
        if (this.mediaSource.readyState === 'open') {
            this.mediaSource.endOfStream();
        }
        if (this.urlSource) {
            URL.revokeObjectURL(this.urlSource);
        }
        this.sourceBufferProxy.destroy();
        this.emit('destroyed');
    }

    get readyState(): string {
        return this.mediaSource.readyState;
    }

    endOfStream(): void {
        if (this.mediaSource.readyState === 'open') {
            this.mediaSource.endOfStream();
        }
    }

    reset() {
        this.destroy();
        this.mediaSource = new MediaSource();
        this.sourceBufferProxy = new SourceBufferProxy(this.mediaSource)
        this.urlSource = URL.createObjectURL(this.mediaSource);
        this.video.src = this.urlSource;
        this.ready = this.init();
    }

    init() {
        this.mediaSource.addEventListener('sourceended', () => {
            this.emit('ended');
        });

        this.mediaSource.addEventListener('sourceclose', () => {
            this.emit('closed');
        });
        return new Promise<void>((resolve, reject) => {
            this.mediaSource.addEventListener('sourceopen', () => {
                this.emit('sourceopen');
                resolve();
            });
        });
    }
}