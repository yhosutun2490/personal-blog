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
      <NuxtImg src="category-logo.webp" class="w-[350px] h-[350px] rounded-xl" />
    </div>

    <section class="category-lists flex flex-wrap gap-5">
      <div  
        v-for="(data, index) in result"
        :key="data"
        class="badge text-xl h-[50px] w-fit font-bold"
        :class="badgeColors[index % 7]"
        @click="handleClickCategory(data.name)"
      >
        {{ data.name }} ({{ data.count }})
      </div>
    </section>

  </div>
</template>
<script setup>

const router = useRouter()
const { data: articles, error } = await useAsyncData(
  `all-blogs-data`,
  () => {
    return queryCollection("blogs").all();
  },
);
console.log('articles', articles.value)

const tagsLists = articles.value.map(items => items.tags).reduce((acc, tag) => {
  tag.forEach(item => acc[item] = (acc[item] || 0) + 1)
  return acc
}, {})
const result = Object.entries(tagsLists).map(([tag, count]) => ({ name: tag, count }));

const badgeColors = [
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error"
];


function handleClickCategory(category) {
  router.push({ name: 'category-tag', params: { tag:category } });
}

</script>