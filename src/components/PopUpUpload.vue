<template>
  <div v-if="isCheckVisible" class="fixed inset-0 flex items-center justify-center" :class="isExiting ? 'animate-overlay-fade-out' : 'animate-overlay-fade-in'">
    <div class="absolute inset-0 bg-black transition-opacity duration-600" :class="isExiting ? 'opacity-0' : 'opacity-50'" />
    
    <div ref="uploadRef" class="relative booking w-[450px] h-[500px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center" :class="isExiting ? 'animate-popup-fade-out' : 'animate-popup-fade-in'">
      <div class="flex justify-center items-center">
        <div class="relative w-32 h-32 flex items-center justify-center rounded-full border-4 transition-all duration-500" :class="isCheckVisible ? 'bg-green-400 border-green-400 animate-bg-expand' : 'bg-transparent border-gray-400'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 28" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 transform transition-all duration-500" :class="isCheckVisible ? 'opacity-100 animate-check-in' : 'opacity-0 scale-0'">
            <path d="M5 16l8 8L28 4" class="checkmark" />
          </svg>
        </div>
      </div>
      <div class="confirmation-message flex flex-col items-center py-4">
        <span class="font-medium text-[32px] text-center justify-center px-8 py-2">
          Acaramu Berhasil Diunggah!
        </span>
        <p class="font-regular text-[20px] text-center py-2 px-8">
          Pantau partisipan acaramu dalam MyEvents untuk melihatnya!
        </p>
      </div>
      <div class="myevent-button">
        <button @click="handleNavigate" class="bg-customBlue font-regular w-full h-11 my-2 rounded-lg font-medium text-white text-[20px]">
          My Events
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCheckVisible = ref(true)
const isExiting = ref(false)
const uploadRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (uploadRef.value && !uploadRef.value.contains(event.target as Node)) {
    triggerClose()
  }
}

const triggerClose = () => {
  isExiting.value = true
  setTimeout(() => {
    isCheckVisible.value = false
  }, 600)
}

const handleNavigate = () => {
  router.push('/my-eventsEO')
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
