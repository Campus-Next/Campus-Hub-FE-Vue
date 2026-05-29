<template>
  <div
    v-if="isVisible || isEntering || isExiting"
    :class="[
      'fixed inset-0 z-50 flex items-center justify-center transition-all',
      isExiting ? 'opacity-0 duration-700 pointer-events-none' : isEntering ? 'opacity-100 duration-700' : 'opacity-0 pointer-events-none'
    ]"
  >
    <div
      :class="[
        'absolute inset-0 bg-black transition-all',
        isExiting ? 'opacity-0 duration-700' : isEntering ? 'opacity-30 duration-700' : 'opacity-0'
      ]"
      @click="handleClose"
    />

    <div
      :class="[
        'relative booking w-[397px] h-[437px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all',
        isExiting ? 'opacity-0 scale-90 duration-700' : isEntering ? 'opacity-100 scale-100 duration-700' : 'opacity-0 scale-50 duration-700'
      ]"
    >
      <div class="unique-code-output flex justify-center items-center">
        <div
          :class="[
            'relative w-32 h-32 flex items-center justify-center rounded-full border-4 transition-all duration-500',
            isEntering ? `${styles.bg} ${styles.border} animate-bg-expand` : 'bg-transparent border-gray-400'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            stroke="white"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="[
              'w-16 h-16 transform transition-all duration-500',
              isEntering ? 'opacity-100 animate-check-in' : 'opacity-0 scale-0'
            ]"
          >
            <path v-if="type === 'success'" d="M5 16l8 8L28 4" />
            <template v-else>
              <line x1="8" y1="8" x2="24" y2="24" />
              <line x1="24" y1="8" x2="8" y2="24" />
            </template>
          </svg>
        </div>
      </div>
      <div class="confirmation-message flex flex-col items-center py-4">
        <span :class="['font-medium text-[24px] text-center justify-center py-2', styles.text]">
          {{ message }}
        </span>
        <span v-if="user" class="font-medium text-[24px] text-center justify-center py-2">
          {{ user }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

interface Props {
  isVisible: boolean
  message: string
  user?: string
  type?: 'success' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success'
})

const emit = defineEmits<{
  close: []
}>()

const isEntering = ref(false)
const isExiting = ref(false)
let enterTimer: ReturnType<typeof setTimeout> | null = null
let exitTimer: ReturnType<typeof setTimeout> | null = null

const styles = computed(() => {
  if (props.type === 'success') {
    return {
      bg: 'bg-green-400',
      border: 'border-green-400',
      text: 'text-green-500'
    }
  }
  return {
    bg: 'bg-red-400',
    border: 'border-red-400',
    text: 'text-red-500'
  }
})

const handleClose = () => {
  isExiting.value = true
  setTimeout(() => {
    isEntering.value = false
    isExiting.value = false
    emit('close')
  }, 700)
}

watch(() => props.isVisible, (newVal) => {
  if (enterTimer) clearTimeout(enterTimer)
  if (exitTimer) clearTimeout(exitTimer)

  if (newVal) {
    isEntering.value = false
    isExiting.value = false
    enterTimer = setTimeout(() => {
      isEntering.value = true
    }, 10)
    exitTimer = setTimeout(() => {
      handleClose()
    }, 2000)
  }
}, { immediate: true })

onUnmounted(() => {
  if (enterTimer) clearTimeout(enterTimer)
  if (exitTimer) clearTimeout(exitTimer)
})
</script>
