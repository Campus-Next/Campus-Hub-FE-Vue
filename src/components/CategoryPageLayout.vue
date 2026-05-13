<template>
  <div class="font-sans flex flex-col box-border w-full animate__animated animate__fadeIn">
    <Navbar />

    <div class="font-sans flex flex-col box-border mx-auto w-full">
      <div class="bg-[#EAF4FF] border-transparent rounded-t-[100px] flex flex-col items-center justify-center">
        <h1 v-animate="'animate__animated animate__fadeInDown'" class="font-semibold text-[#003266] mt-[80px] mb-[80px] flex sm:text-[32px] md:text-[48px]">
          {{ title }}
        </h1>
        <div v-animate="'animate__animated animate__fadeInUp'" class="flex flex-wrap justify-center mb-[80px] w-full max-w-7xl">
          <div v-if="isLoading" class="flex items-center justify-center py-20 w-full">
            <div class="loader w-16 h-16 border-4 border-[#027FFF] border-t-transparent rounded-full animate-spin" />
            <p class="ml-4 text-lg font-medium">Loading...</p>
          </div>
          <p v-else-if="error" class="text-red-500 py-20">{{ error }}</p>
          <CardPage v-else :events="events" />
          <div class="relative w-full">
            <img v-animate="'animate__animated animate__fadeInLeft'" :src="circle6" alt="Circle dekorasi" class="absolute left-0 top-[1300px] pointer-events-none">
          </div>
        </div>
      </div>
    </div>
    <div id="aboutus">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import CardPage from './CardPage.vue'
import circle6 from '../assets/image/circle6.svg'

defineProps<{
  title: string
  isLoading: boolean
  events: any[]
  error: string | null
}>()
</script>
