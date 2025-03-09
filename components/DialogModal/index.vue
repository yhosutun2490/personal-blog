<template>
  <dialog id="modal__search" :data-theme="$colorMode.preference" class="modal z-10" open>
    <div class="modal-box">
      <InputSearch />
      <p class="py-4">Press ESC key or click the button below to close</p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="emits('close')">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
<script setup>
import InputSearch  from '@/components/InputSearch/index.vue';
const emits = defineEmits(['close'])
</script>
