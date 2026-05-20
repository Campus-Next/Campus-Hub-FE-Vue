<template>
  <div
    :class="['fixed inset-0 flex items-center justify-center transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-100 duration-700' : 'opacity-0']"
  >
    <div
      :class="['absolute inset-0 bg-black transition-all', isExiting ? 'opacity-0 duration-700' : isVisible ? 'opacity-30 duration-700' : 'opacity-0']"
    ></div>

    <div
      ref="bookingRef"
      :class="['relative booking w-[428px] h-[453px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all', isExiting ? 'opacity-0 scale-90 duration-700' : isVisible ? 'opacity-100 scale-100 duration-700' : 'opacity-0 scale-50 duration-700']"
    >
      <template v-if="status === null">
        <div class="confirmation-message flex flex-col items-center">
          <span class="font-medium text-[32px] text-center px-12 py-2">Apakah kamu yakin?</span>
          <p class="font-regular text-[20px] text-center px-10 py-2">
            Kamu akan mengubah password akun ini, klik kembali jika tidak ingin mengubah password akun.
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
            @click="handleUpdate"
            :disabled="isProcessing"
            :class="['bg-transparent border-2 font-medium w-full h-11 my-2 rounded-lg text-[20px] hover:bg-red-300 hover:border-red-500', isProcessing ? 'border-gray-400 text-gray-400' : 'border-[#027FFF] text-black']"
          >
            <div v-if="isProcessing" class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="M22 12a10 10 0 01-10 10"></path>
              </svg>
            </div>
            <span v-else>Ubah Password</span>
          </button>
        </div>
      </template>

      <div v-else-if="status === 'success'" class="flex flex-col items-center animate__animated animate__jackInTheBox">
        <div class="relative p-4 border-4 border-green-600 rounded-full animate-pulse">
          <svg class="h-24 w-24 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span class="mt-4 font-medium text-[20px] text-center">{{ message }}</span>
        <span class="mt-2 text-sm text-center">
          Silahkan login lagi, Anda akan diarahkan ke halaman login dalam {{ counter }} detik.
        </span>
      </div>

      <div v-else-if="status === 'error'" class="flex flex-col items-center animate__animated animate__shakeX">
        <div class="relative p-4 border-4 border-red-600 rounded-full animate-pulse">
          <svg class="h-24 w-24 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <span class="mt-4 font-medium text-[20px] text-center">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { updatePassword } from '../services/api'

interface Props {
  setShowPopUp: (value: boolean) => void
  currentPassword: string
  password: string
  confirmation: string
}

const props = defineProps<Props>()

const bookingRef = ref<HTMLElement | null>(null)
const isExiting = ref(false)
const isProcessing = ref(false)
const isVisible = ref(false)
const status = ref<'success' | 'error' | null>(null)
const counter = ref(5)
const message = ref('')

let counterInterval: ReturnType<typeof setInterval> | null = null

const triggerClose = () => {
  isExiting.value = true
  setTimeout(() => {
    props.setShowPopUp(false)
  }, 700)
}

const handleUpdate = async () => {
  isProcessing.value = true
  try {
    const data = await updatePassword(
      {
        current_password: props.currentPassword,
        password: props.password,
        password_confirmation: props.confirmation,
      },
      localStorage.getItem('token') || '',
    )
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('token_type')
    message.value = data.message || 'Password berhasil diubah'
    status.value = 'success'
  } catch (error: any) {
    message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
    status.value = 'error'
    setTimeout(() => {
      triggerClose()
    }, 2000)
  } finally {
    isProcessing.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (bookingRef.value && !bookingRef.value.contains(event.target as Node)) {
    triggerClose()
  }
}

watch(() => status.value, (newStatus) => {
  if (newStatus === 'success') {
    counterInterval = setInterval(() => {
      counter.value--
      if (counter.value <= 0) {
        if (counterInterval) clearInterval(counterInterval)
        setTimeout(() => {
          window.location.href = '/welcome'
        }, 200)
      }
    }, 1000)
  }
})

onMounted(() => {
  isVisible.value = true
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  if (counterInterval) clearInterval(counterInterval)
})
</script>
