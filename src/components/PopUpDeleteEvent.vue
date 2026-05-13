<template>
  <div class="fixed inset-0 flex items-center justify-center transition-all" :class="transitionClass">
    <div class="absolute inset-0 bg-black transition-all" :class="overlayClass" />
    
    <div ref="bookingRef" class="relative booking w-[428px] h-[453px] px-6 py-6 mx-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center gap-4 transition-all" :class="popupClass">
      <template v-if="status === null">
        <div class="confirmation-message flex flex-col items-center">
          <span class="font-medium text-[32px] text-center px-12 py-2">Apakah kamu yakin?</span>
          <p class="font-regular text-[20px] text-center px-10 py-2">
            Kamu akan menghapus seluruh data terkait event ini, klik kembali jika kamu berubah pikiran.
          </p>
        </div>
        <div class="myevent-button flex flex-col py-2">
          <button @click="triggerClose" class="bg-[#027FFF] font-regular w-full h-11 my-2 rounded-lg font-medium text-white text-[20px] shadow-md hover:shadow-lg transition duration-300">
            Kembali
          </button>
          <button @click="handleUpdate" :disabled="isProcessing" class="bg-transparent border-2 font-medium w-full h-11 my-2 rounded-lg text-[20px] hover:bg-red-300 hover:border-red-500 flex items-center justify-center" :class="isProcessing ? 'border-gray-400 text-gray-400' : 'border-[#027FFF] text-black'">
            <LoadingSpinner v-if="isProcessing" color-class="text-gray-500" />
            <span v-else>Hapus Event</span>
          </button>
        </div>
      </template>

      <StatusIcon v-else-if="status === 'success'" type="success" :message="message" />
      <StatusIcon v-else-if="status === 'error'" type="error" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { deleteEvent } from '../services/api'
import { usePopupAnimation, useClickOutside } from '../composables/usePopup'
import StatusIcon from './StatusIcon.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  success: []
  back: []
  failure: []
}>()

const bookingRef = ref<HTMLElement | null>(null)
const isProcessing = ref(false)
const status = ref<'success' | 'error' | null>(null)
const localId = ref<string | null>(null)
const message = ref('')

const { isExiting, transitionClass, overlayClass, popupClass } = usePopupAnimation()

watch(() => props.id, (newId) => {
  localId.value = newId
}, { immediate: true })

const triggerClose = () => {
  isExiting.value = true
  setTimeout(() => emit('back'), 400)
}

useClickOutside(bookingRef, triggerClose)

const handleUpdate = async () => {
  const currentId = localId.value
  isProcessing.value = true
  try {
    const data = await deleteEvent(currentId!, localStorage.getItem('token')!)
    message.value = data.message
    status.value = 'success'

    setTimeout(() => {
      isExiting.value = true
    }, 1800)

    setTimeout(() => {
      emit('success')
    }, 2200)
  } catch (error: any) {
    status.value = 'error'
    message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'

    setTimeout(() => {
      isExiting.value = true
    }, 1800)

    setTimeout(() => {
      emit('failure')
    }, 2200)
  } finally {
    isProcessing.value = false
  }
}

</script>
