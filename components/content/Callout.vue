<template>
  <div class="callout">
    <h2 v-if="$slots.title">
      <slot name="title" mdc-unwrap="p" />
    </h2>
    <slot />
  </div>
</template>