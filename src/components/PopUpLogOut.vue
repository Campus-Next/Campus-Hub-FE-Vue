<template>
  <div :class="['popup-container', isExiting ? 'exiting' : '']">
    <div
      v-if="gagal"
      :class="['fixed inset-0 flex items-center justify-center transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-100 duration-700' : 'opacity-0']"
    >
      <div :class="['absolute inset-0 bg-black transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-30 duration-700' : 'opacity-0']"></div>
      <div
        ref="bookingRef"
        :class="['relative booking w-[428px] h-[453px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all', isExiting ? 'opacity-0 scale-90 duration-700' : isVisible ? 'opacity-100 scale-100 duration-700' : 'opacity-0 scale-50 duration-700']"
      >
        <div class="flex flex-col items-center animate__animated animate__shakeX">
          <div class="relative p-4 border-4 border-red-600 rounded-full animate-pulse">
            <svg class="h-24 w-24 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span class="mt-4 font-medium text-[20px] text-center text-red-500">
            {{ data?.message || 'Koneksi Timeout, Silahkan Coba Lagi.' }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-else
      :class="['fixed inset-0 flex items-center justify-center transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-100 duration-700' : 'opacity-0']"
    >
      <div :class="['absolute inset-0 bg-black transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-30 duration-700' : 'opacity-0']"></div>
      <div
        ref="bookingRef"
        :class="['relative booking w-[428px] h-[453px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all', isExiting ? 'opacity-0 scale-90 duration-700' : isVisible ? 'opacity-100 scale-100 duration-700' : 'opacity-0 scale-50 duration-700']"
      >
        <div class="confirmation-message flex flex-col items-center">
          <span class="font-medium text-[32px] text-center px-12 py-2">Apakah kamu yakin?</span>
          <p class="font-regular text-[20px] text-center px-10 py-2">
            Kamu akan logout dari akun ini, klik kembali jika tidak ingin logout.
          </p>
        </div>
        <div class="myevent-button flex flex-col py-2">
          <button
            @click="triggerClose"
            class="bg-[#027FFF] font-regular w-full h-11 my-2 rounded-lg font-medium text-white text-[20px] shadow-md hover:shadow-lg transition duration-300"
          >
            Kembali
          </button>
          <button
            @click="handleLogout"
            :disabled="isProcessing"
            :class="['bg-transparent border-2 font-medium w-full h-11 my-2 rounded-lg text-[20px] hover:bg-red-300 hover:border-red-500', isProcessing ? 'border-gray-400 text-gray-400' : 'border-[#027FFF] text-black']"
          >
            <div v-if="isProcessing" class="flex items-center justify-center">
              <svg class="animate-spin h-7 w-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="M22 12a10 10 0 01-10 10"></path>
              </svg>
            </div>
            <span v-else>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../services/api'
import { clearAuthSession, getToken } from '../utils/authSession'

interface Props {
  setShowPopUp: (value: boolean) => void
}

const props = defineProps<Props>()
const router = useRouter()

const bookingRef = ref<HTMLElement | null>(null)
const isExiting = ref(false)
const isProcessing = ref(false)
const isVisible = ref(false)
const gagal = ref(false)
const data = ref<any>(null)

const triggerClose = () => {
  isExiting.value = true
  setTimeout(() => {
    props.setShowPopUp(false)
  }, 600)
}

const handleLogout = async () => {
  isProcessing.value = true
  try {
    const result = await logout(getToken() || '')
    data.value = result

    clearAuthSession()

    setTimeout(() => {
      router.replace('/')
    }, 200)
  } catch (error) {
    gagal.value = true
  } finally {
    setTimeout(() => {
      isProcessing.value = false
    }, 1000)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (bookingRef.value && !bookingRef.value.contains(event.target as Node)) {
    triggerClose()
  }
}

onMounted(() => {
  isVisible.value = true
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
