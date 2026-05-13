<template>
  <div v-if="!isExiting || isVisible" class="fixed inset-0 flex items-center justify-center transition-all" :class="transitionClass">
    <div class="absolute inset-0 bg-black transition-all" :class="overlayClass" />
    
    <div ref="bookingRef" class="relative booking w-[428px] h-[453px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all" :class="popupClass">
      <StatusIcon v-if="gagal" type="error" :message="message || 'Koneksi Timeout, Silahkan Coba Lagi'" />

      <template v-else>
        <div class="confirmation-message flex flex-col items-center">
          <span class="font-medium text-[32px] text-center px-12 py-2">Apakah kamu yakin?</span>
          <p class="font-regular text-[20px] text-center px-10 py-2">
            Kamu akan membatalkan partisipasi dalam mengikuti acara ini, klik kembali jika tidak ingin membatalkan.
          </p>
        </div>
        <div class="myevent-button flex flex-col py-2">
          <button @click="triggerClose" class="bg-[#027FFF] font-regular w-full h-11 my-2 rounded-lg font-medium text-white text-[20px] shadow-md hover:shadow-lg transition duration-300">
            Kembali
          </button>
          <button @click="handleCancelBooking" :disabled="isProcessing" class="bg-transparent border-2 font-medium w-full h-11 my-2 rounded-lg text-[20px] hover:bg-red-300 hover:border-red-500 flex items-center justify-center" :class="isProcessing ? 'border-gray-400 text-gray-400' : 'border-[#027FFF] text-black'">
            <LoadingSpinner v-if="isProcessing" color-class="text-gray-400" />
            <span v-else>Batalkan</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { cancelRegistration } from '../services/api'
import { usePopupAnimation, useClickOutside } from '../composables/usePopup'
import StatusIcon from './StatusIcon.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const bookingRef = ref<HTMLElement | null>(null)
const isProcessing = ref(false)
const gagal = ref(false)
const message = ref('')

const { isExiting, isVisible, transitionClass, overlayClass, popupClass } = usePopupAnimation()

const triggerClose = () => {
  isExiting.value = true
  setTimeout(() => emit('close'), 600)
}

useClickOutside(bookingRef, triggerClose)

const handleCancelBooking = async () => {
  isProcessing.value = true
  const accessToken = localStorage.getItem('token')

  if (!accessToken) {
    console.error('No access token found.')
    isProcessing.value = false
    return
  }

  try {
    await cancelRegistration(route.params.id as string, accessToken)
    window.location.reload()
  } catch (error: any) {
    gagal.value = true
    message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
  } finally {
    isProcessing.value = false
  }
}

</script>
