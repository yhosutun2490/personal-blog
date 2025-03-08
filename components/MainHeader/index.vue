<template>
  <div class="navbar flex justify-between items-center px-[20%] py-5 border-b
      dark:border-gray-800
      light:border-gray-200 
      sepia: border-amber-100
     font-semibold"
     :data-theme="$colorMode.preference"
  >
    <NuxtLink to="/" class="text-2xl"> Rafael(拉法葉)'s Blog </NuxtLink>
    <NuxtLink to="/" class="text-2xl"> 鐵人賽專欄</NuxtLink>
    <NuxtLink to="/" class="text-2xl"> 所有文章</NuxtLink>
    <NuxtLink to="/" class="text-2xl"> 心情雜事</NuxtLink>
    <ClientOnly>
      <ColorModePicker />
    </ClientOnly>
    <Icon
      icon="vaadin:search"
      width="24"
      height="24"
      class="cursor-pointer"
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
