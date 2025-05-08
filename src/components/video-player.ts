import { LitElement, html, css } from 'lit';
import type { PropertyValues, PropertyDeclaration } from 'lit';
import { Timeline } from '../timeline';

export class VideoPlayer extends LitElement {
  static styles = css`
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
    isDragging: { type: Boolean, state: true },
    isHovering: { type: Boolean, state: true },
    playbackRate: { type: Number, state: true },
    isPlaying: { type: Boolean, state: true },
    currentPosition: { type: Number, state: true },
    totalDuration: { type: Number, state: true },
    showControls: { type: Boolean, state: true },
    volume: { type: Number, state: true },
    isMuted: { type: Boolean, state: true },
    showPlaybackRateMenu: { type: Boolean, state: true },
    showVolumeSlider: { type: Boolean, state: true },
    isFullscreen: { type: Boolean, state: true },
    isVolumeDragging: { type: Boolean, state: true },
    singleFmp4: { type: Boolean, state: true },
    isWideScreen: { type: Boolean, state: true }
  } as const;

  constructor() {
    super();
    // Initialize properties
    this.src = undefined;
    this.debug = false;
    this.isDragging = false;
    this.isHovering = false;
    this.playbackRate = 1;
    this.isPlaying = false;
    this.currentPosition = 0;
    this.totalDuration = 0;
    this.showControls = false;
    this.volume = 1;
    this.isMuted = false;
    this.showPlaybackRateMenu = false;
    this.showVolumeSlider = false;
    this.isFullscreen = false;
    this.isVolumeDragging = false;
    this.singleFmp4 = false;
    this.isWideScreen = true;
  }

  // DOM references - using private fields instead of decorators
  private _video?: HTMLVideoElement;
  private _timelineRef?: HTMLDivElement;
  private _progressRef?: HTMLDivElement;
  private _bufferRef?: HTMLDivElement;
  private _playerRef?: HTMLDivElement;

  // Internal state
  private timeline?: Timeline;
  private hideControlsTimeoutId: number | null = null;
  private playbackRates = [0.5, 1, 1.5, 2, 3, 4];

  // Property declarations
  declare src?: string;
  declare debug: boolean;
  declare isDragging: boolean;
  declare isHovering: boolean;
  declare playbackRate: number;
  declare isPlaying: boolean;
  declare currentPosition: number;
  declare totalDuration: number;
  declare showControls: boolean;
  declare volume: number;
  declare isMuted: boolean;
  declare showPlaybackRateMenu: boolean;
  declare showVolumeSlider: boolean;
  declare isFullscreen: boolean;
  declare isVolumeDragging: boolean;
  declare singleFmp4: boolean;
  declare isWideScreen: boolean;

  // Getters for DOM references
  get video(): HTMLVideoElement {
    if (!this._video) {
      this._video = this.renderRoot.querySelector('video') as HTMLVideoElement;
    }
    return this._video;
  }

  get timelineRef(): HTMLDivElement {
    if (!this._timelineRef) {
      this._timelineRef = this.renderRoot.querySelector('.timeline') as HTMLDivElement;
    }
    return this._timelineRef;
  }

  get progressRef(): HTMLDivElement {
    if (!this._progressRef) {
      this._progressRef = this.renderRoot.querySelector('.timeline-progress') as HTMLDivElement;
    }
    return this._progressRef;
  }

  get bufferRef(): HTMLDivElement {
    if (!this._bufferRef) {
      this._bufferRef = this.renderRoot.querySelector('.timeline-buffer') as HTMLDivElement;
    }
    return this._bufferRef;
  }

  get playerRef(): HTMLDivElement {
    if (!this._playerRef) {
      this._playerRef = this.renderRoot.querySelector('.video-player') as HTMLDivElement;
    }
    return this._playerRef;
  }

  // Lifecycle methods
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);

    if (this.timeline) {
      this.timeline.destroy();
    }

    // Clean up event listeners
    if (this.video) {
      this.video.removeEventListener('timeupdate', this.updateTimelineUI);
      this.video.removeEventListener('play', () => {
        this.isPlaying = true;
      });
      this.video.removeEventListener('pause', () => {
        this.isPlaying = false;
      });
    }
  }

  firstUpdated() {
    // Setup video element and events after first render
    if (this.video) {
      // Listen to timeupdate event to update timeline UI
      this.video.addEventListener('timeupdate', this.updateTimelineUI);

      // Listen for play and pause events to update state
      this.video.addEventListener('play', () => {
        this.isPlaying = true;
      });

      this.video.addEventListener('pause', () => {
        this.isPlaying = false;
      });

      // Initialize volume
      this.video.volume = this.volume;
    }

    // Set up ResizeObserver to check screen width
    if (this.playerRef) {
      const resizeObserver = new ResizeObserver(() => {
        this.checkScreenWidth();
      });
      resizeObserver.observe(this.playerRef);

      // Initial check
      this.checkScreenWidth();
    }

    // Set up the timeline if src is provided
    if (this.src) {
      this.setupTimeline();
    }
  }

  updated(changedProperties: PropertyValues) {
    // Update timeline when src changes
    if (changedProperties.has('src') && this.src) {
      this.setupTimeline();
    }
  }

  // Helper methods
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  }

  private checkScreenWidth() {
    if (!this.playerRef) return;
    this.isWideScreen = this.playerRef.offsetWidth >= 400; // Set threshold for "wide" screen
  }

  private setupTimeline() {
    // Clear existing timeline
    if (this.timeline) {
      this.timeline.destroy();
    }

    if (!this.src || !this.video) return;

    const tl = new Timeline(this.video, { debug: this.debug });
    this.timeline = tl;
    this.currentPosition = 0;
    this.totalDuration = 0; // Reset duration when changing source

    tl.load(this.src).then(() => {
      this.singleFmp4 = tl.singleFmp4;
      this.totalDuration = tl.totalDuration; // Update duration when loaded
      this.dispatchEvent(new CustomEvent('segments', {
        detail: tl.segments,
        bubbles: true,
        composed: true
      }));
    });
  }

  // Event handlers
  private updateTimelineUI = () => {
    if (
      !this.timelineRef ||
      !this.progressRef ||
      !this.bufferRef ||
      !this.timeline
    )
      return;

    this.currentPosition = this.timeline.position;

    // Update totalDuration reactively
    if (this.totalDuration !== this.timeline.totalDuration) {
      this.totalDuration = this.timeline.totalDuration;
    }

    const percentage = (this.timeline.position / this.totalDuration) * 100;
    this.progressRef.style.width = `${percentage}%`;

    // Calculate buffered length as percentage of total duration
    const bufferPercentage =
      ((this.timeline.bufferedLength + this.timeline.position) /
        this.totalDuration) *
      100;
    this.bufferRef.style.width = `${bufferPercentage}%`;

    this.dispatchEvent(new CustomEvent('timeupdate', {
      detail: this.timeline.position,
      bubbles: true,
      composed: true
    }));

    // Update playing state
    this.isPlaying = !this.video?.paused;
  };

  private handleTimelineClick(event: MouseEvent) {
    if (!this.timelineRef || !this.timeline) return;

    const rect = this.timelineRef.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * this.totalDuration;

    this.timeline.seek(seekTime);
    this.currentPosition = seekTime;
  }

  private startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.handleDrag(event);

    // Add event listeners for drag and drop
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  private handleDrag = (event: MouseEvent) => {
    if (!this.isDragging || !this.timelineRef || !this.timeline) return;

    const rect = this.timelineRef.getBoundingClientRect();
    const dragPosition = (event.clientX - rect.left) / rect.width;
    const seekTime = Math.max(
      0,
      Math.min(dragPosition * this.totalDuration, this.totalDuration)
    );

    this.currentPosition = seekTime;

    // Update UI immediately without actually seeking yet
    const percentage = (seekTime / this.totalDuration) * 100;
    if (this.progressRef) {
      this.progressRef.style.width = `${percentage}%`;
    }
  };

  private stopDrag = (event: MouseEvent) => {
    if (!this.isDragging) return;

    // Perform the actual seek
    this.handleTimelineClick(event);

    // Remove event listeners
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    this.isDragging = false;
  };

  private onTimelineMouseEnter() {
    this.isHovering = true;
  }

  private onTimelineMouseLeave() {
    this.isHovering = false;
  }

  private changePlaybackRate(rate: number) {
    if (!this.video) return;

    this.playbackRate = rate;
    this.video.playbackRate = rate;
    this.showPlaybackRateMenu = false;
  }

  private togglePlaybackRateMenu() {
    this.showPlaybackRateMenu = !this.showPlaybackRateMenu;
  }

  private togglePlay() {
    if (!this.video) return;

    if (this.video.paused) {
      this.video.play();
      this.isPlaying = true;
    } else {
      this.video.pause();
      this.isPlaying = false;
    }
  }

  private toggleMute() {
    if (!this.video) return;

    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;
  }

  private handleVolumeChange(event: MouseEvent) {
    if (!this.video) return;

    // Get the volume slider element and its dimensions
    const slider = event.currentTarget as HTMLElement;
    const rect = slider.getBoundingClientRect();
    this.updateVolumeFromPosition(event.clientY, rect);
  }

  private updateVolumeFromPosition(clientY: number, rect: DOMRect) {
    // Calculate volume: 1 at top (minimum clientY), 0 at bottom (maximum clientY)
    const sliderHeight = rect.height;
    const volumePercentage =
      1 - Math.max(0, Math.min(1, (clientY - rect.top) / sliderHeight));
    const clampedVolume = Math.max(0, Math.min(1, volumePercentage));

    this.volume = clampedVolume;
    if (this.video) {
      this.video.volume = clampedVolume;

      // If volume is set to 0, consider it as muted
      this.isMuted = clampedVolume === 0;
      this.video.muted = clampedVolume === 0;
    }
  }

  private startVolumeDrag(event: MouseEvent) {
    event.preventDefault();
    this.isVolumeDragging = true;

    // Store the slider reference for use during drag
    const slider = event.currentTarget as HTMLElement;
    const sliderRect = slider.getBoundingClientRect();

    // Initial volume update
    this.updateVolumeFromPosition(event.clientY, sliderRect);

    // Create a handler that uses the stored slider reference
    const handleDrag = (e: MouseEvent) => {
      if (this.isVolumeDragging) {
        this.updateVolumeFromPosition(e.clientY, sliderRect);
      }
    };

    // Add global event listeners for drag tracking
    document.addEventListener('mousemove', handleDrag);

    const stopDrag = () => {
      this.isVolumeDragging = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);

      // Allow the slider to hide if mouse is not over the volume control
      setTimeout(() => {
        if (!document.querySelector('.volume-control:hover')) {
          this.showVolumeSlider = false;
        }
      }, 500);
    };

    document.addEventListener('mouseup', stopDrag);
  }

  private seekForward() {
    if (!this.timeline) return;

    const newTime = Math.min(this.timeline.position + 10, this.totalDuration);
    this.timeline.seek(newTime);
    this.currentPosition = newTime;
  }

  private seekBackward() {
    if (!this.timeline) return;

    const newTime = Math.max(this.timeline.position - 10, 0);
    this.timeline.seek(newTime);
    this.currentPosition = newTime;
  }

  private handleMouseEnter() {
    this.showControls = true;
    if (this.hideControlsTimeoutId !== null) {
      window.clearTimeout(this.hideControlsTimeoutId);
      this.hideControlsTimeoutId = null;
    }
  }

  private handleMouseLeave() {
    if (this.isDragging) return;

    this.hideControlsTimeoutId = window.setTimeout(() => {
      this.showControls = false;
    }, 2000);
  }

  private handleMouseMove() {
    this.handleMouseEnter();
  }

  private toggleFullscreen() {
    if (!this.playerRef) return;

    if (!document.fullscreenElement) {
      this.playerRef
        .requestFullscreen()
        .then(() => {
          this.isFullscreen = true;
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          this.isFullscreen = false;
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Handle keyboard shortcuts
    switch (event.key) {
      case ' ':
      case 'k':
        this.togglePlay();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.seekForward();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.seekBackward();
        event.preventDefault();
        break;
      case 'f':
        this.toggleFullscreen();
        event.preventDefault();
        break;
      case 'm':
        this.toggleMute();
        event.preventDefault();
        break;
    }
  };

  // Public methods
  seek(time: number) {
    if (this.timeline) {
      this.timeline.seek(time);
      this.currentPosition = time;
    }
  }

  // Render methods
  render() {
    const formattedCurrentTime = this.formatTime(this.currentPosition);
    const formattedTotalDuration = this.formatTime(this.totalDuration);

    return html`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Custom timeline UI -->
        ${this.timeline && !this.singleFmp4 ? html`
          <div
            class="controls-overlay ${this.showControls || this.isDragging ? 'show-controls' : ''}"
          >
            <!-- Timeline slider -->
            <div
              class="timeline ${this.isHovering ? 'timeline-hover' : ''}"
              @click=${this.handleTimelineClick}
              @mouseenter=${this.onTimelineMouseEnter}
              @mouseleave=${this.onTimelineMouseLeave}
            >
              <div class="timeline-buffer"></div>
              <div class="timeline-progress"></div>
              <div
                class="timeline-handle ${this.isHovering || this.isDragging ? 'timeline-handle-hover' : ''}"
                style="left: ${(this.currentPosition / (this.totalDuration || 1)) * 100}%"
                @mousedown=${(e: MouseEvent) => { e.stopPropagation(); this.startDrag(e); }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ?
          html`<i class="icon-pause">▮▮</i>` :
          html`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? html`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ''}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? html`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ''}

                <!-- Current time display -->
                <div class="time-display">
                  ${formattedCurrentTime} / ${formattedTotalDuration}
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
                  ${this.showPlaybackRateMenu ? html`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map(rate => html`
                        <button
                          @click=${() => this.changePlaybackRate(rate)}
                          class="playback-rate-option ${this.playbackRate === rate ? 'active' : ''}"
                        >
                          ${rate}x
                        </button>
                      `)}
                    </div>
                  ` : ''}
                </div>

                <!-- Volume Control -->
                <div
                  class="volume-control"
                  @mouseenter=${() => this.showVolumeSlider = true}
                  @mouseleave=${() => {
          if (!this.isVolumeDragging) {
            this.showVolumeSlider = false;
          }
        }}
                >
                  <button class="control-button" @click=${this.toggleMute}>
                    ${this.isMuted || this.volume === 0 ?
          html`<i class="icon-volume-mute"></i>` :
          this.volume < 0.5 ?
            html`<i class="icon-volume-low"></i>` :
            html`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? html`
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
                  ` : ''}
                </div>

                <!-- Fullscreen Button -->
                <button class="control-button" @click=${this.toggleFullscreen}>
                  ${this.isFullscreen ?
          html`<i class="icon-fullscreen-exit">⤓</i>` :
          html`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

// Register the custom element after the class is defined
customElements.define('m7s-vod-player', VideoPlayer);

// Add type declaration for custom element
declare global {
  interface HTMLElementTagNameMap {
    'm7s-vod-player': VideoPlayer;
  }
}