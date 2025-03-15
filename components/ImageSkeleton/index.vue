<template>
  <div class="relative">
    <div
      v-if="!imageLoaded"
      class="skeleton absolute inset-0"
    />
    <!-- NuxtImg 圖片，當載入完成時顯示 -->
    <NuxtImg
      :src="src"
      class="w-full h-full object-cover"
      @load="imageLoaded = true"
      v-bind="attrs"
    />
  </div>
</template>
<script setup>
import { ref, useAttrs } from "vue";

const imageLoaded = ref(false);
const attrs = useAttrs()
defineProps({
    src: {
        type: String,
        default: '/404.jpg'
    }
})
</script>
