<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  defineExpose,
  watch,
  onUnmounted,
  defineEmits,
} from "vue";
import { Timeline } from "../timeline";

// No longer need the timeline prop as we'll create it internally
const props = defineProps<{
  src?: string;
  debug?: boolean;
}>();

const video = ref<HTMLVideoElement>();
const playerRef = ref<HTMLDivElement>();
const timelineRef = ref<HTMLDivElement>();
const progressRef = ref<HTMLDivElement>();
const bufferRef = ref<HTMLDivElement>();
const isDragging = ref(false);
const isHovering = ref(false);
const playbackRate = ref(1);
const timeline = ref<Timeline>();
const isPlaying = ref(false);
const currentPosition = ref(0);
const totalDuration = ref(0);
const showControls = ref(false);
const hideControlsTimeout = ref<number | null>(null);
const volume = ref(1);
const isMuted = ref(false);
const showPlaybackRateMenu = ref(false);
const showVolumeSlider = ref(false);
const isFullscreen = ref(false);
const isVolumeDragging = ref(false);
const singleFmp4 = ref(false);
const isWideScreen = ref(true); // Added for responsive control

// Expose video element to parent component
defineExpose({
  value: video,
  seek: (time: number) => {
    timeline.value?.seek(time);
    currentPosition.value = time;
  },
});
const emit = defineEmits(["timeupdate", "segments"]);
const formattedCurrentTime = computed(() => {
  return formatTime(currentPosition.value);
});

const formattedTotalDuration = computed(() => {
  return formatTime(totalDuration.value);
});

const playbackRates = [0.5, 1, 1.5, 2, 3, 4];

function formatTime(seconds: number): string {
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

// Check if screen is wide enough to show all controls
function checkScreenWidth() {
  if (!playerRef.value) return;
  isWideScreen.value = playerRef.value.offsetWidth >= 400; // Set threshold for "wide" screen
}

function updateTimelineUI() {
  if (
    !timelineRef.value ||
    !progressRef.value ||
    !bufferRef.value ||
    !timeline.value
  )
    return;

  currentPosition.value = timeline.value.position;

  // Update totalDuration reactively
  if (totalDuration.value !== timeline.value.totalDuration) {
    totalDuration.value = timeline.value.totalDuration;
  }

  const percentage = (timeline.value.position / totalDuration.value) * 100;
  progressRef.value.style.width = `${percentage}%`;

  // Calculate buffered length as percentage of total duration
  const bufferPercentage =
    ((timeline.value.bufferedLength + timeline.value.position) /
      totalDuration.value) *
    100;
  bufferRef.value.style.width = `${bufferPercentage}%`;
  emit("timeupdate", timeline.value.position);
  // Update playing state
  isPlaying.value = !video.value?.paused;
}

function handleTimelineClick(event: MouseEvent) {
  if (!timelineRef.value || !timeline.value) return;

  const rect = timelineRef.value.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;
  const seekTime = clickPosition * totalDuration.value;

  timeline.value.seek(seekTime);
  currentPosition.value = seekTime;
}

function startDrag(event: MouseEvent) {
  isDragging.value = true;
  handleDrag(event);

  // Add event listeners for drag and drop
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
}

function handleDrag(event: MouseEvent) {
  if (!isDragging.value || !timelineRef.value || !timeline.value) return;

  const rect = timelineRef.value.getBoundingClientRect();
  const dragPosition = (event.clientX - rect.left) / rect.width;
  const seekTime = Math.max(
    0,
    Math.min(dragPosition * totalDuration.value, totalDuration.value)
  );

  currentPosition.value = seekTime;

  // Update UI immediately without actually seeking yet
  const percentage = (seekTime / totalDuration.value) * 100;
  if (progressRef.value) {
    progressRef.value.style.width = `${percentage}%`;
  }
}

function stopDrag(event: MouseEvent) {
  if (!isDragging.value) return;

  // Perform the actual seek
  handleTimelineClick(event);

  // Remove event listeners
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  isDragging.value = false;
}

function onTimelineMouseEnter() {
  isHovering.value = true;
}

function onTimelineMouseLeave() {
  isHovering.value = false;
}

function changePlaybackRate(rate: number) {
  if (!video.value) return;

  playbackRate.value = rate;
  video.value.playbackRate = rate;

  // Update SoftDecoder's playback speed if it exists
  if (timeline.value?.softDecoder) {
    timeline.value.softDecoder.setPlaybackSpeed(rate);
  }

  showPlaybackRateMenu.value = false;
}

function togglePlaybackRateMenu() {
  showPlaybackRateMenu.value = !showPlaybackRateMenu.value;
}

function togglePlay() {
  if (!video.value) return;

  if (video.value.paused) {
    video.value.play();
    isPlaying.value = true;
  } else {
    video.value.pause();
    isPlaying.value = false;
  }
}

function toggleMute() {
  if (!video.value) return;

  isMuted.value = !isMuted.value;
  video.value.muted = isMuted.value;
}

function handleVolumeChange(event: MouseEvent) {
  if (!video.value) return;

  // Get the volume slider element and its dimensions
  const slider = event.currentTarget as HTMLElement;
  const rect = slider.getBoundingClientRect();
  updateVolumeFromPosition(event.clientY, rect);
}

function updateVolumeFromPosition(clientY: number, rect: DOMRect) {
  // Calculate volume: 1 at top (minimum clientY), 0 at bottom (maximum clientY)
  const sliderHeight = rect.height;
  const volumePercentage =
    1 - Math.max(0, Math.min(1, (clientY - rect.top) / sliderHeight));
  const clampedVolume = Math.max(0, Math.min(1, volumePercentage));

  volume.value = clampedVolume;
  if (video.value) {
    video.value.volume = clampedVolume;

    // If volume is set to 0, consider it as muted
    isMuted.value = clampedVolume === 0;
    video.value.muted = clampedVolume === 0;
  }
}

function startVolumeDrag(event: MouseEvent) {
  event.preventDefault();
  isVolumeDragging.value = true;

  // Store the slider reference for use during drag
  const slider = event.currentTarget as HTMLElement;
  const sliderRect = slider.getBoundingClientRect();

  // Initial volume update
  updateVolumeFromPosition(event.clientY, sliderRect);

  // Create a handler that uses the stored slider reference
  const handleDrag = (e: MouseEvent) => {
    if (isVolumeDragging.value) {
      updateVolumeFromPosition(e.clientY, sliderRect);
    }
  };

  // Add global event listeners for drag tracking
  document.addEventListener("mousemove", handleDrag);

  const stopDrag = () => {
    isVolumeDragging.value = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);

    // Allow the slider to hide if mouse is not over the volume control
    setTimeout(() => {
      if (!document.querySelector(".volume-control:hover")) {
        showVolumeSlider.value = false;
      }
    }, 500);
  };

  document.addEventListener("mouseup", stopDrag);
}

function seekForward() {
  if (!timeline.value) return;

  const newTime = Math.min(timeline.value.position + 10, totalDuration.value);
  timeline.value.seek(newTime);
  currentPosition.value = newTime;
}

function seekBackward() {
  if (!timeline.value) return;

  const newTime = Math.max(timeline.value.position - 10, 0);
  timeline.value.seek(newTime);
  currentPosition.value = newTime;
}

function handleMouseEnter() {
  showControls.value = true;
  if (hideControlsTimeout.value !== null) {
    window.clearTimeout(hideControlsTimeout.value);
    hideControlsTimeout.value = null;
  }
}

function handleMouseLeave() {
  if (isDragging.value) return;

  hideControlsTimeout.value = window.setTimeout(() => {
    showControls.value = false;
  }, 2000);
}

function handleMouseMove() {
  handleMouseEnter();
}

function toggleFullscreen() {
  if (!playerRef.value) return;

  if (!document.fullscreenElement) {
    playerRef.value
      .requestFullscreen()
      .then(() => {
        isFullscreen.value = true;
      })
      .catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
  } else {
    document
      .exitFullscreen()
      .then(() => {
        isFullscreen.value = false;
      })
      .catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
  }
}

watch(
  () => (video.value ? props.src : null),
  (src) => {
    if (timeline.value) timeline.value.destroy();
    if (!src) return;
    if (video.value) {
      const tl = new Timeline(video.value, { debug: props.debug });
      timeline.value = tl;
      currentPosition.value = 0;
      totalDuration.value = 0; // Reset duration when changing source
      tl.load(src).then(() => {
        singleFmp4.value = tl.singleFmp4;
        totalDuration.value = tl.totalDuration; // Update duration when loaded
        emit("segments", tl.segments);
      });
    }
  }
);

onMounted(() => {
  if (!video.value) return;
  // Listen to timeupdate event to update timeline UI
  video.value.addEventListener("timeupdate", updateTimelineUI);

  // Listen for play and pause events to update state
  video.value.addEventListener("play", () => {
    isPlaying.value = true;
  });

  video.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  // Initialize volume
  video.value.volume = volume.value;

  // Set up ResizeObserver to check screen width
  if (playerRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      checkScreenWidth();
    });
    resizeObserver.observe(playerRef.value);

    // Initial check
    checkScreenWidth();
  }
});

// Add cleanup for the interval when component is unmounted
onUnmounted(() => {
  // Clean up timeline if it exists
  if (timeline.value) {
    timeline.value.destroy();
  }

  // Remove event listeners if video element exists
  if (video.value) {
    video.value.removeEventListener("timeupdate", updateTimelineUI);
    video.value.removeEventListener("play", () => {
      isPlaying.value = true;
    });
    video.value.removeEventListener("pause", () => {
      isPlaying.value = false;
    });
  }
});
</script>

<template>
  <div
    class="video-player"
    ref="playerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <!-- Video element -->
    <video ref="video" @click="togglePlay" :controls="singleFmp4"></video>

    <!-- Custom timeline UI -->
    <div
      v-if="timeline && !singleFmp4"
      class="controls-overlay"
      :class="{ 'show-controls': showControls || isDragging }"
    >
      <!-- Timeline slider -->
      <div
        class="timeline"
        ref="timelineRef"
        @click="handleTimelineClick"
        @mouseenter="onTimelineMouseEnter"
        @mouseleave="onTimelineMouseLeave"
        :class="{ 'timeline-hover': isHovering }"
      >
        <div class="timeline-buffer" ref="bufferRef"></div>
        <div class="timeline-progress" ref="progressRef"></div>
        <div
          class="timeline-handle"
          :class="{ 'timeline-handle-hover': isHovering || isDragging }"
          :style="{
            left: `${(currentPosition / (totalDuration || 1)) * 100}%`,
          }"
          @mousedown.stop="startDrag"
        ></div>
      </div>

      <!-- Controls -->
      <div class="controls-container">
        <!-- Left side controls -->
        <div class="controls-left">
          <!-- Play/Pause Button -->
          <button class="control-button" @click="togglePlay">
            <i v-if="isPlaying" class="icon-pause">▮▮</i>
            <i v-else class="icon-play">▶</i>
          </button>

          <!-- Rewind Button - Only visible on wide screens -->
          <button
            v-if="isWideScreen"
            class="control-button"
            @click="seekBackward"
          >
            <i class="icon-backward">◀◀</i>
          </button>

          <!-- Fast Forward Button - Only visible on wide screens -->
          <button
            v-if="isWideScreen"
            class="control-button"
            @click="seekForward"
          >
            <i class="icon-forward">▶▶</i>
          </button>

          <!-- Current time display -->
          <div class="time-display">
            {{ formattedCurrentTime }} / {{ formattedTotalDuration }}
          </div>
        </div>

        <!-- Right side controls -->
        <div class="controls-right">
          <!-- Playback rate control -->
          <div class="playback-rate-control">
            <button
              class="control-button playback-rate-button"
              @click="togglePlaybackRateMenu"
            >
              <span>{{ playbackRate }}x</span>
            </button>
            <div class="playback-rate-menu" v-if="showPlaybackRateMenu">
              <button
                v-for="rate in playbackRates"
                :key="rate"
                @click="changePlaybackRate(rate)"
                :class="{ active: playbackRate === rate }"
                class="playback-rate-option"
              >
                {{ rate }}x
              </button>
            </div>
          </div>

          <!-- Volume Control -->
          <div
            class="volume-control"
            @mouseenter="showVolumeSlider = true"
            @mouseleave="
              () => {
                if (!isVolumeDragging) {
                  showVolumeSlider = false;
                }
              }
            "
          >
            <button class="control-button" @click="toggleMute">
              <i v-if="isMuted || volume === 0" class="icon-volume-mute"></i>
              <i v-else-if="volume < 0.5" class="icon-volume-low"></i>
              <i v-else class="icon-volume-high"></i>
            </button>
            <div class="volume-slider-container" v-if="showVolumeSlider">
              <div
                class="volume-slider"
                @click="handleVolumeChange"
                @mousedown="startVolumeDrag"
              >
                <div class="volume-slider-track"></div>
                <div
                  class="volume-slider-fill"
                  :style="{ height: `${volume * 100}%` }"
                ></div>
                <div
                  class="volume-slider-thumb"
                  :style="{ bottom: `${volume * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Fullscreen Button -->
          <button class="control-button" @click="toggleFullscreen">
            <i v-if="isFullscreen" class="icon-fullscreen-exit">⤓</i>
            <i v-else class="icon-fullscreen">⤢</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
}

.icon-volume-low::before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
}

.icon-volume-high::before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
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
</style>
