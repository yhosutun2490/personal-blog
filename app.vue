<template>
  <div class="w-[100%] h-[100dvh]" ref="containerRef">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watchEffect, onMounted, provide } from "vue";
const colorMode = useColorMode();
const { containerRef, locoScroll } = useLocoScroll();
provide('locoScroll',locoScroll)

// 確保 document 只在 client 端執行
const updateTheme = () => {
  if (process.client) {
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

// 在元件掛載後更新主題
onMounted(updateTheme);

// 監聽 colorMode 變更並更新主題
watchEffect(updateTheme);
</script>
<style></style>
