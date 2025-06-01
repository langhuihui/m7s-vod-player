<script setup lang="ts">
import { ref } from "vue";
import VideoPlayer from "./components/VideoPlayer.vue";

const videoPlayer = ref<{ value: HTMLVideoElement }>();
const url = ref(
  // "./fmp4.m3u8"
  // "http://localhost:8080/hls/vod/fmp4.m3u8?start=1741944171&streamPath=live/1581F6Q8X24BU00G01HK"
  // "http://localhost:8080/hls/vod/fmp4.m3u8?start=1741674505&streamPath=live/265"
  "http://218.94.109.62:21221/hls/vod/fmp4.m3u8?start=1747962393962&end=1747962940311&streamPath=live/1581F6Q8X24BU00G01HK"
);
const onTimeupdate = (time: number) => {
  console.log("timeupdate", time);
};
</script>

<template>
  <VideoPlayer ref="videoPlayer" :src="url" @timeupdate="onTimeupdate" debug/>
  <input type="text" v-model="url" style="width: 100%" />
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>
