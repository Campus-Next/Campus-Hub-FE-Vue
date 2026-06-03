import { ref, watch, unref, type Ref } from 'vue'

export function   useCountUp(
  targetValue: Ref<number> | number,
  durationMs: number = 2000
) {
  const currentCount = ref(0)
  
  watch(
    () => unref(targetValue),
    (newVal) => {
      if (newVal === 0) {
        currentCount.value = 0
        return
      }
      
      const startValue = currentCount.value
      const startTime = performance.now()
      
      const updateCounter = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / durationMs, 1)
        
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4)
        
        currentCount.value = Math.floor(startValue + (newVal - startValue) * easeOut)
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        } else {
          currentCount.value = newVal
        }
      }
      
      requestAnimationFrame(updateCounter)
    },
    { immediate: true }
  )

  return currentCount
}
