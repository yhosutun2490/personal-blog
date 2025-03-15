<template>
  <div class="relative">
    <div
      v-if="!imageLoaded"
      class="skeleton absolute rounded-2xl inset-0"
    />
    <!-- NuxtImg 圖片，當載入完成時顯示 -->
    <NuxtImg
      :src="src"
      class="w-full h-full object-cover rounded-2xl"
      @load="imageLoaded = true"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";

const imageLoaded = ref(false);
defineProps({
    src: {
        type: String,
        default: '/404.jpg'
    }
})
</script>
