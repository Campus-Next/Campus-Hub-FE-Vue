import { ref, computed, onMounted, onUnmounted } from 'vue'

export function usePopupAnimation() {
  const isExiting = ref(false)
  const isVisible = ref(false)

  const transitionClass = computed(() => 
    isExiting.value ? 'opacity-0 duration-700' : isVisible.value ? 'opacity-100 duration-700' : 'opacity-0'
  )

  const overlayClass = computed(() => 
    isExiting.value ? 'opacity-0 duration-700' : isVisible.value ? 'opacity-30 duration-700' : 'opacity-0'
  )

  const popupClass = computed(() => 
    isExiting.value ? 'opacity-0 scale-90 duration-700' : isVisible.value ? 'opacity-100 scale-100 duration-700' : 'opacity-0 scale-50 duration-700'
  )

  onMounted(() => {
    isVisible.value = true
  })

  return {
    isExiting,
    isVisible,
    transitionClass,
    overlayClass,
    popupClass
  }
}

export function useClickOutside(elementRef: any, callback: () => void) {
  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  return { handleClickOutside }
}
