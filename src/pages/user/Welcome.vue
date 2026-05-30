<template>
  <div class="flex delay-100 transition-transform animate__animated animate__fadeIn">
    <div class="h-screen w-full flex md:flex-col sm:flex-col lg:flex-row relative">
      <!-- Left Side - Peserta -->
      <div class="h-screen w-full flex flex-col justify-center mx-auto gap-y-[20px] pb-[70px] relative">
        <div class="px-4 mb-16 ml-12 animate__animated animate__fadeInDown animate__delay-1s">
          <h1 class="text-[64px] font-semibold text-[#003266]">
            Selamat Datang!
          </h1>
          <p class="text-[24px] font-medium text-[#003266]">
            Pilihlah peranmu saat ini!
          </p>
        </div>

        <div class="flex flex-col items-center gap-y-[20px] z-10 animate__animated animate__fadeInUp animate__delay-1s">
          <img class="max-w-[440px] max-h-[342px] hover:scale-105 transition-transform duration-300" :src="peserta" alt="Peserta">
          <div class="items-center flex flex-col gap-y-[20px] relative z-10">
            <h1 class="text-[32px] font-semibold text-[#003266]">
              Sebagai peserta
            </h1>
            <RouterLink :to="`/user/login?redirect=${redirectQuery}`">
              <button class="text-white tengah:w-[440px] sm:w-[400px] px-[24px] py-[16px] text-[20px] font-medium bg-[#003266] rounded-[10px] hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300">
                Masuk
              </button>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Right Side - Admin -->
      <div class="bg-[#003266] h-screen w-full flex flex-col items-center justify-center sm:pb-[70px] md:pb-[0px] sm:relative md:relative lg:static animate__animated animate__slideInRight animate__fast">
        <div class="mt-[8rem] relative z-10 flex flex-col items-center gap-y-[20px] animate__animated animate__fadeInUp animate__delay-1s">
          <img :src="admin" alt="Admin" class="max-w-[440px] max-h-[356px] hover:scale-105 transition-transform duration-300">
          <h1 class="text-[32px] font-semibold text-white">
            Sebagai penyelenggara
          </h1>
          <RouterLink :to="`/admin/login?redirect=${redirectQuery}`">
            <button class="text-white bg-[#027FFF] rounded-[10px] tengah:w-[440px] sm:w-[400px] px-[24px] py-[16px] text-[20px] font-medium hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300">
              Masuk
            </button>
          </RouterLink>
        </div>

        <img :src="circle" alt="Circle" class="absolute bottom-0 left-0 sm:hidden tengah:block animate__animated animate__fadeInUp animate__delay-1s">
      </div>

      <img :src="circle2" alt="Circle2" class="max-w-[284px] max-h-[284px] absolute top-0 right-0 sm:hidden tengah:block animate__animated animate__fadeInDown animate__delay-1s">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import peserta from '../../assets/image/newuser.svg'
import circle from '../../assets/image/circle.svg'
import admin from '../../assets/image/newadmin.svg'
import circle2 from '../../assets/image/circle2.svg'
import { clearAuthSession, isAuthenticated, sanitizeRedirectPath } from '../../utils/authSession'

const router = useRouter()
const route = useRoute()

const params = new URLSearchParams(location.search)
const redirectPath = sanitizeRedirectPath(params.get('redirect'))
const redirectQuery = encodeURIComponent(redirectPath)

onMounted(() => {
  if (isAuthenticated()) {
    router.replace('/')
    return
  }
  clearAuthSession()
})
</script>
