<template>
  <ul class="flex items-center justify-center lg:flex-col timeline lg:timeline-vertical w-[100%] h-[100%]">
    <p class="hidden xl:block title text-primary text-xl text-center mb-[1rem]">Career Road Map</p>
    <li 
        v-for="(year, index) in years"
        :key="year" class="w-[15%] h-[5%] lg:h-[20%]"
    >
      <hr :class="{'bg-primary': activeYear >= year}">
      <div 
        v-if="index%2!==0"
        class="timeline-start timeline-box btn cursor-pointer text-sm lg:text-xl hover:scale-[1.05]"
        :class="{'text-primary': activeYear >= year}"
        @click="emits('update',year)"
      >
        {{ year }}
      </div>
      <div class="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
         :fill="activeYear >= year ? 'currentColor' : 'gray'"
          class="text-primary h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div 
        v-if="index%2===0"
        class="timeline-end timeline-box btn cursor-pointer text-sm lg:text-xl  hover:scale-[1.05]"
        :class="{'text-primary': activeYear >= year}"
        @click="emits('update',year)"
      >
        {{ year }}
      </div>
      <hr :class="{'bg-primary': activeYear >= year}">
    </li>
  </ul>
</template>
<script setup>

const props = defineProps({
    years: {
        type: Array,
        default: ()=>[]
    },
    activeYear: {
        type: String,
        default: '2025'
    }
})
const emits = defineEmits(['update'])
</script>
