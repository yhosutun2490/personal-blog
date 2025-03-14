import { onMounted, onUnmounted } from 'vue';
import LocomotiveScroll from 'locomotive-scroll';

export function useLocoScroll() {
  const containerRef = ref(null);
  let locoScroll = null;

  onMounted(() => {
    if (import.meta.client && containerRef.value) {
      locoScroll = new LocomotiveScroll({
        el: containerRef.value,
        smooth: true,
      });
    }
  });

  onUnmounted(() => {
    if (locoScroll) {
      locoScroll.destroy();
      locoScroll = null;
    }
  });

  return { containerRef, locoScroll };
}