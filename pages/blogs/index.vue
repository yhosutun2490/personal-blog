<template>
  <div class="flex flex-col min-h-[100dvh] px-[20%] py-[2%]">
    <div class="introduction flex justify-between gap-[5%] w-[100%] h-fit">
      <div class="text-5xl flex flex-col gap-5 w-[60%] h-fit">
        所有文章列表
        <main class="text-2xl">
          這裡主要是匯集所有文章。
          利用主題關鍵字、文章大綱描述或標籤名稱，讓您更快速篩選出您感興趣的文章。
        </main>
      </div>
      <NuxtImg src="all-blogs-logo.webp" class="w-[250px] h-[250px] rounded-xl" />
    </div>
    <label class="input w-[100%] mt-[1.5rem]">
      <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      <input v-model.lazy="searchWords" type="search" class="h-[50px]" placeholder="搜尋關鍵字或標籤">
    </label>
    <TransitionGroup class="search-lists list min-h-[500px] mt-[2rem]" name="list" tag="ul">
      <li v-for="card in filterArticles" :key="card.title" class="cursor-pointer relative hover:top-[-10px] mb-[1rem]"
        @click="handleClickCard(card.alt)">
        <ArticleCard :data="card" class="lg:card-side lg:grid lg:grid-cols-[250px_1fr]" />
      </li>
    </TransitionGroup>

  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const searchWords = ref("");
const { data: articleCardData, error } = await useAsyncData(
  `all-blogs-data`,
  () => {
    return queryCollection("blogs").all();
  }
);

const filterArticles = computed(() => {
  const word = searchWords.value.trim().toLowerCase();
  if (word) {
    return articleCardData.value?.filter((item) =>
      (item.title || "").toLowerCase().includes(word) ||
      (item.description || "").toLowerCase().includes(word) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(word)) // 避免 tags 為 null
    );
  } else {
    return articleCardData.value;
  }
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>