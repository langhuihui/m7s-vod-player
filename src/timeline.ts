import { Fmp4Parser, Track } from "./fmp4-parser";
import { SoftDecoder } from "./soft-decoder";
const EXTINFRegex = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;

// 定义接口和类
export interface SlidingWindowConfig {
  forward: number;  // 预加载前面的片段数
  backward: number; // 保留后面的片段数
}

interface MediaSegmentInfo {
  url: string;
  duration: number;
  physicalTime: Date | null;
}
interface BufferRange {
  start: number;
  end: number;
}
class MediaSegment {
  url: string;             // 片段URL
  duration: number;        // 片段实际持续时间
  virtualStartTime: number; // 虚拟时间轴上的开始时间
  virtualEndTime: number;   // 虚拟时间轴上的结束时间
  physicalTime: Date | null; // 物理时间（从EXTINF中解析）
  data?: Promise<ArrayBuffer>;       // 片段的二进制数据
  state: 'init' | 'loading' | 'loaded' | 'buffering' | 'buffered' = 'init';
  fmp4Parser = new Fmp4Parser(false);
  tracks: Track[] = [];
  softDecoder?: SoftDecoder;

  constructor(public index: number, info: MediaSegmentInfo) {
    this.url = info.url;
    this.duration = info.duration;
    this.virtualStartTime = 0;
    this.virtualEndTime = 0;
    this.physicalTime = info.physicalTime;
  }
  async load(bufferProxy: SourceBufferProxy) {
    this.state = 'loading';
    if (!this.data) {
      const response = await fetch(this.url);
      this.data = response.arrayBuffer();
    }
    const data = await this.data;
    if (this.tracks.length === 0) {
      this.tracks = this.fmp4Parser.parse(data);
    }
    if (!bufferProxy.initialized) {
      const codec = `video/mp4; codecs="${this.tracks.map(track => track.codec).join(', ')}"`;
      if (MediaSource.isTypeSupported(codec)) {
        bufferProxy.init(codec);
      } else {
        throw new Error(`Unsupported codec: ${codec}`);
      }
    }
    if (this.state !== 'loading') {
      // 取消appendBuffer
      return;
    }
    this.state = 'buffering';
    await bufferProxy.appendBuffer({ data, tracks: this.tracks });
    this.state = 'buffered';
  }
  async load2(softDecoder: SoftDecoder) {
    this.softDecoder = softDecoder;
    if (this.state === 'init') {
      this.state = 'loading';
      if (!this.data) {
        const response = await fetch(this.url);
        this.data = response.arrayBuffer();
      }
      const data = await this.data;
      this.tracks = this.fmp4Parser.parse(data);
      this.state = 'buffering';
    }
    const videoTracks = this.tracks.filter(track => track.type === 'video');
    const audioTracks = this.tracks.filter(track => track.type === 'audio');
    for (const track of videoTracks) {
      if (softDecoder.videoDecoder.state !== 'configured') {
        await softDecoder.videoDecoder.initialize();
        await softDecoder.videoDecoder.configure({
          codec: track.codec.startsWith('avc1') ? 'avc' : 'hevc',
          description: track.codecInfo?.extraData,
        });
        softDecoder.canvas.width = track.width ?? 1920;
        softDecoder.canvas.height = track.height ?? 1080;
      }
      let timestamp = this.virtualStartTime * 1000;
      track.samples.forEach(sample => {
        softDecoder.decodeVideo({
          data: sample.data,
          timestamp,
          type: sample.keyFrame ? 'key' : 'delta'
        });
        timestamp += sample.duration ?? 0;
      });
    }
    for (const track of audioTracks) {
      if (softDecoder.audioDecoder.state !== 'configured') {
        await softDecoder.audioDecoder.initialize();
        await softDecoder.audioDecoder.configure({
          codec: 'aac',
          description: track.codecInfo?.extraData,
          numberOfChannels: track.channelCount ?? 2,
          sampleRate: track.sampleRate ?? 44100,
        });
      }
      let timestamp = this.virtualStartTime * 1000;
      track.samples.forEach(sample => {
        softDecoder.decodeAudio({
          data: sample.data,
          timestamp: timestamp,
          type: 'key'
        });
        timestamp += sample.duration ?? 0;
      });
    }
    this.state = 'buffered';
  }
  unBuffer() {
    if (this.state === 'init') return;
    this.state = 'loaded';
    if (this.softDecoder) {
      // Remove all frames within this segment's time range from decoder buffers
      this.softDecoder.videoBuffer = this.softDecoder.videoBuffer.filter(x =>
        x.timestamp < this.virtualStartTime * 1000 || x.timestamp >= this.virtualEndTime * 1000
      );
      this.softDecoder.audioBuffer = this.softDecoder.audioBuffer.filter(x =>
        x.timestamp < this.virtualStartTime * 1000 || x.timestamp >= this.virtualEndTime * 1000
      );
    }
  }
}

class SourceBufferProxy {
  queue: { data: ArrayBuffer, resolve: () => void, reject: (e: Event) => void; }[] = []; // 排队
  removeQueue: { start: number, end: number, resolve: () => void, reject: (e: Event) => void; }[] = [];
  currentWaiting?: () => void;
  currentError: (e: Event) => void = () => {
    console.log(e);
  };
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

export interface PlaylistInfo {
  segments: MediaSegment[];
  totalDuration: number;
}

function createPlaylistFromM3U8(m3u8Content: string, baseUrl: string): PlaylistInfo {
  const lines = m3u8Content.split("\n");
  const segments: MediaSegment[] = [];
  let totalDuration = 0;
  let segmentIndex = 0;
  let segmentDuration = 0;
  let segmentTime: Date | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 解析EXTINF行
    if (line.startsWith("#EXTINF:")) {
      const match = line.match(EXTINFRegex);
      if (match) {
        segmentDuration = parseFloat(match[1]);
        const timeString = match[2] ? match[2].trim() : "";
        // 解析物理时间
        try {
          if (timeString) {
            segmentTime = new Date(timeString);
          } else {
            segmentTime = null;
          }
        } catch (e) {
          segmentTime = null;
        }
      }
    }
    // 处理片段URL行
    else if (!line.startsWith("#") && line !== "") {
      const url = new URL(line, baseUrl);
      const virtualStartTime = totalDuration;
      const virtualEndTime = totalDuration + segmentDuration;
      const segment = new MediaSegment(segmentIndex, {
        url: url.toString(),
        duration: segmentDuration,
        physicalTime: segmentTime,
      });
      segment.virtualStartTime = virtualStartTime;
      segment.virtualEndTime = virtualEndTime;
      segments.push(segment);

      totalDuration += segmentDuration;
      segmentIndex++;
      segmentTime = null;
    }
  }

  return { segments, totalDuration };
}

class Timeline {
  segments: MediaSegment[] = [];
  totalDuration: number = 0;
  mediaSource = new MediaSource();
  sourceBufferProxy?: SourceBufferProxy;
  position: number = 0;
  offset: number = 0;
  private _offset: number = 0;
  windowSize: number = 2;
  currentSegment?: MediaSegment;
  urlSrouce?: string;
  debug: boolean = false;
  singleFmp4: boolean = false;
  softDecoder?: SoftDecoder;

  updatePosition = () => {
    this.position = this.currentTime + this.offset;
    this.checkBuffer();
  };

  onWaiting = () => {
    const buffered = this.video.buffered;
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      if (this.currentTime >= start) {
        continue;
      }
      this.currentTime = start;
      this.video.play().catch(() => {
        // 播放失败时的错误处理
      });
    }
  };
  onError = async (e: Event) => {
    console.error('Video error:', e);
    const targetPos = this.position + 1;
    this.video.pause();
    this.video.src = '';
    if (this.softDecoder) {
      this.softDecoder.dispose();
    }
    this.sourceBufferProxy?.destroy();
    if (this.urlSrouce) {
      URL.revokeObjectURL(this.urlSrouce);
    }
    this.mediaSource = new MediaSource();
    const mediaSource = this.mediaSource;
    this.urlSrouce = URL.createObjectURL(mediaSource);
    this.sourceBufferProxy = new SourceBufferProxy(mediaSource);
    this.segments.forEach(segment => {
      if (segment.state === 'buffered') {
        segment.state = 'loaded';
      }
    });
    mediaSource.addEventListener('sourceopen', async () => {
      const targetSegment = this.segments.find(segment => segment.virtualEndTime > targetPos);
      if (!targetSegment) {
        console.warn('No segment found for target position:', targetPos);
        return;
      }
      await this.appendSegment(targetSegment);
      const offsetInSegment = targetPos - targetSegment.virtualStartTime;
      this.offset = 0;
      this.currentTime = offsetInSegment;
      this.checkBuffer();
      return this.video.play();
    });
    mediaSource.addEventListener('sourceended', () => {
      console.log('MediaSource ended');
      this.video.pause();
    });
    mediaSource.addEventListener('sourceclose', () => {
      console.log('MediaSource closed');
    });
    this.video.src = this.urlSrouce!;
  };
  constructor(public video: HTMLVideoElement, opt: { debug: boolean; } = { debug: false }) {
    this.debug = opt.debug;
  }
  async load(url: string) {
    console.log('load', url);
    const mediaSource = this.mediaSource;
    const urlObj = new URL(url);
    switch (urlObj.pathname.split('.').pop()) {
      case 'm3u8':
        this.singleFmp4 = false;
        const m3u8Content = await fetch(url).then(res => res.text());
        const playlist = createPlaylistFromM3U8(m3u8Content, urlObj.origin + urlObj.pathname.split("/").slice(0, -1).join("/"));
        console.log('playlist', playlist);
        this.segments = playlist.segments;
        this.totalDuration = playlist.totalDuration;
        this.urlSrouce = URL.createObjectURL(mediaSource);
        this.video.src = this.urlSrouce;
        this.currentSegment = this.segments[0];
        this.sourceBufferProxy = new SourceBufferProxy(mediaSource);
        mediaSource.addEventListener('sourceopen', async () => {
          for (let i = 0; i < 2 && i < this.segments.length; i++) {
            await this.appendSegment(this.segments[i]);
          }
        });
        mediaSource.addEventListener('sourceended', () => {
          this.video.pause();
        });
        this.video.addEventListener('timeupdate', this.updatePosition);
        this.video.addEventListener('waiting', this.onWaiting);
        this.video.addEventListener('error', this.onError);
        break;
      case 'fmp4':
        // this.singleFmp4 = true;
        // this.urlSrouce = URL.createObjectURL(mediaSource);
        // this.video.src = this.urlSrouce;
        // const fmp4Buffer = fetch(url).then(res => res.arrayBuffer());
        // mediaSource.addEventListener('sourceopen', async () => {
        //   const sourceBuffer = mediaSource.addSourceBuffer(`video/mp4; codecs="${codec}"`);
        //   sourceBuffer.mode = 'sequence';
        //   sourceBuffer.appendBuffer(await fmp4Buffer);
        //   sourceBuffer.addEventListener('updateend', () => {
        //     this.mediaSource.endOfStream();
        //   });
        // });
        break;
    }
  }
  destroy() {
    this.video.pause();
    this.video.src = '';
    this.video.removeEventListener('timeupdate', this.updatePosition);
    this.video.removeEventListener('waiting', this.onWaiting);
    this.video.removeEventListener('error', this.onError);
    if (this.mediaSource?.readyState === 'open') {
      this.mediaSource.endOfStream();
    }
    if (this.urlSrouce) {
      URL.revokeObjectURL(this.urlSrouce);
    }
    if (this.softDecoder) {
      this.softDecoder.dispose();
    }
  }
  printSegments() {
    if (this.debug)
      console.table(this.segments.map(segment => ({
        state: segment.state,
        virtualStartTime: segment.virtualStartTime,
        virtualEndTime: segment.virtualEndTime,
        duration: segment.duration,
      })));
  }

  checkBuffer() {
    if (!this.currentSegment) return;
    // Format buffered ranges for detailed logging
    let bufferedInfo = '';
    for (let i = 0; i < this.video.buffered.length; i++) {
      const start = this.video.buffered.start(i).toFixed(2);
      const end = this.video.buffered.end(i).toFixed(2);
      bufferedInfo += `[${start}-${end}] `;
    }
    if (this.debug) {
      console.debug(
        `Time: ${this.video.currentTime.toFixed(2)}, ` +
        `Buffered: ${bufferedInfo}，` +
        `BufferedLength: ${this.bufferedLength.toFixed(2)}`
      );
    }
    if (this.position >= this.currentSegment.virtualEndTime) {
      if (this.segments.length > this.currentSegment.index + 1) {
        this.bufferNext();
        this.printSegments();
      } else {
        return;
      }
    }
  }

  async appendSegment(segment: MediaSegment): Promise<void> {
    if (this.softDecoder) {
      await segment.load2(this.softDecoder);
      this.printSegments();
    } else {
      return segment.load(this.sourceBufferProxy!).then(() => {
        this.printSegments();
      }).catch(e => {
        console.error('appendSegment', e);
        this.softDecoder = new SoftDecoder('', { yuvMode: true });
        this.video.srcObject = this.softDecoder.canvas.captureStream();
        // 监听视频播放状态
        this.video.addEventListener('play', () => {
          this.softDecoder?.start();
        });
        this.video.addEventListener('pause', () => {
          this.softDecoder?.stop();
        });
        this.video.addEventListener('ended', () => {
          this.softDecoder?.stop();
        });
        return this.appendSegment(segment).then(() => {
          this.softDecoder?.processInitialFrame();
        });
      });
    }
  }

  get bufferedLength() {
    if (!this.currentSegment) return 0;
    let length = 0;
    for (let i = this.currentSegment.index; i < this.segments.length; i++) {
      if (this.segments[i].state === 'buffered') {
        length += this.segments[i].duration;
      }
    }
    return length - (this.position - this.currentSegment.virtualStartTime);
  }

  bufferNext() {
    if (!this.currentSegment) return;
    this.currentSegment.unBuffer();
    this.currentSegment = this.segments[this.currentSegment.index + 1];
    const nextSegment = this.segments[this.currentSegment.index + 1];
    if (nextSegment) this.appendSegment(nextSegment);
  }
  set currentTime(time: number) {
    if (this.softDecoder) {
      this._offset = time - this.softDecoder.getCurrentTime() / 1000;
    } else this.video.currentTime = time;
  }
  get currentTime(): number {
    if (this.softDecoder) return this.softDecoder.getCurrentTime() / 1000 + this._offset;
    else return this.video.currentTime;
  }
  /**
   * 跳转到指定时间点
   * 支持两种播放模式：软解码器模式和 MSE（Media Source Extensions）模式
   * 
   * @param time 目标时间点（秒）
   */
  async seek(time: number) {
    console.log('seek', time);

    // 基础检查：确保存在当前片段
    if (!this.currentSegment) {
      console.warn('Seek failed: no current segment available');
      return;
    }
    this.video.pause(); // 暂停视频播放，准备跳转
    // 查找包含目标时间的片段
    // 使用 virtualEndTime > time 查找，因为我们需要第一个结束时间大于目标时间的片段
    const targetSegment = this.segments.find(segment => segment.virtualEndTime > time);
    if (!targetSegment) {
      // 目标时间超出所有片段范围，无法跳转
      console.warn(`Seek failed: target time ${time}s exceeds total duration ${this.totalDuration}s`);
      return;
    }
    console.log('targetSegment', targetSegment);

    // 计算关键参数
    const offsetInSegment = time - targetSegment.virtualStartTime; // 目标时间在目标片段内的偏移量
    const bufferRemain = this.currentSegment.virtualEndTime - this.position; // 当前片段剩余缓冲时间
    const nextSegment = this.segments[targetSegment.index + 1]; // 获取目标片段的下一个片段用于预加载

    // 软解码器模式的跳转逻辑
    if (this.softDecoder) {
      // 第一步：清理所有片段的缓冲数据
      // 无论是跳转到不同片段还是在同一片段内跳转，都需要清理缓冲
      this.segments.forEach(segment => {
        segment.unBuffer();
      });

      // 第二步：完全重置软解码器内部缓冲区
      // 清空视频和音频缓冲区，确保没有旧数据残留
      this.softDecoder.videoBuffer = [];
      this.softDecoder.audioBuffer = [];

      // 第三步：加载目标片段数据
      await targetSegment.load2(this.softDecoder);
      // 预加载下一个片段以确保播放连续性
      if (nextSegment) await this.appendSegment(nextSegment);

      // 第四步：软解码器执行跳转
      this.softDecoder.seek(time);

      // 第五步：更新时间轴状态
      this.offset = time - this.currentTime; // 重新计算时间偏移量
      this.position = time;                   // 更新当前位置
      this.currentSegment = targetSegment;    // 更新当前片段引用

      // 第六步：检查缓冲状态并开始播放
      this.checkBuffer();
      return this.video.play();
    }

    // MSE（Media Source Extensions）模式的跳转逻辑
    console.log('[MSE Seek] Starting MSE-based seeking logic', offsetInSegment, bufferRemain, nextSegment);

    // 快速跳转：如果目标片段已经缓冲完成
    if (targetSegment.state === 'buffered') {
      console.log('[MSE Seek] Fast seek: target segment already buffered', {
        segmentIndex: targetSegment.index,
        currentSegmentIndex: this.currentSegment.index,
        targetTime: time,
        segmentRange: `${targetSegment.virtualStartTime}s - ${targetSegment.virtualEndTime}s`
      });

      this.position = time;
      this.currentTime = time - this.offset;

      // 如果跳转到下一个连续片段，执行正常的缓冲切换
      if (targetSegment.index === this.currentSegment.index + 1) {
        console.log('[MSE Fast Seek] Switching to next consecutive segment, calling bufferNext()');
        this.bufferNext();
      } else {
        console.log('[MSE Fast Seek] Non-consecutive segment jump, updating currentSegment directly');
        this.currentSegment = targetSegment;
      }

      console.log('[MSE Fast Seek] Fast seek completed, starting playback');
      this.checkBuffer();
      return this.video.play();
    }

    // 完整重建：目标片段未缓冲的情况
    console.log('[MSE Seek] Full rebuild: target segment not buffered', {
      segmentIndex: targetSegment.index,
      segmentState: targetSegment.state,
      targetTime: time,
      segmentRange: `${targetSegment.virtualStartTime}s - ${targetSegment.virtualEndTime}s`
    });

    // 第一步：清理所有片段缓冲状态
    console.log('[MSE Seek 1] Step 1: Clearing all segment buffer states');
    this.segments.forEach(segment => {
      segment.unBuffer();
    });

    // 第二步：记录当前 SourceBuffer 的缓冲范围，准备清除
    let bufferStart = 0;
    let bufferEnd = 0;
    try {
      if (this.video.buffered.length > 0) {
        bufferStart = this.video.buffered.start(0);
        bufferEnd = this.video.buffered.end(this.video.buffered.length - 1);
        console.log('[MSE Seek 2] Step 2: Recorded current buffer range', {
          bufferStart: bufferStart.toFixed(2),
          bufferEnd: bufferEnd.toFixed(2),
          bufferCount: this.video.buffered.length
        });
      } else {
        console.log('[MSE Seek 2] Step 2: No existing buffer ranges to clear');
      }
    } catch (error) {
      console.warn('[MSE Seek 2] Step 2: Failed to get buffer ranges, continuing without removal', error);
    }

    // 第三步：加载目标片段到 SourceBuffer
    try {
      console.log('[MSE Seek 3] Step 3: Loading target segment to SourceBuffer');
      await targetSegment.load(this.sourceBufferProxy!);
      console.log('[MSE Seek 3] Target segment loaded successfully');

      // 预加载下一个片段
      if (nextSegment) {
        console.log('[MSE Seek 3] Preloading next segment', { nextSegmentIndex: nextSegment.index });
        await this.appendSegment(nextSegment);
        console.log('[MSE Seek 3] Next segment preloaded successfully');
      } else {
        console.log('[MSE Seek 3] No next segment to preload (reached end of playlist)');
      }
    } catch (error) {
      console.error('[MSE Seek 3] Step 3: Failed to load target segment', error);
      console.warn(`[MSE Seek 3] Seek failed: unable to load segment ${targetSegment.index}`);
      return;
    }

    this.printSegments();

    // 第四步：计算并设置新的播放时间
    console.log('[MSE Seek 4] Step 4: Calculating new playback time', {
      offsetInSegment: offsetInSegment.toFixed(2),
      bufferRemain: bufferRemain.toFixed(2),
      nextSegmentDuration: nextSegment?.duration.toFixed(2) || 'N/A',
      currentTime: this.currentTime.toFixed(2)
    });

    // 这个计算比较复杂，考虑了片段内偏移、剩余缓冲和下一片段时长
    if (nextSegment) {
      this.currentTime += offsetInSegment + bufferRemain + nextSegment.duration;
    } else {
      this.currentTime += offsetInSegment + bufferRemain;
    }
    this.offset = time - this.currentTime; // 重新计算时间偏移
    this.position = time;                   // 更新位置

    console.log('[MSE Seek 4] New time state calculated', {
      newCurrentTime: this.currentTime.toFixed(2),
      newOffset: this.offset.toFixed(2),
      newPosition: this.position.toFixed(2)
    });

    // 第五步：移除旧的缓冲数据
    try {
      if (this.video.buffered.length > 0) {
        console.log('[MSE Seek 5] Step 5: Removing old buffer data');
        await this.sourceBufferProxy!.remove(bufferStart, bufferEnd);
        console.log('[MSE Seek 5] Old buffer data removed successfully');
      } else {
        console.log('[MSE Seek 5] Step 5: No old buffer data to remove');
      }
    } catch (error) {
      console.warn('[MSE Seek 5] Step 5: Failed to remove old buffer data, continuing anyway', error);
    }

    // 第六步：更新当前片段并检查缓冲状态
    console.log('[MSE Seek 6] Step 6: Updating current segment and checking buffer');
    this.currentSegment = targetSegment;
    this.checkBuffer();

    console.log('[MSE Seek 6] Full rebuild completed, starting playback');
    return this.video.play();
  }
}

export { Timeline, MediaSegment, SourceBufferProxy };