<template>
  <div class="blogs__pages relative prose-xl w-full flex-grow px-[5%] py-[3%]">
    <p>我是blogs分頁</p>
    <ul class="sticky top-[10%] left-[95%] menu bg-base-200 rounded-box w-[300px]">
      <li v-for="link in page.body.toc.links" :key="link.id">
        <a @click="scrollToSection(link.id)">{{ link.id }}</a>
      </li>
    </ul>
    <div @click="scrollToSection">Scroll</div>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
const { name } = useRoute().params;
const router = useRouter();

const { data: page, error } = await useAsyncData(
  `blogs-data-${name}`,
  () => {
    return queryCollection("blogs").first();
  },
);
console.log('blogs pages', page.value)

function scrollToSection(id) {
  router.push({
    hash: `#${id}`
  })
}
</script>
