<template>
  <div class="join">
    <button class="join-item btn btn-base-300" @click="handlePrevNext('prev')">
      <
    </button>
    <button
      v-for="page in pageNumber"
      :key="page"
      class="join-item btn btn-primary"
      :class="{
        'btn-active': activePage === page,
        'opacity-50': activePage !== page,
      }"
      @click="updatePage(page)"
    >
      {{ page }}
    </button>
    <button class="join-item btn" @click="handlePrevNext('next')">></button>
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

const emits = defineEmits(["updatePage", "prev", "next"]);

const pageNumber = computed(() => {
  return Math.max(1, Math.ceil(props.totalDataLength / props.dataPerRow));
});

function updatePage(number) {
  emits("updatePage", number);
}

function handlePrevNext(step) {
  if (["prev", "next"].includes(step)) {
    emits(step);
  } else {
    console.warn(`Invalid step: ${step}. Expected 'prev' or 'next'.`);
  }
}
</script>
