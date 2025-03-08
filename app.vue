<template>
  <div class="w-[100dvw] h-[100dvh]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watchEffect, onMounted } from "vue";
const colorMode = useColorMode();
// 確保 document 只在 client 端執行
const updateTheme = () => {
  if (process.client) {
    if (colorMode.value === "light") {
      document.documentElement.setAttribute("data-theme", "bumblebee");
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
<style>
.light-mode body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}

/* 依據 data-theme 切換顏色 */
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}

.sepia-mode body {
  background-color: #f1e7d0;
  color: #5b4636;
}
</style>
