import { VideoDecoderSoftSIMD } from "jv4-decoder/src/video_decoder_soft_simd";
import { AudioDecoderSoft } from "jv4-decoder/src/audio_decoder_soft";
import { VideoDecoderEvent, AudioDecoderEvent, type VideoCodecInfo } from "jv4-decoder/src/types";


export class SoftDecoder {
  videoDecoder: VideoDecoderSoftSIMD;
  audioDecoder: AudioDecoderSoft;
  canvas: HTMLCanvasElement;
  videoTimestamp: number = 0;
  audioTimestamp: number = 0;
  audioContext: AudioContext | null = null;
  private videoBuffer: EncodedVideoChunkInit[] = [];
  private audioBuffer: EncodedAudioChunkInit[] = [];
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private animationFrameId: number | null = null;
  private maxBufferSize: number = Infinity;
  private playbackSpeed: number = 1.0;
  private keyFrameList: number[] = [];
  private seekTime: number | null = null;
  private timeOffset: number = 0;

  constructor(wasmPath: string) {
    this.canvas = document.createElement('canvas');
    this.videoDecoder = new VideoDecoderSoftSIMD({
      workerMode: false,
      yuvMode: false,
      canvas: this.canvas,
      wasmPath,
    });
    this.audioDecoder = new AudioDecoderSoft();

    this.videoDecoder.on(VideoDecoderEvent.VideoFrame, (videoFrame: VideoFrame) => {
      console.log(videoFrame);
      this.canvas.getContext('2d')?.drawImage(videoFrame, 0, 0);
    });
    this.videoDecoder.on(VideoDecoderEvent.VideoCodecInfo, (info: VideoCodecInfo) => {
      this.canvas.width = info.width;
      this.canvas.height = info.height;
    });
    this.videoDecoder.on(VideoDecoderEvent.Error, (error: Error) => {
      console.error(error);
    });

    this.audioDecoder.on(AudioDecoderEvent.AudioFrame, (audioFrame: AudioData) => {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const audioBuffer = this.audioContext.createBuffer(
        audioFrame.numberOfChannels,
        audioFrame.numberOfFrames,
        audioFrame.sampleRate
      );

      for (let i = 0; i < audioFrame.numberOfChannels; i++) {
        const channelData = new Float32Array(audioFrame.numberOfFrames);
        audioFrame.copyTo(channelData, { planeIndex: i });
        audioBuffer.copyToChannel(channelData, i);
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.playbackRate.value = this.playbackSpeed;

      const currentTime = performance.now();
      const adjustedTimestamp = audioFrame.timestamp * this.playbackSpeed;
      const playbackTime = this.audioContext.currentTime +
        Math.max(0, (adjustedTimestamp - (currentTime - this.startTime)) / 1000);

      source.start(playbackTime);
    });
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

    // Update time tracking
    this.timeOffset = timestamp;
    this.startTime = performance.now() - (timestamp / this.playbackSpeed);
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
    this.startTime = performance.now() - (this.timeOffset / this.playbackSpeed);
    this.processNextFrame();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.timeOffset = this.getCurrentTime();
  }

  private getCurrentTime(): number {
    return (performance.now() - this.startTime) * this.playbackSpeed;
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
    while (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= currentTime) {
      const frame = this.videoBuffer.shift();
      if (frame) {
        this.videoDecoder.decode(frame);
      }
    }

    // Process audio buffer
    while (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= currentTime) {
      const frame = this.audioBuffer.shift();
      if (frame) {
        this.audioDecoder.decode(frame);
      }
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
  }

  decodeAudio(data: EncodedAudioChunkInit) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn('Audio buffer full, dropping frame');
      return;
    }
    this.audioBuffer.push(data);
  }

  // Get current playback position
  getCurrentPosition(): number {
    return this.getCurrentTime();
  }
}
