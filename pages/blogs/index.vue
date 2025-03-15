<template>
  <div class="flex flex-col min-h-[80dvh] px-[20%] py-[2%]">
    <div class="introduction flex justify-between gap-[5%] w-[100%] h-fit">
      <div class="text-5xl flex flex-col gap-5 w-[60%] h-fit">
        所有文章列表
        <main class="text-2xl">
          這裡主要是匯集所有文章。
          利用主題關鍵字或文章大綱描述，讓您輕鬆篩選出您感興趣的文章。
        </main>
      </div>
      <NuxtImg
        src="all-blogs-logo.webp"
        class="w-[250px] h-[250px] rounded-xl"
      />
    </div>
    <label class="input w-[100%] mt-[1.5rem]">
      <svg
        class="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      <input type="search" class="h-[50px]" placeholder="搜尋關鍵字或選擇標籤" />
    </label>
  </div>
</template>
<script setup>
const { data: page, error } = await useAsyncData(`all-blogs-data`, () => {
  return queryCollection("blogs").all();
});
console.log("pages", page.value);
</script>
