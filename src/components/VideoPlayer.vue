<script setup lang="ts">
import { ref, onMounted, computed, defineExpose, watch } from "vue";
import { Timeline } from "../timeline";

// No longer need the timeline prop as we'll create it internally
const props = defineProps<{
  src?: string;
  codec?: string;
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
const showControls = ref(false);
const hideControlsTimeout = ref<number | null>(null);
const volume = ref(1);
const isMuted = ref(false);
const showPlaybackRateMenu = ref(false);
const showVolumeSlider = ref(false);
const isFullscreen = ref(false);
const isVolumeDragging = ref(false);
const singleFmp4 = ref(false);
// Expose video element to parent component
defineExpose({
  value: video,
});

const formattedCurrentTime = computed(() => {
  return formatTime(currentPosition.value);
});

const formattedTotalDuration = computed(() => {
  return formatTime(timeline.value?.totalDuration || 0);
});

const playbackRates = [0.5, 1, 1.5, 2, 3];

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

function updateTimelineUI() {
  if (
    !timelineRef.value ||
    !progressRef.value ||
    !bufferRef.value ||
    !timeline.value
  )
    return;

  currentPosition.value = timeline.value.position;

  const percentage =
    (timeline.value.position / timeline.value.totalDuration) * 100;
  progressRef.value.style.width = `${percentage}%`;

  // Calculate buffered length as percentage of total duration
  const bufferPercentage =
    ((timeline.value.bufferedLength + timeline.value.position) /
      timeline.value.totalDuration) *
    100;
  bufferRef.value.style.width = `${bufferPercentage}%`;

  // Update playing state
  isPlaying.value = !video.value?.paused;
}

function handleTimelineClick(event: MouseEvent) {
  if (!timelineRef.value || !timeline.value) return;

  const rect = timelineRef.value.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;
  const seekTime = clickPosition * timeline.value.totalDuration;

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
    Math.min(
      dragPosition * timeline.value.totalDuration,
      timeline.value.totalDuration
    )
  );

  currentPosition.value = seekTime;

  // Update UI immediately without actually seeking yet
  const percentage = (seekTime / timeline.value.totalDuration) * 100;
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

  const newTime = Math.min(
    timeline.value.position + 10,
    timeline.value.totalDuration
  );
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
      const tl = new Timeline(video.value);
      timeline.value = tl;
      currentPosition.value = 0;
      tl.load(src, props.codec).then(() => {
        singleFmp4.value = tl.singleFmp4;
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
            left: `${
              (currentPosition / (timeline?.totalDuration || 1)) * 100
            }%`,
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

          <!-- Rewind Button -->
          <button class="control-button" @click="seekBackward">
            <i class="icon-backward">◀◀</i>
          </button>

          <!-- Fast Forward Button -->
          <button class="control-button" @click="seekForward">
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
              <i v-if="isMuted || volume === 0" class="icon-volume-mute">🔇</i>
              <i v-else-if="volume < 0.5" class="icon-volume-low">🔈</i>
              <i v-else class="icon-volume-high">🔊</i>
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
