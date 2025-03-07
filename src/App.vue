<script setup lang="ts">
import { ref } from "vue";
import VideoPlayer from "./components/VideoPlayer.vue";

const videoPlayer = ref<{ value: HTMLVideoElement }>();
const url = ref(
  ""
);
</script>

<template>
  <VideoPlayer ref="videoPlayer" :src="url" />
  <input type="text" v-model="url" style="width: 100%" />
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>
