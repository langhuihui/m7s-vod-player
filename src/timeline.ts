const EXTINFRegex = /#EXTINF:(\d+\.\d+),(.*?),(.*?)\s*$/;

// 定义接口和类
export interface SlidingWindowConfig {
  forward: number;  // 预加载前面的片段数
  backward: number; // 保留后面的片段数
}

interface MediaSegmentInfo {
  url: string;
  duration: number;
  physicalTime: Date | null;
  codec: string | null;
}

class MediaSegment {
  url: string;             // 片段URL
  duration: number;        // 片段实际持续时间
  virtualStartTime: number; // 虚拟时间轴上的开始时间
  virtualEndTime: number;   // 虚拟时间轴上的结束时间
  physicalTime: Date | null; // 物理时间（从EXTINF中解析）
  codec: string | null;     // 编解码器信息（从EXTINF中解析）
  data?: Promise<ArrayBuffer>;       // 片段的二进制数据
  state: 'init' | 'loading' | 'loaded' | 'buffering' | 'buffered' = 'init';
  constructor(public index: number, info: MediaSegmentInfo) {
    this.url = info.url;
    this.duration = info.duration;
    this.virtualStartTime = 0;
    this.virtualEndTime = 0;
    this.physicalTime = info.physicalTime;
    this.codec = info.codec;
  }
  async load(bufferProxy: SourceBufferProxy) {
    this.state = 'loading';
    if (!this.data) {
      const response = await fetch(this.url);
      this.data = response.arrayBuffer();
    }
    const data = await this.data;
    if (this.state !== 'loading') {
      // 取消appendBuffer
      return;
    }
    this.state = 'buffering';
    await bufferProxy.appendBuffer(data);
    this.state = 'buffered';
  }
  unBuffer() {
    if (this.state === 'init') return;
    this.state = 'loaded';
  }
}

class SourceBufferProxy {
  queue: { data: ArrayBuffer, resolve: () => void, reject: (e: Event) => void; }[] = []; // 排队
  removeQueue: { start: number, end: number, resolve: () => void, reject: (e: Event) => void; }[] = [];
  currentWaiting?: () => void;
  currentError: (e: Event) => void = () => { };
  constructor(public sourceBuffer: SourceBuffer) {
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
  appendBuffer(data: ArrayBuffer) {
    if (!this.currentWaiting) {
      this.sourceBuffer.appendBuffer(data);
      return new Promise<void>((resolve, reject) => {
        this.currentWaiting = resolve;
        this.currentError = reject;
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        this.queue.push({ data, resolve, reject });
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
  let segmentCodec: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 解析EXTINF行
    if (line.startsWith("#EXTINF:")) {
      const match = line.match(EXTINFRegex);
      if (match) {
        segmentDuration = parseFloat(match[1]);
        const timeString = match[2] ? match[2].trim() : "";
        const codecString = match[3] ? match[3].trim() : "";

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

        // 解析编解码器信息
        segmentCodec = codecString || null;
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
        codec: segmentCodec,
      });
      segment.virtualStartTime = virtualStartTime;
      segment.virtualEndTime = virtualEndTime;
      segments.push(segment);

      totalDuration += segmentDuration;
      segmentIndex++;
      segmentTime = null;
      segmentCodec = null;
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
  windowSize: number = 2;
  currentSegment?: MediaSegment;
  urlSrouce?: string;
  debug: boolean = false;
  singleFmp4: boolean = false;
  updatePosition = () => {
    this.position = this.video.currentTime + this.offset;
    this.checkBuffer();
  };
  onWaiting = () => {
    const buffered = this.video.buffered;
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      if (this.video.currentTime >= start) {
        continue;
      }
      this.video.currentTime = start;
      this.video.play();
    }
  };
  constructor(public video: HTMLVideoElement, opt: { debug: boolean; } = { debug: false }) {
    this.debug = opt.debug;
  }
  async load(url: string, codec?: string) {
    console.log('load', url, codec);
    const mediaSource = this.mediaSource;
    const urlObj = new URL(url);
    switch (urlObj.pathname.split('.').pop()) {
      case 'm3u8':
        this.singleFmp4 = false;
        const m3u8Content = await fetch(url).then(res => res.text());
        const playlist = createPlaylistFromM3U8(m3u8Content, urlObj.origin + urlObj.pathname.split("/").slice(0, -1).join("/"));
        this.segments = playlist.segments;
        this.totalDuration = playlist.totalDuration;
        this.urlSrouce = URL.createObjectURL(mediaSource);
        this.video.src = this.urlSrouce;
        this.currentSegment = this.segments[0];
        mediaSource.addEventListener('sourceopen', () => {
          const sourceBuffer = mediaSource.addSourceBuffer(`video/mp4; codecs="${codec || this.segments[0].codec}"`);
          sourceBuffer.mode = 'sequence';
          this.sourceBufferProxy = new SourceBufferProxy(sourceBuffer);
          for (let i = 0; i < 2 && i < this.segments.length; i++) {
            this.appendSegment(this.segments[i]);
          }
        });
        mediaSource.addEventListener('sourceended', () => {
          this.video.pause();
        });
        this.video.addEventListener('timeupdate', this.updatePosition);
        this.video.addEventListener('waiting', this.onWaiting);
        break;
      case 'fmp4':
        this.singleFmp4 = true;
        this.urlSrouce = URL.createObjectURL(mediaSource);
        this.video.src = this.urlSrouce;
        const fmp4Buffer = fetch(url).then(res => res.arrayBuffer());
        mediaSource.addEventListener('sourceopen', async () => {
          const sourceBuffer = mediaSource.addSourceBuffer(`video/mp4; codecs="${codec}"`);
          sourceBuffer.mode = 'sequence';
          sourceBuffer.appendBuffer(await fmp4Buffer);
          sourceBuffer.addEventListener('updateend', () => {
            this.mediaSource.endOfStream();
          });
        });
        break;
    }
  }
  destroy() {
    this.video.pause();
    this.video.src = '';
    this.video.removeEventListener('timeupdate', this.updatePosition);
    this.video.removeEventListener('waiting', this.onWaiting);
    if (this.mediaSource?.readyState === 'open') {
      this.mediaSource.endOfStream();
    }
    if (this.urlSrouce) {
      URL.revokeObjectURL(this.urlSrouce);
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

  appendSegment(segment: MediaSegment) {
    segment.load(this.sourceBufferProxy!).then(() => {
      this.printSegments();
    });
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

  async seek(time: number) {
    if (!this.currentSegment) return;
    const targetSegment = this.segments.find(segment => segment.virtualEndTime > time);
    if (!targetSegment) {
      return;
    }
    if (targetSegment.state === 'buffered') {
      this.position = time;
      this.video.currentTime = time - this.offset;
      if (targetSegment.index === this.currentSegment.index + 1) {
        this.bufferNext();
      }
      return this.video.play();
    }
    this.segments.forEach(segment => {
      segment.unBuffer();
    });
    const nextSegment = this.segments[targetSegment.index + 1];
    const bufferStart = this.video.buffered.start(0);
    const bufferEnd = this.video.buffered.end(this.video.buffered.length - 1);
    const offsetInSegment = time - targetSegment.virtualStartTime;
    const bufferRemain = this.currentSegment.virtualEndTime - this.position;
    await targetSegment.load(this.sourceBufferProxy!);
    const targetNextSegment = this.segments[targetSegment.index + 1];
    if (targetNextSegment) this.appendSegment(targetNextSegment);
    this.printSegments();
    this.video.currentTime += offsetInSegment + bufferRemain + nextSegment.duration;
    this.offset = time - this.video.currentTime;
    this.position = time;
    await this.sourceBufferProxy!.remove(bufferStart, bufferEnd);
    this.currentSegment = targetSegment;
    this.checkBuffer();
    return this.video.play();
  }
}

export { Timeline, MediaSegment, SourceBufferProxy };