import { Fmp4Parser as m } from "./fmp4-parser.js";
import { SoftDecoder as g } from "./soft-decoder.js";
const p = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
class v {
  constructor(e, t) {
    this.index = e, this.url = t.url, this.duration = t.duration, this.virtualStartTime = 0, this.virtualEndTime = 0, this.physicalTime = t.physicalTime;
  }
  url;
  // 片段URL
  duration;
  // 片段实际持续时间
  virtualStartTime;
  // 虚拟时间轴上的开始时间
  virtualEndTime;
  // 虚拟时间轴上的结束时间
  physicalTime;
  // 物理时间（从EXTINF中解析）
  data;
  // 片段的二进制数据
  state = "init";
  fmp4Parser = new m(!1);
  tracks = [];
  softDecoder;
  async load(e) {
    if (this.state = "loading", !this.data) {
      const s = await fetch(this.url);
      this.data = s.arrayBuffer();
    }
    const t = await this.data;
    if (this.tracks.length === 0) {
      this.tracks = this.fmp4Parser.parse(t);
      const s = `video/mp4; codecs="${this.tracks.map((i) => i.codec).join(", ")}"`;
      if (!e.initialized)
        if (MediaSource.isTypeSupported(s))
          e.init(s);
        else
          throw new Error(`Unsupported codec: ${s}`);
    }
    this.state === "loading" && (this.state = "buffering", await e.appendBuffer({ data: t, tracks: this.tracks }), this.state = "buffered");
  }
  async load2(e) {
    if (this.softDecoder = e, this.state === "init") {
      if (this.state = "loading", !this.data) {
        const r = await fetch(this.url);
        this.data = r.arrayBuffer();
      }
      const i = await this.data;
      this.tracks = this.fmp4Parser.parse(i), this.state = "buffering";
    }
    const t = this.tracks.filter((i) => i.type === "video"), s = this.tracks.filter((i) => i.type === "audio");
    for (const i of t) {
      e.videoDecoder.state !== "configured" && (await e.videoDecoder.initialize(), await e.videoDecoder.configure({
        codec: i.codec.startsWith("avc1") ? "avc" : "hevc",
        description: i.codecInfo?.extraData
      }), e.canvas.width = i.width ?? 1920, e.canvas.height = i.height ?? 1080);
      let r = this.virtualStartTime * 1e3;
      i.samples.forEach((n) => {
        e.decodeVideo({
          data: n.data,
          timestamp: r,
          type: n.keyFrame ? "key" : "delta"
        }), r += n.duration ?? 0;
      });
    }
    for (const i of s) {
      e.audioDecoder.state !== "configured" && (await e.audioDecoder.initialize(), await e.audioDecoder.configure({
        codec: "aac",
        description: i.codecInfo?.extraData,
        numberOfChannels: i.channelCount ?? 2,
        sampleRate: i.sampleRate ?? 44100
      }));
      let r = this.virtualStartTime * 1e3;
      i.samples.forEach((n) => {
        e.decodeAudio({
          data: n.data,
          timestamp: r,
          type: "key"
        }), r += n.duration ?? 0;
      });
    }
    this.state = "buffered";
  }
  unBuffer() {
    this.state !== "init" && (this.state = "loaded", this.softDecoder && (this.softDecoder.videoBuffer = this.softDecoder.videoBuffer.filter(
      (e) => e.timestamp < this.virtualStartTime * 1e3 || e.timestamp >= this.virtualEndTime * 1e3
    ), this.softDecoder.audioBuffer = this.softDecoder.audioBuffer.filter(
      (e) => e.timestamp < this.virtualStartTime * 1e3 || e.timestamp >= this.virtualEndTime * 1e3
    )));
  }
}
class S {
  constructor(e) {
    this.mediaSource = e;
  }
  queue = [];
  // 排队
  removeQueue = [];
  currentWaiting;
  currentError = () => {
  };
  sourceBuffer;
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(e) {
    console.log("init", e), this.sourceBuffer = this.mediaSource.addSourceBuffer(e), this.sourceBuffer.mode = "sequence", this.sourceBuffer.addEventListener("updateend", () => {
      if (this.currentWaiting?.(), this.removeQueue.length > 0) {
        const { start: t, end: s, resolve: i, reject: r } = this.removeQueue.shift();
        this.sourceBuffer.remove(t, s), this.currentWaiting = i, this.currentError = r;
      } else if (this.queue.length > 0) {
        const { data: t, resolve: s, reject: i } = this.queue.shift();
        this.sourceBuffer.appendBuffer(t), this.currentWaiting = s, this.currentError = i;
      } else
        delete this.currentWaiting;
    }), this.sourceBuffer.addEventListener("error", (t) => {
      this.currentError(t);
    });
  }
  appendBuffer(e) {
    return this.currentWaiting ? new Promise((t, s) => {
      this.queue.push({ data: e.data, resolve: t, reject: s });
    }) : (this.sourceBuffer.appendBuffer(e.data), new Promise((t, s) => {
      this.currentWaiting = t, this.currentError = s;
    }));
  }
  remove(e, t) {
    return this.currentWaiting ? new Promise((s, i) => {
      this.removeQueue.push({ start: e, end: t, resolve: s, reject: i });
    }) : (this.sourceBuffer.remove(e, t), new Promise((s, i) => {
      this.currentWaiting = s, this.currentError = i;
    }));
  }
}
function T(d, e) {
  const t = d.split(`
`), s = [];
  let i = 0, r = 0, n = 0, a = null;
  for (let o = 0; o < t.length; o++) {
    const h = t[o].trim();
    if (h.startsWith("#EXTINF:")) {
      const u = h.match(p);
      if (u) {
        n = parseFloat(u[1]);
        const c = u[2] ? u[2].trim() : "";
        try {
          c ? a = new Date(c) : a = null;
        } catch {
          a = null;
        }
      }
    } else if (!h.startsWith("#") && h !== "") {
      const u = new URL(h, e), c = i, l = i + n, f = new v(r, {
        url: u.toString(),
        duration: n,
        physicalTime: a
      });
      f.virtualStartTime = c, f.virtualEndTime = l, s.push(f), i += n, r++, a = null;
    }
  }
  return { segments: s, totalDuration: i };
}
class E {
  constructor(e, t = { debug: !1 }) {
    this.video = e, this.debug = t.debug;
  }
  segments = [];
  totalDuration = 0;
  mediaSource = new MediaSource();
  sourceBufferProxy;
  position = 0;
  offset = 0;
  _offset = 0;
  windowSize = 2;
  currentSegment;
  urlSrouce;
  debug = !1;
  singleFmp4 = !1;
  softDecoder;
  updatePosition = () => {
    this.position = this.currentTime + this.offset, this.checkBuffer();
  };
  onWaiting = () => {
    const e = this.video.buffered;
    for (let t = 0; t < e.length; t++) {
      const s = e.start(t);
      this.currentTime >= s || (this.currentTime = s, this.video.play());
    }
  };
  async load(e) {
    console.log("load", e);
    const t = this.mediaSource, s = new URL(e);
    switch (s.pathname.split(".").pop()) {
      case "m3u8":
        this.singleFmp4 = !1;
        const i = await fetch(e).then((n) => n.text()), r = T(i, s.origin + s.pathname.split("/").slice(0, -1).join("/"));
        console.log("playlist", r), this.segments = r.segments, this.totalDuration = r.totalDuration, this.urlSrouce = URL.createObjectURL(t), this.video.src = this.urlSrouce, this.currentSegment = this.segments[0], this.sourceBufferProxy = new S(t), t.addEventListener("sourceopen", async () => {
          for (let n = 0; n < 2 && n < this.segments.length; n++)
            await this.appendSegment(this.segments[n]);
        }), t.addEventListener("sourceended", () => {
          this.video.pause();
        }), this.video.addEventListener("timeupdate", this.updatePosition), this.video.addEventListener("waiting", this.onWaiting);
        break;
    }
  }
  destroy() {
    this.video.pause(), this.video.src = "", this.video.removeEventListener("timeupdate", this.updatePosition), this.video.removeEventListener("waiting", this.onWaiting), this.mediaSource?.readyState === "open" && this.mediaSource.endOfStream(), this.urlSrouce && URL.revokeObjectURL(this.urlSrouce), this.softDecoder && this.softDecoder.dispose();
  }
  printSegments() {
    this.debug && console.table(this.segments.map((e) => ({
      state: e.state,
      virtualStartTime: e.virtualStartTime,
      virtualEndTime: e.virtualEndTime,
      duration: e.duration
    })));
  }
  checkBuffer() {
    if (!this.currentSegment)
      return;
    let e = "";
    for (let t = 0; t < this.video.buffered.length; t++) {
      const s = this.video.buffered.start(t).toFixed(2), i = this.video.buffered.end(t).toFixed(2);
      e += `[${s}-${i}] `;
    }
    if (this.debug && console.debug(
      `Time: ${this.video.currentTime.toFixed(2)}, Buffered: ${e}，BufferedLength: ${this.bufferedLength.toFixed(2)}`
    ), this.position >= this.currentSegment.virtualEndTime)
      if (this.segments.length > this.currentSegment.index + 1)
        this.bufferNext(), this.printSegments();
      else
        return;
  }
  async appendSegment(e) {
    if (this.softDecoder)
      await e.load2(this.softDecoder), this.printSegments();
    else
      return e.load(this.sourceBufferProxy).then(() => {
        this.printSegments();
      }).catch((t) => (console.error("appendSegment", t), this.softDecoder = new g("", { yuvMode: !0 }), this.video.srcObject = this.softDecoder.canvas.captureStream(), this.video.addEventListener("play", () => {
        this.softDecoder?.start();
      }), this.video.addEventListener("pause", () => {
        this.softDecoder?.stop();
      }), this.video.addEventListener("ended", () => {
        this.softDecoder?.stop();
      }), this.appendSegment(e).then(() => {
        this.softDecoder?.processInitialFrame();
      })));
  }
  get bufferedLength() {
    if (!this.currentSegment)
      return 0;
    let e = 0;
    for (let t = this.currentSegment.index; t < this.segments.length; t++)
      this.segments[t].state === "buffered" && (e += this.segments[t].duration);
    return e - (this.position - this.currentSegment.virtualStartTime);
  }
  bufferNext() {
    if (!this.currentSegment)
      return;
    this.currentSegment.unBuffer(), this.currentSegment = this.segments[this.currentSegment.index + 1];
    const e = this.segments[this.currentSegment.index + 1];
    e && this.appendSegment(e);
  }
  set currentTime(e) {
    this.softDecoder ? this._offset = e - this.softDecoder.getCurrentTime() / 1e3 : this.video.currentTime = e;
  }
  get currentTime() {
    return this.softDecoder ? this.softDecoder.getCurrentTime() / 1e3 + this._offset : this.video.currentTime;
  }
  async seek(e) {
    if (!this.currentSegment)
      return;
    const t = this.segments.find((o) => o.virtualEndTime > e);
    if (!t)
      return;
    const s = e - t.virtualStartTime, i = this.currentSegment.virtualEndTime - this.position, r = this.segments[t.index + 1];
    if (this.softDecoder)
      return this.segments.forEach((o) => {
        o.unBuffer();
      }), this.softDecoder.videoBuffer = [], this.softDecoder.audioBuffer = [], await t.load2(this.softDecoder), r && await this.appendSegment(r), this.softDecoder.seek(e), this.offset = e - this.currentTime, this.position = e, this.currentSegment = t, this.checkBuffer(), this.video.play();
    if (t.state === "buffered")
      return this.position = e, this.currentTime = e - this.offset, t.index === this.currentSegment.index + 1 && this.bufferNext(), this.video.play();
    this.segments.forEach((o) => {
      o.unBuffer();
    });
    const n = this.video.buffered.start(0), a = this.video.buffered.end(this.video.buffered.length - 1);
    return await t.load(this.sourceBufferProxy), r && await this.appendSegment(r), this.printSegments(), this.currentTime += s + i + r.duration, this.offset = e - this.currentTime, this.position = e, await this.sourceBufferProxy.remove(n, a), this.currentSegment = t, this.checkBuffer(), this.video.play();
  }
}
export {
  v as MediaSegment,
  S as SourceBufferProxy,
  E as Timeline
};
