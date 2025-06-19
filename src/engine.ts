import { EventEmitter } from "eventemitter3";
import { MediaSegment } from "./media-segment";
import { filter, fromEvent, interval, map, merge, never, of, pipe, subject, subscribe, switchMap, switchMapTo, takeUntil, tap, expand, mapTo, take } from "fastrx";
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

  // 最小缓冲长度阈值（秒）
  private minBufferLength = 30;

  /**
   * 获取最小缓冲长度阈值
   */
  get minimumBufferLength(): number {
    return this.minBufferLength;
  }

  /**
   * 设置最小缓冲长度阈值
   * 当缓冲长度低于此值时，会触发下一个 segment 的加载
   * @param seconds 缓冲长度（秒）
   */
  set minimumBufferLength(seconds: number) {
    this.minBufferLength = Math.max(0, seconds);
  }

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

      // 使用 expand 操作符实现条件加载
      // expand 工作原理：
      // 1. 从 of(0) 开始，发出初始索引 0
      // 2. expand 函数接收当前索引，返回一个 observable
      // 3. 如果返回 never()，则停止递归
      // 4. 如果返回有效的 observable，expand 会订阅它，并将结果再次传递给 expand 函数
      // 5. 这样就形成了递归的数据流，实现条件加载
      const remainingSegments = this.segments.slice(currentSegment.index + 1);

      const loadSequence = pipe(
        of(0), // 从索引 0 开始
        expand((index: number) => {
          this.log(`Expand called with index: ${index}`);

          // 检查停止条件
          if (index >= remainingSegments.length) {
            this.log('No more segments to load');
            return never(); // 没有更多 segment
          }

          // 等待缓冲区不足时才加载下一个 segment
          return pipe(
            merge(
              fromEvent(this.video, 'timeupdate'),
              interval(1000) // 定期检查缓冲状态
            ),
            filter(() => {
              const needMore = this.bufferedLength < this.minBufferLength;
              if (needMore) {
                this.log(`Buffer low (${this.bufferedLength}s < ${this.minBufferLength}s), loading segment at index ${index}`);
              }
              return needMore;
            }),
            take(1),
            switchMapTo(
              pipe(
                mediaSourceProxy.appendSegment(remainingSegments[index]),
                tap(() => this.log(`Loaded segment ${remainingSegments[index].index}, buffer: ${this.bufferedLength}s`)),
                mapTo(index + 1) // 返回下一个索引
              )
            )
          );
        })
      );

      video.pause();
      this.offset = time - targetTime;
      return pipe(mediaSourceProxy.appendSegment(currentSegment), tap(() => {
        video.currentTime = targetTime;
        if (bufferEnd > bufferStart) mediaSourceProxy.removeBuffer(bufferStart, bufferEnd);
        if (this.isPlaying) video.play();
        video.playbackRate = this._playbackRate;
      }), switchMapTo(merge(fromEvent(this.video, 'timeupdate'), loadSequence)));
    };

    const seekSoftOP = (time: number) => {
      this.position = time;
      const { currentSegment, softDecoder } = this;

      // 使用 expand 操作符实现条件加载（软解码器模式）
      const remainingSegments = this.segments.slice(currentSegment.index + 1);

      const loadSequence = pipe(
        of(0), // 从索引 0 开始
        expand((index: number) => {
          this.log(`Expand (soft) called with index: ${index}`);

          // 检查停止条件
          if (index >= remainingSegments.length) {
            this.log('No more segments to load (soft decoder)');
            return never();
          }

          // 等待缓冲区不足时才加载下一个 segment
          return pipe(
            merge(
              fromEvent(this.video, 'timeupdate'),
              interval(1000)
            ),
            filter(() => {
              const needMore = this.bufferedLength < this.minBufferLength;
              if (needMore) {
                this.log(`Buffer low (soft decoder, ${this.bufferedLength}s < ${this.minBufferLength}s), loading segment at index ${index}`);
              }
              return needMore;
            }),
            switchMapTo(
              pipe(
                mediaSourceProxy.appendSegment(remainingSegments[index]),
                tap(() => this.log(`Loaded segment ${remainingSegments[index].index} (soft), buffer: ${this.bufferedLength}s`)),
                mapTo(index + 1)
              )
            )
          );
        })
      );

      video.pause();
      return pipe(mediaSourceProxy.appendSegment(currentSegment), tap(() => {
        if (this.isPlaying) {
          this.log('processInitialFrame', softDecoder?.videoBuffer.length);
          softDecoder?.processInitialFrame();
          video.play().then(() => {
            softDecoder?.start();
            softDecoder?.seek(time);
          });
        }
      }), switchMapTo(merge(fromEvent(this.video, 'timeupdate'), loadSequence)));
    };

    pipe(merge(this.seekOB, errorOB, waitOB), switchMap(seekOP), takeUntil(this.destroyOB), subscribe(() => {
      this.position = video.currentTime + this.offset;
    }, err => {
      this.log(err, 'downgrade');
      this.softDecoder = new SoftDecoder('', { yuvMode: true });
      this.video.srcObject = this.softDecoder.canvas.captureStream();
      this.segments.forEach(segment => segment.downgrade(this.softDecoder!));
      pipe(this.seekOB, switchMap(seekSoftOP), takeUntil(this.destroyOB), subscribe(() => {
        this.position = (this.softDecoder?.getCurrentTime() ?? 0) / 1000;
      }));
      this.seekOB.next(this.position);
    }));
  }
  get bufferedLength() {
    return this.bufferEnd - this.video.currentTime;
  }

  get minBufferThreshold() {
    return this.minBufferLength;
  }

  set minBufferThreshold(value: number) {
    this.minBufferLength = value;
    this.log('Min buffer threshold set to:', value, 'seconds');
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