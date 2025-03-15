<template>
  <div class="relative">
    <!-- Skeleton loading -->
    <div
      v-if="!imageLoaded && !imageLoadedError"
      class="skeleton absolute inset-0 rounded-none"
    />

    <!-- 若載入失敗則顯示 404 圖片 -->
    <NuxtImg
      v-if="imageLoadedError"
      src="404.jpg"
      class="w-full h-full object-cover"
      v-bind="attrs"
    />

    <!-- NuxtImg 圖片，當載入完成時顯示 -->
    <NuxtImg
      v-else
      :src="src"
       v-bind="attrs"
      class="w-full h-full object-cover"
      @load="handleLoad"
      @error="handleError" 
    />
  </div>
</template>

<script setup>
import { ref, useAttrs } from "vue";

const attrs = useAttrs();
const imageLoaded = ref(false);
const imageLoadedError = ref(false);

defineProps({
  src: {
    type: String,
    default: "/404.jpg",
  }
});

// 當圖片成功載入時
const handleLoad = () => {
  imageLoaded.value = true;
};

// 當圖片載入失敗時
const handleError = () => {
  imageLoadedError.value = true;
  imageLoaded.value = false; // 確保 `imageLoaded` 為 `false`
};
</script>