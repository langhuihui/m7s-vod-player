import { Track } from "./fmp4-parser";

export class SourceBufferProxy {
  queue: { data: ArrayBuffer, resolve: () => void, reject: (e: Event) => void; }[] = []; // 排队
  removeQueue: { start: number, end: number, resolve: () => void, reject: (e: Event) => void; }[] = [];
  currentWaiting?: () => void;
  currentError = console.log;
  sourceBuffer!: SourceBuffer;
  constructor(private mediaSource: MediaSource) {
  }
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(codec: string) {
    console.log('init', codec);
    this.sourceBuffer = this.mediaSource.addSourceBuffer(codec);
    this.sourceBuffer.mode = 'sequence';
    this.sourceBuffer.addEventListener('updateend', () => {
      this.currentWaiting?.();
      if (this.removeQueue.length > 0) {
        const { start, end, resolve, reject } = this.removeQueue.shift()!;
        this.sourceBuffer.remove(start, end);
        this.currentWaiting = resolve;
        this.currentError = reject;
      } else if (this.queue.length > 0) {
        const { data, resolve, reject } = this.queue.shift()!;
        this.sourceBuffer.appendBuffer(data);
        this.currentWaiting = resolve;
        this.currentError = reject;
      } else {
        delete this.currentWaiting;
      }
    });
    this.sourceBuffer.addEventListener('error', (e) => {
      this.currentError(e);
    });
  }
  appendBuffer(segment: { data: ArrayBuffer, tracks: Track[]; }) {
    if (!this.currentWaiting) {
      this.sourceBuffer.appendBuffer(segment.data);
      return new Promise<void>((resolve, reject) => {
        this.currentWaiting = resolve;
        this.currentError = reject;
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        this.queue.push({ data: segment.data, resolve, reject });
      });
    }
  }
  remove(start: number, end: number) {
    if (!this.currentWaiting) {
      this.sourceBuffer.remove(start, end);
      return new Promise<void>((resolve, reject) => {
        this.currentWaiting = resolve;
        this.currentError = reject;
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        this.removeQueue.push({ start, end, resolve, reject });
      });
    }
  }
  destroy() {
    if (this.sourceBuffer) {
      try {
        this.mediaSource.removeSourceBuffer(this.sourceBuffer);
      } catch (e) { }
      this.sourceBuffer = undefined as any;
    }
    this.queue = [];
    this.removeQueue = [];
    delete this.currentWaiting;
    this.currentError = () => { };
  }
} 