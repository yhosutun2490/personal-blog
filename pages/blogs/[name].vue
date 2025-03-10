<template>
  <div class="blogs__pages">
    <p>我是blogs分頁</p>
    <ContentRenderer v-if="page" :value="page[0]" />
  </div>
</template>

<script setup>
const { name } = useRoute().params;
const { data:page , error } = await useAsyncData(
  `blogs-data`,
  () => {
    return queryCollection("blogs").all();
  },
  {
    watch: [name],
  }
);
console.log('blogs pages', page.value)
</script>
