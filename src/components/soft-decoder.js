import "./node_modules/.pnpm/jv4-decoder@1.1.3/node_modules/jv4-decoder/src/video_decoder_soft_base.js";
import "./node_modules/.pnpm/jv4-decoder@1.1.3/node_modules/jv4-decoder/wasm/types/videodec_simd.js";
import { VideoDecoderSoft as n } from "./node_modules/.pnpm/jv4-decoder@1.1.3/node_modules/jv4-decoder/src/video_decoder_soft.js";
import { AudioDecoderSoft as h } from "./node_modules/.pnpm/jv4-decoder@1.1.3/node_modules/jv4-decoder/src/audio_decoder_soft.js";
import { VideoDecoderEvent as u, AudioDecoderEvent as d } from "./node_modules/.pnpm/jv4-decoder@1.1.3/node_modules/jv4-decoder/src/types.js";
import { YuvRenderer as f } from "./yuv-renderer.js";
class T {
  videoDecoder;
  audioDecoder;
  canvas;
  audioContext = null;
  videoBuffer = [];
  audioBuffer = [];
  startTime = 0;
  isPlaying = !1;
  animationFrameId = null;
  maxBufferSize = 1 / 0;
  playbackSpeed = 1;
  keyFrameList = [];
  seekTime = null;
  timeOffset = 0;
  gl = null;
  yuvRenderer = null;
  // Audio playback related properties
  audioQueue = [];
  audioQueueTimestamps = [];
  nextAudioStartTime = 0;
  audioScheduleAheadTime = 0.2;
  // Schedule audio 200ms ahead
  lastAudioScheduleTime = 0;
  audioGain = null;
  pausedAt = null;
  constructor(i, t) {
    this.canvas = document.createElement("canvas"), this.canvas.style.width = "160px", this.canvas.style.height = "120px", document.body.appendChild(this.canvas), t?.yuvMode ? this.yuvRenderer = new f(this.canvas) : this.gl = this.canvas.getContext("2d"), this.videoDecoder = new n({
      workerMode: !1,
      yuvMode: !!this.yuvRenderer,
      canvas: this.canvas,
      wasmPath: i
    }), this.audioDecoder = new h(), this.videoDecoder.on(u.VideoFrame, (e) => {
      if (console.log("videoFrame", e), this.yuvRenderer) {
        const s = e;
        this.yuvRenderer.render(s[0], s[1], s[2], this.canvas.width, this.canvas.width / 2);
      } else
        this.gl && (this.gl.drawImage(e, 0, 0), e.close());
    }), this.videoDecoder.on(u.VideoCodecInfo, (e) => {
      this.canvas.width = e.width, this.canvas.height = e.height, this.yuvRenderer && this.yuvRenderer.setDimensions(e.width, e.height);
    }), this.videoDecoder.on(u.Error, (e) => {
      console.error(e);
    }), this.audioDecoder.on(d.AudioFrame, (e) => {
      this.audioContext || this.initAudioContext();
      const s = this.audioContext.createBuffer(
        e.numberOfChannels,
        e.numberOfFrames,
        e.sampleRate
      );
      for (let o = 0; o < e.numberOfChannels; o++) {
        const a = new Float32Array(e.numberOfFrames);
        e.copyTo(a, { planeIndex: o }), s.copyToChannel(a, o);
      }
      this.audioQueue.push(s), this.audioQueueTimestamps.push(e.timestamp), this.scheduleAudioPlayback();
    });
  }
  initAudioContext() {
    this.audioContext = new AudioContext(), this.audioGain = this.audioContext.createGain(), this.audioGain.connect(this.audioContext.destination), this.nextAudioStartTime = this.audioContext.currentTime;
  }
  scheduleAudioPlayback() {
    if (!(!this.isPlaying || !this.audioContext || this.audioQueue.length === 0) && !(this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)) {
      for (; this.audioQueue.length > 0; ) {
        const i = this.audioQueue[0], t = this.audioQueueTimestamps[0], e = this.audioContext.createBufferSource();
        e.buffer = i, e.connect(this.audioGain), e.playbackRate.value = this.playbackSpeed;
        const s = performance.now(), o = t * this.playbackSpeed, a = this.audioContext.currentTime + Math.max(0, (o - (s - this.startTime)) / 1e3), r = Math.max(
          this.audioContext.currentTime,
          Math.max(a, this.nextAudioStartTime)
        );
        if (e.start(r), this.nextAudioStartTime = r + i.duration / this.playbackSpeed, this.audioQueue.shift(), this.audioQueueTimestamps.shift(), this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)
          break;
      }
      this.lastAudioScheduleTime = this.audioContext.currentTime;
    }
  }
  setPlaybackSpeed(i) {
    if (i <= 0)
      throw new Error("Playback speed must be greater than 0");
    const t = this.getCurrentTime();
    this.startTime = performance.now() - t / i, this.playbackSpeed = i, console.log("playbackSpeed", this.playbackSpeed);
  }
  seek(i) {
    if (!this.isPlaying)
      return;
    const t = this.findNearestKeyFrame(i * 1e3);
    this.videoBuffer = this.videoBuffer.filter((e) => e.timestamp >= t), this.audioBuffer = this.audioBuffer.filter((e) => e.timestamp >= t), this.audioQueue = [], this.audioQueueTimestamps = [], this.audioContext && (this.nextAudioStartTime = this.audioContext.currentTime), this.timeOffset = i * 1e3, this.startTime = performance.now() - i * 1e3, this.seekTime = t;
  }
  findNearestKeyFrame(i) {
    for (let t = this.keyFrameList.length - 1; t >= 0; t--)
      if (this.keyFrameList[t] <= i)
        return this.keyFrameList[t];
    return this.keyFrameList[0] || 0;
  }
  start() {
    this.isPlaying || (this.isPlaying = !0, this.pausedAt !== null ? (this.startTime = performance.now() - this.pausedAt, this.pausedAt = null) : this.startTime = performance.now() - this.timeOffset, this.processNextFrame(), this.audioContext ? this.audioContext.state === "suspended" && this.audioContext.resume() : this.initAudioContext(), this.scheduleAudioPlayback());
  }
  stop() {
    this.isPlaying && (this.isPlaying = !1, this.pausedAt = this.getCurrentTime(), this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.audioContext && this.audioContext.state === "running" && this.audioContext.suspend());
  }
  getCurrentTime() {
    return this.pausedAt !== null ? this.pausedAt : (performance.now() - this.startTime + this.timeOffset) * this.playbackSpeed;
  }
  processInitialFrame() {
    if (this.videoBuffer.length > 0) {
      const i = this.videoBuffer.shift();
      i && this.videoDecoder.decode(i);
    }
  }
  processNextFrame = () => {
    if (!this.isPlaying)
      return;
    const i = this.getCurrentTime();
    if (this.videoBuffer.length && console.log(this.videoBuffer.length, this.videoBuffer[this.videoBuffer.length - 1].timestamp, i), this.seekTime !== null) {
      for (; this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp < this.seekTime; )
        this.videoBuffer.shift();
      for (; this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp < this.seekTime; )
        this.audioBuffer.shift();
      this.seekTime = null;
    }
    if (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= i) {
      const t = this.videoBuffer.shift();
      t && this.videoDecoder.decode(t);
    }
    if (this.videoBuffer.length > 0) {
      const t = this.videoBuffer.findIndex(
        (e, s) => s > 0 && e.type === "key"
      );
      t !== -1 && this.videoBuffer.slice(0, t).every((o) => o.timestamp <= i) && this.videoBuffer.splice(0, t);
    }
    if (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= i) {
      const t = this.audioBuffer.shift();
      t && this.audioDecoder.decode(t);
    }
    this.audioContext && this.audioContext.currentTime - this.lastAudioScheduleTime > this.audioScheduleAheadTime / 2 && this.scheduleAudioPlayback(), this.animationFrameId = requestAnimationFrame(this.processNextFrame);
  };
  decodeVideo(i) {
    if (this.videoBuffer.length >= this.maxBufferSize) {
      console.warn("Video buffer full, dropping frame");
      return;
    }
    i.type === "key" && this.keyFrameList.push(i.timestamp), this.videoBuffer.push(i);
  }
  decodeAudio(i) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn("Audio buffer full, dropping frame");
      return;
    }
    this.audioBuffer.push(i);
  }
  // Dispose of resources
  dispose() {
    this.stop(), this.videoBuffer = [], this.audioBuffer = [], this.audioQueue = [], this.audioQueueTimestamps = [], this.yuvRenderer && (this.yuvRenderer.dispose(), this.yuvRenderer = null), this.audioContext && (this.audioContext.close(), this.audioContext = null), this.gl = null, this.audioGain = null;
  }
}
export {
  T as SoftDecoder
};
