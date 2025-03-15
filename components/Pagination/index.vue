<template>
  <div class="join">
    <button class="join-item btn"><</button>
    <button
      v-for="page in pageNumber"
      :key="page"
      class="join-item btn"
      :class="{ 'btn-active': activePage === page }"
    >
      {{ page }}
    </button>
    <button class="join-item btn">></button>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  dataPerRow: {
    type: Number,
    default: 3,
  },
  totalDataLength: {
    type: Number,
    default: 3,
  },
  activePage: {
    type: Number,
    default: 1,
  },
});

const pageNumber = computed(() => {
  return Math.max(1, Math.ceil(props.totalDataLength / props.dataPerRow));
});
</script>
