<template>
  <div :data-theme="mappedTheme">
    <NuxtPage />
  </div>
</template>
<script setup>
const colorMode = useColorMode();
const mappedTheme = ref("light");
// 讓 `system` 依據系統設定轉換成 `light` 或 `dark`
onMounted(() => {
  if (colorMode.value === "system") {
    mappedTheme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    mappedTheme.value = colorMode.value;
  }
});
</script>
<style>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}

/* 依據 data-theme 切換顏色 */
[data-theme="dark"] body {
  background-color: #091a28;
  color: #ebf4f1;
}

[data-theme="sepia"] body {
  background-color: #f1e7d0;
  color: #5b4636;
}
</style>
