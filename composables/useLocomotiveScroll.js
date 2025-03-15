import { onMounted, onUnmounted, nextTick } from 'vue';
import LocomotiveScroll from 'locomotive-scroll';

export function useLocoScroll() {
  const containerRef = ref(null);
  const locoScroll = ref(null);

  onMounted(async () => {
    await nextTick(); // 確保 DOM 更新完成
    if (import.meta.client && containerRef.value) {
      locoScroll.value = new LocomotiveScroll({
        el: containerRef.value,
        smooth: true,
      });
    }
  });

  onUnmounted(() => {
    if (locoScroll.value) {
      locoScroll.value.destroy();
      locoScroll.value = null;
    }
  });

  return { containerRef, locoScroll };
}