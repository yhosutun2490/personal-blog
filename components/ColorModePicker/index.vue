<template>
  <div class="color-mode-picker flex gap-3">
    <div
      v-for="theme of ['cupcake', 'dark', 'retro']"
      :key="theme"
      :class="{
        'border-gray-300': colorMode.value !== theme,
        'border-cyan-900 text-cyan-900': colorMode.value === theme,
      }"
      class="relative border-2 rounded p-1 cursor-pointer
      transition-all duration-300 ease-in-out"
    >
      <Icon
        :icon="iconName(theme)"
        class="size-6"
        @click="changeTheme(theme)"
      />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const colorMode = useColorMode()

function changeTheme (theme)  {
  colorMode.preference = theme
}
function iconName(theme) {
  if (theme === "cupcake") return "vaadin:sun-o";
  if (theme === "dark") return "vaadin:moon-o";
  if (theme === "retro") return "vaadin:coffee";
  return "vaadin:sun-o";
}
</script>


