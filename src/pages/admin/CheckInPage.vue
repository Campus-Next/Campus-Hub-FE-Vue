<template>
  <div>
    <Navbar />
    <div class="unique-code h-auto mt-12 mx-8 sm:mx-18 lg:mx-32 flex items-center justify-center">
      <div :class="`container w-full sm:w-3/4 lg:w-4/6 h-auto sm:h-11/12 py-2 bg-white shadow-lg rounded-2xl flex flex-col items-center ${fadeClass}`">
        <div class="content-box flex flex-col items-center py-8 sm:px-8 lg:px-12">
          <h1 class="font-semibold text-[26px] sm:text-[34px] lg:text-[42px] text-center">
            Masukkan Kode Tiket
          </h1>
          <p class="font-regular text-[14px] sm:text-[16px] lg:text-[16px] text-center py-4 sm:py-8">
            Masukkan kode unik sebagai bukti pemesanan tiket peserta.
            <br>
            Perhatikan kode dengan baik dan daftarkan peserta terdaftar dalam acara Anda.
          </p>
          
          <div class="unique-code bg-[#027FFF] w-fit flex flex-col mb-4 items-center px-6 py-6 rounded-xl mx-auto">
            <form class="unique-code-output flex gap-2 sm:gap-4 justify-center">
              <input
                v-for="(char, index) in code"
                :id="`input-${index}`"
                :key="index"
                v-model="code[index]"
                type="text"
                maxlength="1"
                class="w-12 h-14 sm:w-16 sm:h-20 lg:w-20 lg:h-24 text-center text-[16px] sm:text-[24px] lg:text-[32px] font-bold border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                @input="(e) => handleInputChange(e, index)"
                @keydown="(e) => handleKeyDown(e, index)"
              >
            </form>
          </div>

          <div class="border-t-2 border-[#003266] w-8/12 my-3 sm:my-6" />
          <button class="bg-[#027FFF] border-2 border-white font-regular w-3/4 sm:w-1/2 lg:w-1/2 h-10 sm:h-11 my-1 sm:my-2 rounded-lg text-medium text-white text-[14px] sm:text-[16px]" @click="handleCheckIn">
            <div v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-7 w-7 text-white-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4" />
                <path class="opacity-75" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" d="M22 12a10 10 0 01-10 10" />
              </svg>
            </div>
            <span v-else>Masuk</span>
          </button>

          <button class="bg-transparent border-2 border-[#027FFF] font-regular w-3/4 sm:w-1/2 lg:w-1/2 h-10 sm:h-11 my-1 sm:my-2 rounded-lg text-medium text-black text-[14px] sm:text-[16px]" @click="handleNavigation">
            Kembali
          </button>
        </div>
      </div>
      <div class="fixed bottom-0 left-0 -z-10">
        <img :src="Ellipse" alt="Background" class="w-[200px] sm:w-[50px] lg:w-[300px]">
      </div>
      <div class="fixed bottom-0 right-0 -z-10">
        <img :src="Ellipse2" alt="Background" class="w-[200px] sm:w-[50px] lg:w-[300px]">
      </div>
      <PopUpBerhasil v-if="showPopup" :is-visible="showPopup" :message="datas" :user="user" @close="showPopup = false" />
      <PopUpGagal v-if="showGagal" :is-visible="showGagal" :message="datas" @close="showGagal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Ellipse from '../../assets/image/Ellipse.svg'
import Ellipse2 from '../../assets/image/Ellipse2.svg'
import Navbar from '../../components/Navbar.vue'
import { checkInParticipant } from '../../services/api'
import PopUpGagal from '../../components/PopUpGagal.vue'
import PopUpBerhasil from '../../components/PopUpBerhasil.vue'
import { useAuthCheck } from '../../composables/useAuthCheck'
import { useCodeInput } from '../../composables/useCodeInput'

const router = useRouter()
const route = useRoute()
const fadeClass = ref('fade-in')
const showPopup = ref(false)
const showGagal = ref(false)
const datas = ref<string | null>(null)
const user = ref<string | null>(null)
const isLoading = ref(false)

useAuthCheck(true)
const { code, handleInputChange, handleKeyDown, resetCode, getCodeString } = useCodeInput()

const handleNavigation = () => {
  fadeClass.value = 'fade-out'
  setTimeout(() => {
    router.push(`/my-events/${route.params.id}/participants`)
  }, 1000)
}

const handleCheckIn = async () => {
  try {
    isLoading.value = true
    const data = await checkInParticipant(route.params.id as string, getCodeString(), localStorage.getItem('token')!)
    datas.value = data.message
    user.value = data.name
    showPopup.value = true
  } catch (error: any) {
    datas.value = error.data || 'Koneksi bermasalah, silahkan coba lagi'
    showGagal.value = true
  } finally {
    resetCode()
    isLoading.value = false
  }
}

onMounted(() => {
  document.getElementById('input-0')?.focus()
})
</script>

