<template>
  <div class="card bg-base-100 shadow-lg flex flex-col">
    <figure class="w-full aspect-[16/9]">
      <NuxtImg
        class="object-cover w-full h-full"
        :src="data?.image"
        alt="card-img"
      />
    </figure>

    <div class="card-body h-[280px] flex flex-col">
      <div class="card-date">{{ data?.date }}</div>
      <h2 class="card-title">
        {{ data.title }}
      </h2>

      <!-- 標籤區域 -->
      <div class="tag-lists flex gap-3">
        <div
          class="card-tags badge badge-accent"
          v-for="badge in data?.tags"
          :key="badge"
        >
          {{ badge }}
        </div>
      </div>

      <p
        class="card-description w-full"
      >
        {{ data.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>
