<template>
  <div class="blogs__pages prose prose-xl w-full max-w-none lg:px-[20%] lg:py-[2%]">
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<script setup>
const { name } = useRoute().params;
const { data: page, error } = await useAsyncData(
  `blogs-data-${name}`,
  () => {
    return queryCollection("blogs").where('alt', '=', name).first();
  },
);
</script>
