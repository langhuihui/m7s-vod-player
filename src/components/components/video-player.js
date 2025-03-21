import { LitElement as l, css as a, html as s } from "/node_modules/lit/index.js";
import { Timeline as h } from "../timeline.js";
class c extends l {
  static styles = a`
    .video-player {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 4px;
      background-color: #000;
    }

    video {
      width: 100%;
      display: block;
      cursor: pointer;
    }

    .controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(100%);
      z-index: 10;
    }

    .show-controls {
      opacity: 1;
      transform: translateY(0);
    }

    .controls-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      color: white;
    }

    .controls-left,
    .controls-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .control-button {
      background: transparent;
      border: none;
      color: white;
      padding: 5px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border-radius: 4px;
    }

    .control-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .bili-icon {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .time-display {
      font-size: 12px;
      color: white;
    }

    .timeline {
      position: relative;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1.5px;
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 10px;
      transition: height 0.2s ease;
    }

    .timeline-hover {
      height: 5px;
    }

    .timeline-buffer {
      position: absolute;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      width: 0;
      pointer-events: none;
    }

    .timeline-progress {
      position: absolute;
      height: 100%;
      background-color: #fb7299;
      width: 0;
      pointer-events: none;
    }

    .timeline-handle {
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: #fb7299;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      pointer-events: none;
      transition: transform 0.2s ease, height 0.2s ease, width 0.2s ease,
        box-shadow 0.2s ease;
    }

    .timeline-handle-hover {
      transform: translate(-50%, -50%) scale(1);
      height: 12px;
      width: 12px;
      box-shadow: 0 0 0 4px rgba(251, 114, 153, 0.2);
      cursor: grab;
      pointer-events: auto;
    }

    /* Playback Rate Control */
    .playback-rate-control {
      position: relative;
    }

    .playback-rate-menu {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 5px;
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 100;
    }

    .playback-rate-option {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      color: white;
      transition: all 0.2s;
      width: 100%;
      text-align: center;
    }

    .playback-rate-option:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .playback-rate-option.active {
      background-color: #fb7299;
      color: white;
      border-color: #fb7299;
    }

    /* Volume Control - Fixed vertical implementation */
    .volume-control {
      position: relative;
      z-index: 101; /* Ensure this is above other controls for mouseleave detection */
    }

    .volume-slider-container {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 15px 10px;
      margin-bottom: 5px;
      z-index: 100;
    }

    /* Add a pseudo-element to bridge the gap between button and slider container */
    .volume-control:hover .volume-slider-container::after {
      content: "";
      position: absolute;
      bottom: -15px; /* Match margin-bottom of slider container */
      left: 0;
      width: 100%;
      height: 15px;
      background: transparent;
    }

    .volume-slider {
      position: relative;
      height: 80px;
      width: 10px;
      cursor: pointer;
      user-select: none;
    }

    .volume-slider-track {
      position: absolute;
      height: 100%;
      width: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      left: 3px;
    }

    .volume-slider-fill {
      position: absolute;
      width: 4px;
      background: #fb7299;
      border-radius: 2px;
      left: 3px;
      bottom: 0;
    }

    .volume-slider-thumb {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fb7299;
      left: -1px;
      transform: translateY(50%);
      cursor: pointer;
    }

    .icon-play,
    .icon-pause,
    .icon-forward,
    .icon-backward,
    .icon-volume-high,
    .icon-volume-low,
    .icon-volume-mute,
    .icon-fullscreen,
    .icon-fullscreen-exit {
      font-style: normal;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    /* Volume icon custom styles */
    .icon-volume-mute::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-low::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-high::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    /* Fullscreen styles */
    .video-player:fullscreen {
      width: 100%;
      max-width: none;
    }

    .video-player:fullscreen video {
      height: 100vh;
      object-fit: contain;
    }
  `;
  static properties = {
    src: { type: String },
    debug: { type: Boolean },
    isDragging: { type: Boolean, state: !0 },
    isHovering: { type: Boolean, state: !0 },
    playbackRate: { type: Number, state: !0 },
    isPlaying: { type: Boolean, state: !0 },
    currentPosition: { type: Number, state: !0 },
    totalDuration: { type: Number, state: !0 },
    showControls: { type: Boolean, state: !0 },
    volume: { type: Number, state: !0 },
    isMuted: { type: Boolean, state: !0 },
    showPlaybackRateMenu: { type: Boolean, state: !0 },
    showVolumeSlider: { type: Boolean, state: !0 },
    isFullscreen: { type: Boolean, state: !0 },
    isVolumeDragging: { type: Boolean, state: !0 },
    singleFmp4: { type: Boolean, state: !0 },
    isWideScreen: { type: Boolean, state: !0 }
  };
  constructor() {
    super(), this.src = void 0, this.debug = !1, this.isDragging = !1, this.isHovering = !1, this.playbackRate = 1, this.isPlaying = !1, this.currentPosition = 0, this.totalDuration = 0, this.showControls = !1, this.volume = 1, this.isMuted = !1, this.showPlaybackRateMenu = !1, this.showVolumeSlider = !1, this.isFullscreen = !1, this.isVolumeDragging = !1, this.singleFmp4 = !1, this.isWideScreen = !0;
  }
  // DOM references - using private fields instead of decorators
  _video;
  _timelineRef;
  _progressRef;
  _bufferRef;
  _playerRef;
  // Internal state
  timeline;
  hideControlsTimeoutId = null;
  playbackRates = [0.5, 1, 1.5, 2, 3, 4];
  // Getters for DOM references
  get video() {
    return this._video || (this._video = this.renderRoot.querySelector("video")), this._video;
  }
  get timelineRef() {
    return this._timelineRef || (this._timelineRef = this.renderRoot.querySelector(".timeline")), this._timelineRef;
  }
  get progressRef() {
    return this._progressRef || (this._progressRef = this.renderRoot.querySelector(".timeline-progress")), this._progressRef;
  }
  get bufferRef() {
    return this._bufferRef || (this._bufferRef = this.renderRoot.querySelector(".timeline-buffer")), this._bufferRef;
  }
  get playerRef() {
    return this._playerRef || (this._playerRef = this.renderRoot.querySelector(".video-player")), this._playerRef;
  }
  // Lifecycle methods
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this.handleKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this.handleKeyDown), this.timeline && this.timeline.destroy(), this.video && (this.video.removeEventListener("timeupdate", this.updateTimelineUI), this.video.removeEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.removeEventListener("pause", () => {
      this.isPlaying = !1;
    }));
  }
  firstUpdated() {
    this.video && (this.video.addEventListener("timeupdate", this.updateTimelineUI), this.video.addEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.addEventListener("pause", () => {
      this.isPlaying = !1;
    }), this.video.volume = this.volume), this.playerRef && (new ResizeObserver(() => {
      this.checkScreenWidth();
    }).observe(this.playerRef), this.checkScreenWidth()), this.src && this.setupTimeline();
  }
  updated(e) {
    e.has("src") && this.src && this.setupTimeline();
  }
  // Helper methods
  formatTime(e) {
    const i = Math.floor(e / 3600), t = Math.floor(e % 3600 / 60), o = Math.floor(e % 60);
    return i > 0 ? `${i.toString().padStart(2, "0")}:${t.toString().padStart(2, "0")}:${o.toString().padStart(2, "0")}` : `${t.toString().padStart(2, "0")}:${o.toString().padStart(2, "0")}`;
  }
  checkScreenWidth() {
    this.playerRef && (this.isWideScreen = this.playerRef.offsetWidth >= 400);
  }
  setupTimeline() {
    if (this.timeline && this.timeline.destroy(), !this.src || !this.video)
      return;
    const e = new h(this.video, { debug: this.debug });
    this.timeline = e, this.currentPosition = 0, this.totalDuration = 0, e.load(this.src).then(() => {
      this.singleFmp4 = e.singleFmp4, this.totalDuration = e.totalDuration, this.dispatchEvent(new CustomEvent("segments", {
        detail: e.segments,
        bubbles: !0,
        composed: !0
      }));
    });
  }
  // Event handlers
  updateTimelineUI = () => {
    if (!this.timelineRef || !this.progressRef || !this.bufferRef || !this.timeline)
      return;
    this.currentPosition = this.timeline.position, this.totalDuration !== this.timeline.totalDuration && (this.totalDuration = this.timeline.totalDuration);
    const e = this.timeline.position / this.totalDuration * 100;
    this.progressRef.style.width = `${e}%`;
    const i = (this.timeline.bufferedLength + this.timeline.position) / this.totalDuration * 100;
    this.bufferRef.style.width = `${i}%`, this.dispatchEvent(new CustomEvent("timeupdate", {
      detail: this.timeline.position,
      bubbles: !0,
      composed: !0
    })), this.isPlaying = !this.video?.paused;
  };
  handleTimelineClick(e) {
    if (!this.timelineRef || !this.timeline)
      return;
    const i = this.timelineRef.getBoundingClientRect(), o = (e.clientX - i.left) / i.width * this.totalDuration;
    this.timeline.seek(o), this.currentPosition = o;
  }
  startDrag(e) {
    this.isDragging = !0, this.handleDrag(e), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.stopDrag);
  }
  handleDrag = (e) => {
    if (!this.isDragging || !this.timelineRef || !this.timeline)
      return;
    const i = this.timelineRef.getBoundingClientRect(), t = (e.clientX - i.left) / i.width, o = Math.max(
      0,
      Math.min(t * this.totalDuration, this.totalDuration)
    );
    this.currentPosition = o;
    const n = o / this.totalDuration * 100;
    this.progressRef && (this.progressRef.style.width = `${n}%`);
  };
  stopDrag = (e) => {
    this.isDragging && (this.handleTimelineClick(e), document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("mouseup", this.stopDrag), this.isDragging = !1);
  };
  onTimelineMouseEnter() {
    this.isHovering = !0;
  }
  onTimelineMouseLeave() {
    this.isHovering = !1;
  }
  changePlaybackRate(e) {
    this.video && (this.playbackRate = e, this.video.playbackRate = e, this.showPlaybackRateMenu = !1);
  }
  togglePlaybackRateMenu() {
    this.showPlaybackRateMenu = !this.showPlaybackRateMenu;
  }
  togglePlay() {
    this.video && (this.video.paused ? (this.video.play(), this.isPlaying = !0) : (this.video.pause(), this.isPlaying = !1));
  }
  toggleMute() {
    this.video && (this.isMuted = !this.isMuted, this.video.muted = this.isMuted);
  }
  handleVolumeChange(e) {
    if (!this.video)
      return;
    const t = e.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(e.clientY, t);
  }
  updateVolumeFromPosition(e, i) {
    const t = i.height, o = 1 - Math.max(0, Math.min(1, (e - i.top) / t)), n = Math.max(0, Math.min(1, o));
    this.volume = n, this.video && (this.video.volume = n, this.isMuted = n === 0, this.video.muted = n === 0);
  }
  startVolumeDrag(e) {
    e.preventDefault(), this.isVolumeDragging = !0;
    const t = e.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(e.clientY, t);
    const o = (r) => {
      this.isVolumeDragging && this.updateVolumeFromPosition(r.clientY, t);
    };
    document.addEventListener("mousemove", o);
    const n = () => {
      this.isVolumeDragging = !1, document.removeEventListener("mousemove", o), document.removeEventListener("mouseup", n), setTimeout(() => {
        document.querySelector(".volume-control:hover") || (this.showVolumeSlider = !1);
      }, 500);
    };
    document.addEventListener("mouseup", n);
  }
  seekForward() {
    if (!this.timeline)
      return;
    const e = Math.min(this.timeline.position + 10, this.totalDuration);
    this.timeline.seek(e), this.currentPosition = e;
  }
  seekBackward() {
    if (!this.timeline)
      return;
    const e = Math.max(this.timeline.position - 10, 0);
    this.timeline.seek(e), this.currentPosition = e;
  }
  handleMouseEnter() {
    this.showControls = !0, this.hideControlsTimeoutId !== null && (window.clearTimeout(this.hideControlsTimeoutId), this.hideControlsTimeoutId = null);
  }
  handleMouseLeave() {
    this.isDragging || (this.hideControlsTimeoutId = window.setTimeout(() => {
      this.showControls = !1;
    }, 2e3));
  }
  handleMouseMove() {
    this.handleMouseEnter();
  }
  toggleFullscreen() {
    this.playerRef && (document.fullscreenElement ? document.exitFullscreen().then(() => {
      this.isFullscreen = !1;
    }).catch((e) => {
      console.error(`Error attempting to exit fullscreen: ${e.message}`);
    }) : this.playerRef.requestFullscreen().then(() => {
      this.isFullscreen = !0;
    }).catch((e) => {
      console.error(`Error attempting to enable fullscreen: ${e.message}`);
    }));
  }
  handleKeyDown = (e) => {
    switch (e.key) {
      case " ":
      case "k":
        this.togglePlay(), e.preventDefault();
        break;
      case "ArrowRight":
        this.seekForward(), e.preventDefault();
        break;
      case "ArrowLeft":
        this.seekBackward(), e.preventDefault();
        break;
      case "f":
        this.toggleFullscreen(), e.preventDefault();
        break;
      case "m":
        this.toggleMute(), e.preventDefault();
        break;
    }
  };
  // Public methods
  seek(e) {
    this.timeline && (this.timeline.seek(e), this.currentPosition = e);
  }
  // Render methods
  render() {
    const e = this.formatTime(this.currentPosition), i = this.formatTime(this.totalDuration);
    return s`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Custom timeline UI -->
        ${this.timeline && !this.singleFmp4 ? s`
          <div
            class="controls-overlay ${this.showControls || this.isDragging ? "show-controls" : ""}"
          >
            <!-- Timeline slider -->
            <div
              class="timeline ${this.isHovering ? "timeline-hover" : ""}"
              @click=${this.handleTimelineClick}
              @mouseenter=${this.onTimelineMouseEnter}
              @mouseleave=${this.onTimelineMouseLeave}
            >
              <div class="timeline-buffer"></div>
              <div class="timeline-progress"></div>
              <div
                class="timeline-handle ${this.isHovering || this.isDragging ? "timeline-handle-hover" : ""}"
                style="left: ${this.currentPosition / (this.totalDuration || 1) * 100}%"
                @mousedown=${(t) => {
      t.stopPropagation(), this.startDrag(t);
    }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ? s`<i class="icon-pause">▮▮</i>` : s`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? s`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ""}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? s`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ""}

                <!-- Current time display -->
                <div class="time-display">
                  ${e} / ${i}
                </div>
              </div>

              <!-- Right side controls -->
              <div class="controls-right">
                <!-- Playback rate control -->
                <div class="playback-rate-control">
                  <button
                    class="control-button playback-rate-button"
                    @click=${this.togglePlaybackRateMenu}
                  >
                    <span>${this.playbackRate}x</span>
                  </button>
                  ${this.showPlaybackRateMenu ? s`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map((t) => s`
                        <button
                          @click=${() => this.changePlaybackRate(t)}
                          class="playback-rate-option ${this.playbackRate === t ? "active" : ""}"
                        >
                          ${t}x
                        </button>
                      `)}
                    </div>
                  ` : ""}
                </div>

                <!-- Volume Control -->
                <div
                  class="volume-control"
                  @mouseenter=${() => this.showVolumeSlider = !0}
                  @mouseleave=${() => {
      this.isVolumeDragging || (this.showVolumeSlider = !1);
    }}
                >
                  <button class="control-button" @click=${this.toggleMute}>
                    ${this.isMuted || this.volume === 0 ? s`<i class="icon-volume-mute"></i>` : this.volume < 0.5 ? s`<i class="icon-volume-low"></i>` : s`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? s`
                    <div class="volume-slider-container">
                      <div
                        class="volume-slider"
                        @click=${this.handleVolumeChange}
                        @mousedown=${this.startVolumeDrag}
                      >
                        <div class="volume-slider-track"></div>
                        <div
                          class="volume-slider-fill"
                          style="height: ${this.volume * 100}%"
                        ></div>
                        <div
                          class="volume-slider-thumb"
                          style="bottom: ${this.volume * 100}%"
                        ></div>
                      </div>
                    </div>
                  ` : ""}
                </div>

                <!-- Fullscreen Button -->
                <button class="control-button" @click=${this.toggleFullscreen}>
                  ${this.isFullscreen ? s`<i class="icon-fullscreen-exit">⤓</i>` : s`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
}
customElements.define("video-player", c);
export {
  c as VideoPlayer
};
