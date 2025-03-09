<template>
  <ul class="flex flex-col timeline timeline-vertical h-[100%]">
    <p class="title text-primary text-xl text-center mb-[1rem]">Career Road Map</p>
    <li 
        class="h-[15%]"
        v-for="(year, index) in years" :key="year"
    >
      <hr :class="{'bg-primary': activeYear >= year}"/>
      <div 
        class="timeline-start timeline-box btn cursor-pointer text-xl hover:scale-[1.05]"
        :class="{'text-primary': activeYear >= year}"
        v-if="index%2!==0"
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
        class="timeline-end timeline-box btn cursor-pointer text-xl  hover:scale-[1.05]"
        :class="{'text-primary': activeYear >= year}"
        v-if="index%2===0"
        @click="emits('update',year)"
      >
        {{ year }}
      </div>
      <hr :class="{'bg-primary': activeYear >= year}"/>
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
