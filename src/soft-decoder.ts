import { VideoDecoderSoftSIMD } from "jv4-decoder/src/video_decoder_soft_simd";
import { VideoDecoderSoft } from "jv4-decoder/src/video_decoder_soft";
import { AudioDecoderSoft } from "jv4-decoder/src/audio_decoder_soft";
import { VideoDecoderEvent, AudioDecoderEvent, type VideoCodecInfo } from "jv4-decoder/src/types";
import { YuvRenderer } from "./yuv-renderer";


export class SoftDecoder {
  videoDecoder: VideoDecoderSoft;
  audioDecoder: AudioDecoderSoft;
  canvas: HTMLCanvasElement;
  audioContext: AudioContext | null = null;
  videoBuffer: EncodedVideoChunkInit[] = [];
  audioBuffer: EncodedAudioChunkInit[] = [];
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private animationFrameId: number | null = null;
  private maxBufferSize: number = Infinity;
  private playbackSpeed: number = 1;
  private keyFrameList: number[] = [];
  private seekTime: number | null = null;
  private timeOffset: number = 0;
  private gl: CanvasRenderingContext2D | null = null;
  private yuvRenderer: YuvRenderer | null = null;
  // Audio playback related properties
  private audioQueue: AudioBuffer[] = [];
  private audioQueueTimestamps: number[] = [];
  private nextAudioStartTime: number = 0;
  private audioScheduleAheadTime: number = 0.2; // Schedule audio 200ms ahead
  private lastAudioScheduleTime: number = 0;
  private audioGain: GainNode | null = null;
  private pausedAt: number | null = null;

  constructor(wasmPath: string, options?: { yuvMode?: boolean; }) {
    this.canvas = document.createElement('canvas');

    if (options?.yuvMode || false) {
      this.yuvRenderer = new YuvRenderer(this.canvas);
    } else {
      this.gl = this.canvas.getContext('2d');
    }

    this.videoDecoder = new VideoDecoderSoft({
      workerMode: false,
      yuvMode: !!this.yuvRenderer,
      canvas: this.canvas,
      wasmPath,
    });
    this.audioDecoder = new AudioDecoderSoft();

    this.videoDecoder.on(VideoDecoderEvent.VideoFrame, (videoFrame: VideoFrame) => {
      if (this.yuvRenderer) {
        const yuvData = videoFrame as unknown as [y: Uint8Array, u: Uint8Array, v: Uint8Array];
        this.yuvRenderer.render(yuvData[0], yuvData[1], yuvData[2], this.canvas.width, this.canvas.width / 2);
      } else if (this.gl) {
        // Use 2D canvas for RGB frames
        this.gl.drawImage(videoFrame, 0, 0);
        videoFrame.close();
      }
    });
    this.videoDecoder.on(VideoDecoderEvent.VideoCodecInfo, (info: VideoCodecInfo) => {
      this.canvas.width = info.width;
      this.canvas.height = info.height;
      if (this.yuvRenderer) this.yuvRenderer.setDimensions(info.width, info.height);
    });
    this.videoDecoder.on(VideoDecoderEvent.Error, (error: Error) => {
      console.error(error);
    });

    this.audioDecoder.on(AudioDecoderEvent.AudioFrame, (audioFrame: AudioData) => {
      if (!this.audioContext) {
        this.initAudioContext();
      }

      const audioBuffer = this.audioContext!.createBuffer(
        audioFrame.numberOfChannels,
        audioFrame.numberOfFrames,
        audioFrame.sampleRate
      );

      for (let i = 0; i < audioFrame.numberOfChannels; i++) {
        const channelData = new Float32Array(audioFrame.numberOfFrames);
        audioFrame.copyTo(channelData, { planeIndex: i });
        audioBuffer.copyToChannel(channelData, i);
      }

      // Add the buffer to the queue instead of playing immediately
      this.audioQueue.push(audioBuffer);
      this.audioQueueTimestamps.push(audioFrame.timestamp);

      // Schedule audio playback if needed
      this.scheduleAudioPlayback();
    });
  }

  private initAudioContext() {
    this.audioContext = new AudioContext();
    this.audioGain = this.audioContext.createGain();
    this.audioGain.connect(this.audioContext.destination);
    this.nextAudioStartTime = this.audioContext.currentTime;
  }

  private scheduleAudioPlayback() {
    if (!this.isPlaying || !this.audioContext || this.audioQueue.length === 0) {
      return;
    }

    // If we're already scheduled ahead enough, don't schedule more
    if (this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime) {
      return;
    }

    // Process buffers in the queue that need to be scheduled
    while (this.audioQueue.length > 0) {
      const buffer = this.audioQueue[0];
      const timestamp = this.audioQueueTimestamps[0];

      // Create source node for this buffer
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioGain!);
      source.playbackRate.value = this.playbackSpeed;

      // Calculate exact playback time
      const currentTime = performance.now();
      const adjustedTimestamp = timestamp * this.playbackSpeed;
      const idealPlaybackTime = this.audioContext.currentTime +
        Math.max(0, (adjustedTimestamp - (currentTime - this.startTime)) / 1000);

      // Determine the actual start time, ensuring continuity
      const actualStartTime = Math.max(this.audioContext.currentTime,
        Math.max(idealPlaybackTime, this.nextAudioStartTime));

      // Start playback and remove from queue
      source.start(actualStartTime);

      // Update next start time to ensure continuous playback
      this.nextAudioStartTime = actualStartTime + buffer.duration / this.playbackSpeed;

      // Remove from queue
      this.audioQueue.shift();
      this.audioQueueTimestamps.shift();

      // If we've scheduled enough ahead, break out
      if (this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime) {
        break;
      }
    }

    // Schedule next check
    this.lastAudioScheduleTime = this.audioContext.currentTime;
  }

  setPlaybackSpeed(speed: number) {
    if (speed <= 0) {
      throw new Error('Playback speed must be greater than 0');
    }
    this.playbackSpeed = speed;
  }

  seek(timestamp: number) {
    if (!this.isPlaying) return;

    // Find the nearest keyframe before the requested timestamp
    const keyFrameTimestamp = this.findNearestKeyFrame(timestamp);

    // Clear existing buffers
    this.videoBuffer = this.videoBuffer.filter(item => item.timestamp >= keyFrameTimestamp);
    this.audioBuffer = this.audioBuffer.filter(item => item.timestamp >= keyFrameTimestamp);

    // Clear audio queue
    this.audioQueue = [];
    this.audioQueueTimestamps = [];

    // Reset audio playback
    if (this.audioContext) {
      this.nextAudioStartTime = this.audioContext.currentTime;
    }

    // Update time tracking
    this.timeOffset = timestamp;
    this.startTime = performance.now() - timestamp;
    this.seekTime = keyFrameTimestamp;
  }

  private findNearestKeyFrame(timestamp: number): number {
    // Find the largest keyframe timestamp that is less than or equal to the target timestamp
    for (let i = this.keyFrameList.length - 1; i >= 0; i--) {
      if (this.keyFrameList[i] <= timestamp) {
        return this.keyFrameList[i];
      }
    }
    return this.keyFrameList[0] || 0;
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // 如果之前暂停过，从暂停时间继续
    if (this.pausedAt !== null) {
      this.startTime = performance.now() - this.pausedAt;
      this.pausedAt = null;
    } else {
      this.startTime = performance.now() - this.timeOffset;
    }

    // 先处理一帧以启动视频
    this.processInitialFrame();

    // 启动帧处理循环
    this.processNextFrame();

    // Initialize audio context if needed
    if (!this.audioContext) {
      this.initAudioContext();
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Schedule any audio that's already in the queue
    this.scheduleAudioPlayback();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    // 记录暂停时的时间偏移
    this.pausedAt = this.getCurrentTime();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Suspend audio context to pause audio
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }

  private getCurrentTime(): number {
    if (this.pausedAt !== null) {
      return this.pausedAt;
    }
    return (performance.now() - this.startTime) * this.playbackSpeed;
  }

  private processInitialFrame() {
    // 处理视频缓冲区中的第一帧
    if (this.videoBuffer.length > 0) {
      const frame = this.videoBuffer[0];
      if (frame) {
        this.videoDecoder.decode(frame);
      }
    }
  }

  private processNextFrame = () => {
    if (!this.isPlaying) return;

    const currentTime = this.getCurrentTime();

    // Handle seeking
    if (this.seekTime !== null) {
      // Skip frames until we reach the seek point
      while (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp < this.seekTime) {
        this.videoBuffer.shift();
      }
      while (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp < this.seekTime) {
        this.audioBuffer.shift();
      }
      this.seekTime = null;
    }

    // Process video buffer
    if (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= currentTime) {
      const frame = this.videoBuffer.shift();
      if (frame) {
        this.videoDecoder.decode(frame);
      }
    }

    // Process audio buffer
    if (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= currentTime) {
      const frame = this.audioBuffer.shift();
      if (frame) {
        this.audioDecoder.decode(frame);
      }
    }

    // Regularly check and schedule audio playback
    if (this.audioContext &&
      this.audioContext.currentTime - this.lastAudioScheduleTime > this.audioScheduleAheadTime / 2) {
      this.scheduleAudioPlayback();
    }

    this.animationFrameId = requestAnimationFrame(this.processNextFrame);
  };

  decodeVideo(data: EncodedVideoChunkInit) {
    if (this.videoBuffer.length >= this.maxBufferSize) {
      console.warn('Video buffer full, dropping frame');
      return;
    }

    const isKeyFrame = data.type === 'key';
    if (isKeyFrame) {
      this.keyFrameList.push(data.timestamp!);
    }

    this.videoBuffer.push(data);
    if (!this.isPlaying) this.start();
  }

  decodeAudio(data: EncodedAudioChunkInit) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn('Audio buffer full, dropping frame');
      return;
    }
    this.audioBuffer.push(data);
    if (!this.isPlaying) this.start();
  }

  // Get current playback position
  getCurrentPosition(): number {
    return this.getCurrentTime();
  }

  // Dispose of resources
  dispose(): void {
    // Stop playback
    this.stop();

    // Clear buffers
    this.videoBuffer = [];
    this.audioBuffer = [];
    this.audioQueue = [];
    this.audioQueueTimestamps = [];

    // Clean up YUV renderer if it exists
    if (this.yuvRenderer) {
      this.yuvRenderer.dispose();
      this.yuvRenderer = null;
    }

    // Close audio context if it exists
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Remove references
    this.gl = null;
    this.audioGain = null;
  }
}
