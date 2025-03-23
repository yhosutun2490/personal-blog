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
      <input
        v-model.lazy="searchQuery"
        type="search"
        class="h-[50px]"
        placeholder="搜尋關鍵字或標籤"
      />
    </label>
    <section class="pagination flex items-center mt-[1rem]">
      <Pagination
        :data-per-row="perPage"
        :total-data-length="blogsCounts"
        :active-page="page"
        @update-page="(val) => (page = val)"
        @prev="handlePaginatorPrevNext('prev')"
        @next="handlePaginatorPrevNext('next')"
      />
      <p class="total-page text-xl text-gray-500 ml-[0.5rem]">
        共 {{ totalPages }} 頁，總計 {{ blogsCounts }} 篇
      </p>
    </section>
    <TransitionGroup
      class="search-lists list min-h-[500px] mt-[2rem]"
      name="list"
      tag="ul"
    >
      <li
        v-for="card in blogsData"
        :key="card.title"
        class="cursor-pointer relative mb-[1rem]"
        @click="handleClickCard(card.alt)"
      >
        <ArticleCard
          :data="card"
          class="lg:card-side lg:grid lg:grid-cols-[250px_1fr] group"
        />
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup>
import { ref } from "vue";
const router = useRouter()
const searchQuery = ref(""); // 儲存搜尋關鍵字
const page = ref(1); // 當前分頁索引
const perPage = 3; // 每頁顯示3篇文章

// 查詢文章總數
const { data: blogsCounts } = await useAsyncData(
  "blogs-counts",
  async () => {
    try {
      if (searchQuery.value) {
        // 若有搜尋關鍵字，查詢符合條件的文章數
        return await queryCollection("blogs")
          .where("title", "LIKE", `%${searchQuery.value}%`)
          .orWhere((query) => 
            query.where("tags", "LIKE", `%${searchQuery.value}%`)
            .where("description", "LIKE", `%${searchQuery.value}%`)
          )
          .count();
      } else {
        return await queryCollection("blogs").count();
      }
    } catch (err) {
      console.warn("查詢文章總數失敗", err.message);
      return 0;
    }
  },
  { watch: [searchQuery] } // 監聽關鍵字變化，重新計算總數
);

// 查詢當前分頁的文章
const { data: blogsData } = await useAsyncData(
  "blogs-data",
  async () => {
    try {
      let query = queryCollection("blogs").order("date", "DESC"); // all datas

      if (searchQuery.value) {
        query = query
          .where("title", "LIKE", `%${searchQuery.value}%`)
          .orWhere((query) => 
            query.where("tags", "LIKE", `%${searchQuery.value}%`)
            .where("description", "LIKE", `%${searchQuery.value}%`)
          )
      }
      return await query
        .skip((page.value - 1) * perPage)
        .limit(perPage)
        .all();
    } catch (err) {
      console.warn("查詢文章資料失敗", err.message);
      return [];
    }
  },
  { watch: [searchQuery, page] } // 監聽關鍵字與分頁變化，重新查詢
);

// 計算總頁數
const totalPages = computed(() =>
  blogsCounts.value ? Math.ceil(blogsCounts.value / perPage) : 1
);

function handlePaginatorPrevNext(step) {
  if (step === "next") {
    if (page.value < totalPages.value) {
      page.value++;
    }
  } else {
    if (page.value > 0) {
      page.value--;
    }
  }
}
function handleClickCard(blogAlt) {
  router.push({ name: 'blogs-name', params: { name:blogAlt } });
}
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
