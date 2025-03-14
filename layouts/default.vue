<template>
  <div class="layout-container relative w-full h-[auto]">
    <MainHeader class="sticky top-0 left-0 z-5"/>
    <slot />
    <MainFooter />
  </div>
</template>
<script setup>
// components
import MainHeader from "~/components/MainHeader/index.vue";
import MainFooter from "~/components/MainFooter/index.vue";
</script>
