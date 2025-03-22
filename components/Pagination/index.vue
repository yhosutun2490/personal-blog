<template>
  <div class="join">
    <button class="join-item btn btn-base-300" @click="handlePrevNext('prev')">
      <
    </button>
    <button
      v-for="page in visiblePages"
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

const totalPages  = computed(() => {
  return Math.max(1, Math.ceil(props.totalDataLength / props.dataPerRow));
});

const visiblePages = computed(() => {
  const pages = [];

  if (totalPages.value <= 3) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, props.activePage - 1);
    let end = Math.min(totalPages.value, props.activePage + 1);

    // 補滿3個
    if (end - start < 2) {
      if (start === 1) {
        end = start + 2;
      } else if (end === totalPages.value) {
        start = end - 2;
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
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
