<template>
  <main class="category-tags-page h-[100dvh] flex flex-col gap-5 px-[15%] py-[2%]">
    <div class="bg-secondary rounded-box w-[30%] w-max-[250px] h-15 flex text-2xl items-center justify-center">
      #{{ tag }}
    </div>
    <section class="pagination flex items-center">
      <Pagination 
        :data-per-row="dataPerPage" 
        :total-data-length="lists?.length"
        :active-page="currentPage"
        @update-page="(val)=>currentPage = val"
        @prev="handlePaginatorPrevNext('prev')"
        @next="handlePaginatorPrevNext('next')"
      />
      <p class="total-page text-xl text-gray-500 ml-[0.5rem]"> 共 {{ totalPages }} 頁，總計 {{ lists.length }} 篇</p>
    </section>
    <ul
      class="search-lists list
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
     <li 
        v-for="card in articleCardData"
        :key="card.title"
        class="cursor-pointer relative"
        @click="handleClickCard(card.alt)"
      >
       <ArticleCard 
        :data="card"
        class="group"
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
const dataPerPage = ref(3)
const articleCardData = computed(()=>{
  const start = (currentPage.value - 1) * dataPerPage.value; // 計算起始索引
  const end = start + dataPerPage.value; // 計算結束索引
  return lists.value?.map(item=>({
    date: item?.date,
    image: item?.ogImage,
    title:item?.title,
    description: item?.description,
    tags: item?.tags,
    alt: item?.alt
  }))?.slice(start,end)
})
const totalPages = computed(()=>Math.ceil(lists.value.length / dataPerPage.value))

function handlePaginatorPrevNext(step) {
  if (step === 'prev' && currentPage.value > 1) {
    currentPage.value --
  } else if (step === 'next' && currentPage.value < articleCardData.value.length ) {
    currentPage.value ++
  }
}

function handleClickCard(title) {
  router.push({ name: 'blogs-name', params: { name: title } });
}

</script>
