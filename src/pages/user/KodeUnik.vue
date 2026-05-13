<template>
  <div>
    <Navbar />
    
    <div v-if="loading" class="flex items-center justify-center h-screen w-full">
      <div class="loader w-16 h-16 border-4 border-[#027FFF] border-t-transparent rounded-full animate-spin" />
      <p class="ml-4 text-lg font-medium">Loading...</p>
    </div>

    <div v-else class="unique-code h-auto mt-12 mx-8 sm:mx-18 lg:mx-32 flex items-center justify-center">
      <div :class="`container w-full sm:w-3/4 lg:w-4/6 h-auto sm:h-11/12 py-2 bg-white shadow-lg rounded-2xl flex flex-col items-center ${fadeClass}`">
        <div class="content-box flex flex-col items-center py-8 sm:px-8 lg:px-12">
          <h1 class="font-semibold text-[26px] sm:text-[34px] lg:text-[42px] text-center">
            Kode Tiket Anda
          </h1>
          <p class="font-regular text-[14px] sm:text-[16px] lg:text-[16px] text-center py-4 sm:py-8">
            Tunjukkan kode ini kepada panitia saat acara sebagai bukti pemesanan tiket Anda.
            <br>
            Simpan kode dengan baik dan pastikan Anda siap menunjukkannya saat diminta.
          </p>
          
          <div class="unique-code bg-[#027FFF] w-fit flex flex-col mb-4 items-center px-6 py-6 rounded-xl mx-auto">
            <div class="unique-code-output flex gap-2 sm:gap-4 justify-center">
              <input
                v-for="(char, index) in code"
                :key="index"
                type="text"
                maxlength="1"
                :value="char"
                readonly
                class="w-12 h-14 sm:w-16 sm:h-20 lg:w-20 lg:h-24 text-center text-[16px] sm:text-[24px] lg:text-[32px] font-bold border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              >
            </div>
          </div>

          <div class="border-t-2 border-[#003266] w-8/12 my-3 sm:my-6" />
          <button class="bg-transparent border-2 border-[#027FFF] font-regular w-3/4 sm:w-1/2 lg:w-1/2 h-10 sm:h-11 my-1 sm:my-2 rounded-lg text-medium text-black text-[14px] sm:text-[16px]" @click="handleNavigation">
            My Events
          </button>
        </div>
      </div>
      <div class="fixed bottom-0 left-0 -z-10">
        <img :src="Ellipse" alt="Background" class="w-[200px] sm:w-[50px] lg:w-[300px]">
      </div>
      <div class="fixed bottom-0 right-0 -z-10">
        <img :src="Ellipse2" alt="Background" class="w-[200px] sm:w-[50px] lg:w-[300px]">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchUniqueCode } from '../../services/api'
import Ellipse from '../../assets/image/Ellipse.svg'
import Ellipse2 from '../../assets/image/Ellipse2.svg'
import Navbar from '../../components/Navbar.vue'

const router = useRouter()
const route = useRoute()
const code = ref(['', '', '', ''])
const loading = ref(true)
const fadeClass = ref('fade-in')

const loadUniqueCode = async () => {
  try {
    const data = await fetchUniqueCode(route.params.id as string, localStorage.getItem('token')!)
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }

    const uniqueCode = data.kode_unik
    if (uniqueCode && uniqueCode.length === 4) {
      code.value = uniqueCode.split('')
    } else {
      code.value = ['', '', '', '']
    }
  } catch (error) {
    code.value = ['', '', '', '']
  } finally {
    loading.value = false
  }
}

const handleNavigation = () => {
  if (!loading.value) {
    fadeClass.value = 'fade-out'
    setTimeout(() => {
      router.push('/my-events')
    }, 1000)
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/welcome')
    return
  }
  loadUniqueCode()
})
</script>

