import { buffer, ISink } from "fastrx";
import { Fmp4Parser, Track } from "./fmp4-parser";
import { SoftDecoder } from "./soft-decoder";
import { SourceBufferProxy } from "./source-buffer-proxy";
import { EventEmitter } from "eventemitter3";

export interface MediaSegmentInfo {
  url: string;
  duration: number;
  physicalTime: Date | null;
}

export interface LoadingProgress {
  loaded: number;
  total: number;
}

export class MediaSegment extends EventEmitter {
  url: string;             // 片段URL
  duration: number;        // 片段实际持续时间
  virtualStartTime: number; // 虚拟时间轴上的开始时间
  virtualEndTime: number;   // 虚拟时间轴上的结束时间
  physicalTime: Date | null; // 物理时间（从EXTINF中解析）
  data?: Promise<ArrayBuffer>;       // 片段的二进制数据
  fmp4Parser = new Fmp4Parser(false);
  tracks: Track[] = [];
  loadingProgress: LoadingProgress = { loaded: 0, total: 0 };
  constructor(public index: number, info: MediaSegmentInfo) {
    super();
    this.url = info.url;
    this.duration = info.duration;
    this.virtualStartTime = 0;
    this.virtualEndTime = 0;
    this.physicalTime = info.physicalTime;
  }

  protected async fetchWithProgress(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const reader = response.body!.getReader();
    const contentLength = +response.headers.get('Content-Length')!;

    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      // 更新进度
      this.loadingProgress = {
        loaded: receivedLength,
        total: contentLength,
      };
      this.emit('progress', this.loadingProgress);
    }

    // 合并所有chunks
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    return chunksAll.buffer;
  }

  async _load() {
    console.log('load', this.index);
    if (!this.data) this.data = this.fetchWithProgress(this.url);
    const data = await this.data;
    if (this.tracks.length === 0) {
      this.tracks = this.fmp4Parser.parse(data);
    }
    return data;
  }

  load(bufferProxy: SourceBufferProxy, ready: Promise<void>) {
    return async (sink: ISink<boolean>) => {
      const data = await this._load();
      if (sink.disposed) return
      await ready;
      if (sink.disposed) return
      if (!bufferProxy.initialized) {
        const codec = `video/mp4; codecs="${this.tracks.map(track => track.codec).join(', ')}"`;
        if (MediaSource.isTypeSupported(codec)) {
          bufferProxy.init(codec);
        } else {
          sink.error(new Error(`Unsupported codec: ${codec}`));
          return;
        }
      }
      // sink.error(new Error('test'));
      // return;
      try {
        await bufferProxy.appendBuffer({ data, tracks: this.tracks });
        sink.next(true);
        sink.complete();
      } catch (err) {
        sink.error(err);
      }
    }
  }
  downgrade(decoder: SoftDecoder) {
    this.load = function () {
      return async (sink: ISink<boolean>) => {
        await this._load();
        if (sink.disposed) return
        const videoTracks = this.tracks.filter(track => track.type === 'video');
        const audioTracks = this.tracks.filter(track => track.type === 'audio');
        for (const track of videoTracks) {
          if (decoder.videoDecoder.state !== 'configured') {
            await decoder.videoDecoder.initialize();
            if (sink.disposed) return
            await decoder.videoDecoder.configure({
              codec: track.codec.startsWith('avc1') ? 'avc' : 'hevc',
              description: track.codecInfo?.extraData,
            });
            if (sink.disposed) return
            decoder.canvas.width = track.width ?? 1920;
            decoder.canvas.height = track.height ?? 1080;
          }
          let timestamp = this.virtualStartTime * 1000;
          track.samples.forEach(sample => {
            decoder.decodeVideo({
              data: sample.data,
              timestamp,
              type: sample.keyFrame ? 'key' : 'delta'
            });
            timestamp += sample.duration ?? 0;
          });
        }
        for (const track of audioTracks) {
          if (decoder.audioDecoder.state !== 'configured') {
            await decoder.audioDecoder.initialize();
            if (sink.disposed) return
            await decoder.audioDecoder.configure({
              codec: 'aac',
              description: track.codecInfo?.extraData,
              numberOfChannels: track.channelCount ?? 2,
              sampleRate: track.sampleRate ?? 44100,
            });
            if (sink.disposed) return
          }
          let timestamp = this.virtualStartTime * 1000;
          track.samples.forEach(sample => {
            decoder.decodeAudio({
              data: sample.data,
              timestamp: timestamp,
              type: 'key'
            });
            timestamp += sample.duration ?? 0;
          });
        }
        sink.next(true);
        sink.complete();
      }
    }
  }
}
