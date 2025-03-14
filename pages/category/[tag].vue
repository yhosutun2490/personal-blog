<template>
  <container class="category-tags-page">
    <div class="card bg-secondary rounded-box w-[30%] w-max-[250px] h-15 place-items-center">
      #{{ tag }}
    </div>
    <ul
      class="search-lists list w-[100%] h-[100dvh] bg-base-300 rounded-box shadow-md"
    >
      <li
        class="list-row px-[1.5rem] py-[1rem]"
        v-for="item in lists"
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
  </container>
</template>

<script setup>

const router = useRouter()
const { tag } = useRoute().params
const { data: lists, error } = await useAsyncData(
  `blog-category-data`,
  () => {
    return queryCollection("blogs").where("tags", "LIKE", `%${tag}%`) 
    .all();
  },
);
console.log('所有標籤文章', lists.value,'tag',tag)


function handleClickCard(title) {
  router.push({ name: 'blogs-name', params: { name: title } });
}

</script>
