<template>
    <div class="bg-white dark:bg-black light:bg-gray-100 sepia:bg-[#704214]">
      <label class="input w-[100%]">
      <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      <input type="search" required placeholder="搜尋關鍵字或選擇標籤">
    </label>
    </div>
  </template>
  <script setup>

  const { data:page, error } = await useAsyncData(
  `all-blogs-data`,
  () => {
    return queryCollection("blogs").all();
  },
);
  console.log('pages',page.value)

  </script>
  
