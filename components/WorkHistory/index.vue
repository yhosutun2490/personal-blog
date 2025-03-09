<template>
  <section
    class="work-history w-[100%] h-[100dvh] px-[10%] flex items-center justify-between"
  >
    <Carousel
      v-bind="carouselConfig"
      ref="carouselRef"
      class="carousel h-[80%] my-auto"
      @slide-end="updateSlideIndex" 
    >
      <Slide v-for="item in carouselData" :key="item.id">
        <div class="card bg-base-100 w-[450px] h-[350px] shadow-sm rounded-2xl">
          <figure class="w-[100%] h-[100%]">
            <NuxtImg :src="item.image" class="card-img rounded-2xl" />
          </figure>
        </div>
      </Slide>
    </Carousel>
    <div class="card-body">
      <h2 class="card-title card-primary">{{ currentSlideData?.year }}</h2>
      <p>
        currentSlideData.data
      </p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
    <TimeLine 
      :years="timeLineYear" 
      :activeYear="currentSlideData.year"
      @update="(year)=>handleClickTimeLine(year)"
    />
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import "vue3-carousel/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import TimeLine from "@/components/WorkHistory/TimeLine.vue";
const carouselConfig = {
  itemsToShow: 1,
  gap: 0,
};

const carouselRef = ref(null);
const activeIndex = ref(0)
const carouselData = ref([
  {
    id: '1',
    year: '2025',
    image: "/2025-1.jpg",
    data: [

    ]
  },
  {
    id: '2',
    year: '2024',
    image: "/2024-1.jpg",
    data: [""],
  },
  {
    id: '3',
    year: '2023',
    image: "/2023-1.png",
    data: [""],
  },
  {
    id: '4',
    year: '2022',
    image: "/2022-1.jpg",
    data: [""],
  },
  {
    id: '4',
    year: '2021',
    image: "/2021-1.jpg",
    data: [""],
  },
]);
const timeLineYear = computed(()=>carouselData.value?.map(item=>item.year))
const currentSlideData = computed(()=>carouselData.value[activeIndex.value])
const lastScrollY = ref(0);
const scrollDirection = ref("down");

let isThrottled = false;

function throttle(func, delay) {
  return (...args) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
}
function updateSlideIndex(info) {
    activeIndex.value = info.currentSlideIndex
}

function handleClickTimeLine(year) {
  const slideIndex = carouselData.value.findIndex(item=>item.year === year)
  console.log('點擊年分',year,slideIndex)
  if (slideIndex !==-1) {
    carouselRef.value.slideTo(slideIndex)
  }
}

const handleScroll = throttle(() => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY.value) {
    scrollDirection.value = "down";
    carouselRef.value?.next();
  } else if (currentScrollY < lastScrollY.value) {
    scrollDirection.value = "up";
    carouselRef.value?.prev();
  }

  lastScrollY.value = currentScrollY;
}, 1000); // 1000ms 限制


onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.value.removeEventListener("scroll", handleScroll);
});
</script>
<style scoped>
.work-history {
  display: grid;
  grid-template-columns: 2fr 300px 2fr;
  gap: 25px;
  grid-template-rows: 100%;
}
.carousel {
  width: 100%;
  height: 100%;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
