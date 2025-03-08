<template>
    <div class="bg-white dark:bg-black light:bg-gray-100 sepia:bg-[#704214]">
      <p class="text-gray-900 dark:text-white light:text-cyan-800 sepia:text-[#FFF8E7]">
        這是一個多主題模式範例
      </p>
    </div>
  </template>
  <script setup>
  const colorMode = useColorMode()
  
  console.log(colorMode.preference)
//   definePageMeta({
//     colorMode: 'light',
//  })
  </script>
  
