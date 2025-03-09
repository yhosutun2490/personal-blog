<template>
  <section class="work-history w-[100%] h-[100dvh] px-[10%] flex items-center">
    <WorkCarousel />
    <TimeLine />
  </section>
</template>

<script setup>
import TimeLine from "@/components/WorkHistory/TimeLine.vue";
import WorkCarousel from "@/components/WorkHistory/WorkCarousel.vue";
</script>
