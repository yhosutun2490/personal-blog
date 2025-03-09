<template>
  <div class="navbar flex justify-between items-center px-[5%] py-5 border-b
      dark:border-gray-800
      light:border-gray-200 
      sepia: border-amber-100
     font-semibold"
     :data-theme="$colorMode.preference"
  >
    <NuxtLink to="/" class="text-2xl"> Rafael's Blog </NuxtLink>
    <NuxtLink to="/" class="nav-link text-lg ml-auto"> 鐵人賽專欄</NuxtLink>
    <NuxtLink to="/" class="nav-link text-lg mx-[1rem]"> 所有文章</NuxtLink>
    <NuxtLink to="/" class="nav-link text-lg mr-[1rem]"> 心情雜事</NuxtLink>
    <ClientOnly>
      <ColorModePicker />
    </ClientOnly>
    <Icon
      icon="vaadin:search"
      width="24"
      height="24"
      class="cursor-pointer ml-[1rem]"
      @click="isOpenSearchModal=true"
    />
    <DialogModal
      @close="isOpenSearchModal=false" 
      v-if="isOpenSearchModal"
    />
  </div>
</template>

<script setup>
import ColorModePicker from "@/components/ColorModePicker/index.vue"
import DialogModal  from "@/components/DialogModal/index.vue";
import { Icon } from "@iconify/vue";

import { ref } from "vue"
const isOpenSearchModal = ref(false)
</script>
<style scoped>
.nav-link {
  position: relative;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
}
.nav-link:hover::after {
  width: 100%;
  transform: translateX(-50%) scaleX(1);
}
</style>