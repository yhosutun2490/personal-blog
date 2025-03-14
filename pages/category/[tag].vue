<template>
  <div>
    <ul
      class="search-lists list w-[100%] h-max-[300px] bg-base-300 rounded-box shadow-md"
    >
      <li
        class="list-row px-[1.5rem] py-[1rem]"
        v-for="item in articles"
        :key="item.title"
        @click="handleClickCard(item.alt)"
      >
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
