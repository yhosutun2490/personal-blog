<template>
  <div ref="containerRef" class="w-[100%]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watchEffect, onMounted, onUnmounted } from "vue";
import LocomotiveScroll from "locomotive-scroll";
definePageMeta({
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});

const colorMode = useColorMode();
const containerRef = ref(null);
const locoScroll = ref(null);
provide("locoScroll", locoScroll);

// 確保 document 只在 client 端執行
const updateTheme = () => {
  if (import.meta.client) {
    if (colorMode.value === "light") {
      document.documentElement.setAttribute("data-theme", "cupcake");
    } else if (colorMode.value === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (colorMode.value === "retro") {
      document.documentElement.setAttribute("data-theme", "retro");
    } else {
      document.documentElement.setAttribute("data-theme", colorMode.value);
    }
  }
};

// 監聽 colorMode 變更並更新主題
watchEffect(updateTheme);
// 在元件掛載後更新主題
onMounted(() => {
  updateTheme();
  if (import.meta.client && containerRef.value) {
    locoScroll.value = new LocomotiveScroll({
      el: containerRef.value,
      smooth: true,
    });
  }
});

onUnmounted(() => {
  if (locoScroll.value) {
    locoScroll.value.destroy();
    locoScroll.value = null;
  }
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>