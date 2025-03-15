<template>
  <div class="card bg-base-100 shadow-lg flex flex-col">
    <figure class="w-full aspect-[16/9]">
      <ImageSkeleton 
        class="object-cover w-full h-full"
        :src="data?.image"
        alt="card-img"
      />
    </figure>

    <div class="card-body h-[250px] flex flex-col">
      <div class="card-date">{{ data?.date }}</div>
      <h2 class="card-title">
        {{ data.title }}
      </h2>

      <!-- 標籤區域 -->
      <div class="tag-lists flex gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m12 12.625l1.275.775q.275.175.538-.025T14 12.85l-.325-1.45l1.1-.95q.25-.225.163-.525t-.438-.35l-1.45-.125l-.6-1.375q-.125-.3-.45-.3t-.45.3l-.6 1.375l-1.45.125q-.35.05-.437.35t.162.525l1.1.95L10 12.85q-.075.325.188.525t.537.025zM12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162z"
          />
        </svg>
        <div
          v-for="badge in data?.tags"
          :key="badge"
          class="card-tags badge badge-accent"
        >
          {{ badge }}
        </div>
      </div>

      <p class="card-description text-base w-full line-clamp-3">
        {{ truncatedDescription }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ImageSkeleton from "@/components/ImageSkeleton/index.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const truncatedDescription = computed(() => {
  const maxLength = 70; // 設定字數限制
  return props.data?.description?.length > maxLength
    ? props.data.description.slice(0, maxLength) + "..."
    : props.data.description;
});
</script>
