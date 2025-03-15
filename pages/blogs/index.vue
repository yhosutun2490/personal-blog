<template>
  <div class="flex flex-wrap h-[600px] px-[20%] py-[2%] gap-[2rem]">
    <div class="introduction flex gap-[5%] w-[100%]">
      <div class="text-5xl flex flex-col gap-5 w-[60%]">
        文章分類
        <main class="text-2xl">
          這裡您可以透過點擊標籤來快速找到部落格相關主題的文章。
          這樣能夠更方便地探索特定領域的內容，無論是Vue、JavaScript、CSS，還是生活話題，都能輕鬆篩選出您感興趣的文章。
        </main>
      </div>
      <NuxtImg
        src="category-logo.webp"
        class="w-[350px] h-[350px] rounded-xl"
      />
    </div>
    <label class="input w-[100%]">
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
      <input type="search" required placeholder="搜尋關鍵字或選擇標籤" />
    </label>
  </div>
</template>
<script setup>
const { data: page, error } = await useAsyncData(`all-blogs-data`, () => {
  return queryCollection("blogs").all();
});
console.log("pages", page.value);
</script>
