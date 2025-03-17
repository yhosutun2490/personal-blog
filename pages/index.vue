<template>
  <div class="flex flex-col min-h-[100dvh] px-[20%] py-[2%]">
    <div class="introduction flex justify-between gap-[5%] w-[100%] h-fit">
      <div class="text-5xl flex flex-col gap-5 w-[60%] h-fit">
        歡迎來到我的部落格
        <main class="text-2xl">
          這裡是我的技術筆記與學習歷程的紀錄地，主要分享
          JavaScript、Vue.js、React以及相關開發經驗。<br />
          你可以透過部落格、文章分類頁面，快速找到你感興趣的內容。希望能幫助你少走彎路！<br />
          👉 開始探索，一起互相精進技術吧！ 🚀
        </main>
      </div>
      <NuxtImg src="keroro.jpg" class="w-[250px] h-[250px] rounded-xl" />
    </div>
    <div class="recent-post-blogs flex flex-col gap-5 mt-[1.5rem]">
      <p class="title text-3xl font-bold flex item-center gap-3">
        <Icon name="mingcute:airplane-line" size="36" />
        近期發布
      </p>
      <ul
        class="search-lists list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <li
          v-for="card in recentData"
          :key="card.title"
          class="cursor-pointer relative hover:top-[-10px]"
          @click="handleClickCard(card.alt)"
        >
          <ArticleCard :data="card" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
const { data: recentData, error } = await useAsyncData(
  `recent-post-blog`,
  () => {
    return queryCollection("blogs").order("date", "DESC").limit(3).all();
  }
);
console.log("pages", recentData.value);
</script>
