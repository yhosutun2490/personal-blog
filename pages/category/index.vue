<template>
    <div class="flex flex-wrap lg:px-[20%] lg:py-[2%]">
      <h2>
        Category
      </h2>
      <NuxtImg src="category-logo.webp"></NuxtImg>
    </div>
  </template>
  <script setup>

  const { data:page, error } = await useAsyncData(
  `all-blogs-data`,
  () => {
    return queryCollection("blogs").all();
  },
);
  console.log('pages',page.value)

  </script>
  