<template>
  <div class="main-page">
    <div class="hero bg-base-200 px-[15%] py-[2%]">
      <div class="hero-content flex-col lg:flex-row">
        <div class="w-[100%] lg:w-[75%]">
          <h1 class=" text-2xl lg:text-3xl xl:text-5xl font-bold">黃思惇 - Rafael (拉法葉)</h1>
          <p class="py-6 w-[90%]">
            {{ description }}
          </p>
          <div class="skill__sections flex flex-col gap-3">
            <div class="front-end flex flex-wrap gap-2 w-[100%]">
              <div
                v-for="(item, index) in skills.frontEnd"
                :key="index"
                class="badge badge-outline badge-success min-w-fit"
              >
                {{ item }}
              </div>
            </div>
            <div class="back-end flex flex-wrap gap-2">
              <div
                v-for="(item, index) in skills.backEnd"
                :key="index"
                class="badge badge-outline badge-info min-w-fit"
              >
                {{ item }}
              </div>
            </div>
            <div class="other flex flex-wrap gap-2">
              <div
                v-for="(item, index) in skills.other"
                :key="index"
                class="badge badge-outline badge-error min-w-fit"
              >
                {{ item }}
              </div>
            </div>
            <div class="lang flex flex-wrap gap-2">
              <div
                v-for="(item, index) in skills.lang"
                :key="index"
                class="badge badge-outline badge-warning min-w-fit"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <ImageSkeleton 
          :src="'personal.jpg'"
          class="max-w-sm rounded-2xl shadow-2xl 
          w-[200px] h-[200px] mb-auto
          lg:w-[250px] lg:h-[250px]"
        />
      </div>
    </div>
    <div class="work-history-section w-[100%] h-[80dvh] py-[70px] ">
      <WorkHistory />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import WorkHistory from "@/components/WorkHistory/index.vue";
import ImageSkeleton  from "@/components/ImageSkeleton/index.vue";

const description = ref(`
  我是拉法葉，一名具有一年半資歷的前端工程師，參與客戶數據平台與設計公司的開發專案。
  於2025年榮獲IT邦幫忙-鐵人賽技術文章-JavaScript組-佳作。
  擁有 Vue.js 和 React.js 開發經驗，並具備良好的團隊合作與問題解決能力。
  並曾擔任國際合作發展基金會(ICDF)擔任海外農業技師五年，分析氣象資料，開發輔助工具，協助農民團體優化生產管理。
`);

const skills = ref({
  frontEnd: [
    "JavaScript",
    "CSS",
    "Vue",
    "Pinia",
    "Nuxt",
    "Nuxt-content",
    "VueUse",
    "ViTest",
    "Three.js",
    "Babylon.js",
    "React",
  ],
  backEnd: ["Express", "Flask", "TypeORM", "Postgre-sql", "Restful API"],
  other: ["git", "Storybook"],
  lang: ["English", "Spanish"],
});
</script>
