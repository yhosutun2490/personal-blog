<template>
  <div class="flex flex-wrap px-[20%] py-[2%] gap-[2rem]">
    <div class="introduction flex w-[100%]">
      <h2 class="text-2xl w-[50%]">
        Category
      </h2>
      <NuxtImg src="category-logo.webp" class="w-[350px] h-[350px]" />
    </div>

    <label class="input w-[100%]">
      <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      <input type="search" required placeholder="搜尋關鍵字或選擇標籤">
    </label>
    <section class="category-lists flex flex-wrap gap-5">
      <div v-for="(data, index) in result" class="badge badge-outline text-xl h-[30px] w-fit"
        :class="badgeColors[index % 7]">
        {{ data.name }} ({{ data.count }})
      </div>
    </section>
    <ul class="search-lists list w-[100%] h-max-[300px] bg-base-300 rounded-box shadow-md">
      <li class="list-row px-[1.5rem] py-[1rem] " v-for="(item) in articles" :key="item.title"
        @click="handleClickCard(item.alt)">
        <div>
          <NuxtImg :src="item.ogImage" class="w-[100px] h-[100px] rounded-lg" />
        </div>
        <div>
          <div class="text-xl">{{ item.title }}</div>
          <div class="text-base uppercase font-semibold opacity-60">
            {{ item.description }}
          </div>
        </div>
      </li>
    </ul>
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


function handleClickCard(title) {
  router.push({ name: 'blogs-name', params: { name: title } });
}

</script>