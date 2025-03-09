<template>
  <div class="hero bg-base-200  px-[15%] py-[2%]">
    <div class="hero-content flex-col lg:flex-row">
      <div>
        <h1 class="text-5xl font-bold">黃思惇 - Rafael (拉法葉)</h1>
        <p class="py-6 w-[90%]">
          {{ description }}
        </p>
        <div class="skill__sections flex flex-col gap-3">
          <div class="front-end flex flex-wrap gap-2 w-[100%]">
            <div
              class="badge badge-outline badge-success min-w-fit"
              v-for="(item, index) in skills.frontEnd"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div class="back-end flex flex-wrap gap-2">
            <div
              class="badge badge-outline badge-info min-w-fit"
              v-for="(item, index) in skills.backEnd"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div class="other flex flex-wrap gap-2">
            <div
              class="badge badge-outline badge-error min-w-fit"
              v-for="(item, index) in skills.other"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div class="lang  flex flex-wrap gap-2">
            <div
              class="badge badge-outline badge-warning min-w-fit"
              v-for="(item, index) in skills.lang"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <NuxtImg
        src="personal.jpg"
        class="max-w-sm rounded-2xl shadow-2xl w-[300px] h-[300px]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const description = ref(`
  我是拉法葉，一名具有一年半資歷的前端工程師，曾參與客戶數據平台與設計公司的開發專案。
  擁有 Vue.js 和 React.js 開發經驗，並具備良好的團隊合作與問題解決能力。
  曾於國際合作發展基金會(ICDF)擔任海外農業技師五年，期間透過自學分析氣象資料，開發輔助工具，協助農民團體優化生產管理。
`);

const skills = ref({
  frontEnd: [
    "JavaScript",
    "CSS",
    "Vue",
    "Pinia",
    "Nuxt",
    "Nuxt-content",
    "React",
    "VueUse",
    "ViTest",
  ],
  backEnd: ["Express", "Flask", "TypeORM", "Postgre-sql","Restful API"],
  other: ["git", "Storybook"],
  lang: ["English", "Spanish"],
});
</script>
