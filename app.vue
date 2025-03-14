<template>
  <div ref="containerRef" class="w-[100%] h-[100dvh]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watchEffect, onMounted, provide } from "vue";
const colorMode = useColorMode();
const { containerRef, locoScroll } = useLocoScroll();
// 讓 `provide` 的值是 computed
provide("locoScroll", computed(() => locoScroll.value));

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

// 在元件掛載後更新主題
onMounted(updateTheme);

// 監聽 colorMode 變更並更新主題
watchEffect(updateTheme);
</script>
<style></style>
