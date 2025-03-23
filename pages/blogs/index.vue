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
    <label class="input md:w-[100%] lg:w-[70%] mt-[1.5rem]">
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
import { ref, watch } from "vue";
const router = useRouter();
const searchQuery = ref(""); // 儲存搜尋關鍵字
const page = ref(1);         // 當前分頁索引
const perPage = 3;           // 每頁顯示3篇文章

// 撈出所有文章（只撈一次）
const { data: allBlogs } = await useAsyncData("blogs-all", () =>
  queryCollection("blogs").order('date', 'DESC').all()
);

// 計算搜尋後的文章總數
const blogsCounts = computed(() => {
  if (!allBlogs.value) return 0;

  if (!searchQuery.value) return allBlogs.value.length;

  const keyword = searchQuery.value.toLowerCase();

  return allBlogs.value.filter((blog) => {
    const titleMatch = blog.title?.toLowerCase().includes(keyword);
    const descMatch = blog.description?.toLowerCase().includes(keyword);
    const tagsMatch = Array.isArray(blog.tags)
      ? blog.tags.some((tag) => tag.toLowerCase().includes(keyword))
      : false;

    return titleMatch || descMatch || tagsMatch;
  }).length;
});

// 取得目前分頁的文章
const blogsData = computed(() => {
  if (!allBlogs.value) return [];

  const keyword = searchQuery.value.toLowerCase();

  // 篩選符合關鍵字的文章
  const filtered = searchQuery.value
    ? allBlogs.value.filter((blog) => {
        const titleMatch = blog.title?.toLowerCase().includes(keyword);
        const descMatch = blog.description?.toLowerCase().includes(keyword);
        const tagsMatch = Array.isArray(blog.tags)
          ? blog.tags.some((tag) => tag.toLowerCase().includes(keyword))
          : false;
        return titleMatch || descMatch || tagsMatch;
      })
    : allBlogs.value;

  // 計算分頁資料
  const start = (page.value - 1) * perPage;
  return filtered.slice(start, start + perPage);
});

// 計算總頁數
const totalPages = computed(() =>
  blogsCounts.value ? Math.ceil(blogsCounts.value / perPage) : 1
);

// 搜尋時自動跳回第 1 頁
watch(searchQuery, () => {
  page.value = 1;
});

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
  router.push({ name: "blogs-name", params: { name: blogAlt } });
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
