<script setup lang="ts">
import { ref } from "vue";
import VideoPlayer from "./components/VideoPlayer.vue";

const videoPlayer = ref<{ value: HTMLVideoElement }>();
const url = ref(
  "http://localhost:8080/hls/vod/fmp4.m3u8?start=1740655216&streamPath=live/test"
);
const codec = ref("");
</script>

<template>
  <VideoPlayer ref="videoPlayer" :src="url" :codec="codec" />
  <input type="text" v-model="url" style="width: 100%" />
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>
