<template>
  <main class="category-tags-page h-[100dvh] flex flex-col gap-5 px-[15%] py-[2%]">
    <div class="bg-secondary rounded-box w-[30%] w-max-[250px] h-15 flex text-2xl items-center justify-center">
      #{{ tag }}
    </div>
    <section class="pagination">
      <Pagination 
        :data-per-row="3" 
        :total-data-length="lists?.length"
        :active-page="currentPage"
      />
    </section>
    <ul
      class="search-lists list
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
     <li 
        v-for="card in articleCardData"
        :key="card.title"
      >
       <ArticleCard 
        :data="card"
       />
     </li>
    </ul>
  </main>
</template>

<script setup>
import { ref } from 'vue'
// component
import ArticleCard from '@/components/ArticleCard/index.vue';
import Pagination  from '@/components/Pagination/index.vue';

const router = useRouter()
const { tag } = useRoute().params
const { data: lists } = await useAsyncData(
  `blog-category-data`,
  () => {
    try {
      return queryCollection("blogs").where("tags", "LIKE", `%${tag}%`) 
      .all();
    } catch (err) {
      console.warn('get category err',err)
      return []
    }

  },
);
const currentPage = ref(1)

const articleCardData = computed(()=>{
  return lists.value?.map(item=>({
    date: item?.date,
    image: item?.ogImage,
    title:item?.title,
    description: item?.description,
    tags: item?.tags
  }))
})


function handleClickCard(title) {
  router.push({ name: 'blogs-name', params: { name: title } });
}

</script>
