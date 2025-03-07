<script setup lang="ts">
import { ref, onMounted, computed, defineExpose, watch } from "vue";
import { Timeline } from "../timeline";

// No longer need the timeline prop as we'll create it internally
const props = defineProps<{
  src?: string;
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

watch(
  () => (video.value ? props.src : null),
  (src) => {
    if (timeline.value) timeline.value.destroy();
    if (!src) return;
    console.log(src);
    fetch(props.src!)
      .then((res) => res.text())
      .then((text) => {
        if (video.value) {
          timeline.value = new Timeline(
            video.value,
            text,
            new URL(props.src!).origin +
              new URL(props.src!).pathname.split("/").slice(0, -1).join("/"),
            {
              forward: 2,
              backward: 1,
            }
          );
          currentPosition.value = timeline.value.position;
        }
      });
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
    <video ref="video" @click="togglePlay"></video>

    <!-- Custom timeline UI -->
    <div
      v-if="timeline"
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
        <!-- Play/Pause Button -->
        <button class="control-button" @click="togglePlay">
          <span v-if="isPlaying" class="bili-icon">暂停</span>
          <span v-else class="bili-icon">播放</span>
        </button>

        <!-- Rewind Button -->
        <button class="control-button" @click="seekBackward">
          <span class="bili-icon">后退</span>
        </button>

        <!-- Fast Forward Button -->
        <button class="control-button" @click="seekForward">
          <span class="bili-icon">前进</span>
        </button>

        <!-- Current time display -->
        <div class="time-display">
          {{ formattedCurrentTime }} / {{ formattedTotalDuration }}
        </div>

        <!-- Playback rate control -->
        <div class="playback-rate">
          <div class="playback-label">倍速</div>
          <button
            v-for="rate in playbackRates"
            :key="rate"
            @click="changePlaybackRate(rate)"
            :class="{ active: playbackRate === rate }"
          >
            {{ rate }}x
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
  gap: 15px;
  padding: 5px 0;
  color: white;
}

.control-button {
  background: transparent;
  border: none;
  color: white;
  padding: 5px;
  cursor: pointer;
  font-size: 14px;
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
  margin-left: auto;
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

.playback-rate {
  display: flex;
  gap: 5px;
  align-items: center;
}

.playback-label {
  font-size: 12px;
  color: white;
}

.playback-rate button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 2px 5px;
  cursor: pointer;
  font-size: 12px;
  color: white;
  transition: all 0.2s;
}

.playback-rate button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.playback-rate button.active {
  background-color: #fb7299;
  color: white;
  border-color: #fb7299;
}
</style>
