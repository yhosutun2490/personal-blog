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
    <div class="card-body w-[100%] font-semibold">
      <h2 class="card-title card-primary text-2xl">{{ currentSlideData?.year }}</h2>
      <main>
        <p class="text-lg mb-[1rem]"> {{ currentSlideData?.data?.main }}</p>
        <hr/>
        <div 
          class="work-road-map px-[12px] py-[10px]"
          v-for="(data,index) in currentSlideData?.data?.fulfillment"
          :key="index"
        >
          {{ data }}
        </div>
      </main>
      <div class="w-[100%] flex flex-wrap gap-2 card-skills">
        <div 
          class="badge badge-dash badge-info"
           v-for="(data,index) in currentSlideData?.data?.skills"
          :key="index"
        >
          {{ data }}
        </div>
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
    data: {
      main:'第16屆IT邦幫忙-JavaScript組-佳作',
      fulfillment: [
        '重構客戶數據平台(CDP)會員權限系統，ViTest單元測試',
        '官網改版i18n建立'
      ],
      skills: ['Vue','Vitest','Nuxt-Content','Nuxt-i18n','Express.js','TypeORM','Postgres']
    },  
  },
  {
    id: '2',
    year: '2024',
    image: "/2024-1.jpg",
    data:  {
      main:'聚典資訊',
      fulfillment: [
        '完成AI語音線上產品型錄平台',
        '完成聊天機器人前台和後台問答集介面開發',
        '完成客戶數據篩選器重構',
        '完成客戶廣告投放系統(Email)重構'
      ],
      skills: ['Vue','Flask','Nuxt','VueUse', 'Vite','StoryBook']  
    }
  },
  {
    id: '3',
    year: '2023',
    image: "/2023-1.png",
    data:  {
      main:'王一互動科技(04~08)、聚典資訊(09~12)',
      fulfillment: [
        '完成遠雄線上賞屋3D系統優化案',
        '完成數位台北館3D系統優化案',
        '完成客戶數據平台商品分析介面',
      ],
      skills: ['Vue','Babylon.js','Three.js']  
    }
  },
  {
    id: '4',
    year: '2022',
    image: "/2022-1.jpg",
    data:  {
      main:'Alpha Camp 全端網路開發(06~12)',
      fulfillment: [
        '完成前端課程',
      ],
      skills: ['JavaScript','React','CSS','Node.js']  
    }
  },
  {
    id: '4',
    year: '2021',
    image: "/2021-1.jpg",
    data:  {
      main:'國合會海外農業技師(2017~2022)',
      fulfillment: [
        '完成尼加拉瓜全國210菜豆輔導戶產量地圖',
        '計畫結束每戶收益平均提升15%'
      ],
      skills: ['Spanish','GIS','Python']  
    },
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
  grid-template-columns: 2fr 400px 1fr;
  gap: 20px;
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
