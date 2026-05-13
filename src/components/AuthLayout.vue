<template>
  <div class="flex h-screen relative animate__animated animate__fadeIn overflow-hidden">
    <!-- Left Side - Form -->
    <div class="w-5/12 sm:w-1/2 flex flex-col justify-center items-center text-balance bg-white sm:px-1 animate__animated animate__slideInLeft animate__fast relative z-10">
      <!-- Decorative Circle Bottom Left -->
      <img v-animate="'animate__animated animate__fadeInUp'" :src="circle" alt="Circle" class="absolute w-[250px] h-[250px] bottom-0 left-0 sm:hidden tengah:block z-0 opacity-100 pointer-events-none">
      
      <div v-animate="'animate__animated animate__fadeIn'" class="tengah:mb-3 tengah:mt-2 sm:mb-2 w-full sm:max-w-[320px] lg:max-w-[480px] max-w-[280px] relative z-20">
        <h1 v-animate="'animate__animated animate__fadeInLeft'" class="font-semibold tengah:text-[32px] sm:text-[28px] text-[#003266]">
          {{ title }}
        </h1>
        <p v-if="subtitle" v-animate="'animate__animated animate__fadeInLeft animate__delay-1s'" class="text-[#003266] font-normal text-[15px] mb-3">
          {{ subtitle }}
        </p>
      </div>

      <div v-animate="'animate__animated animate__fadeIn'" class="w-full flex justify-center relative z-20">
        <slot />
      </div>
    </div>

    <!-- Right Side - Logo -->
    <div class="w-7/12 sm:w-1/2 bg-[#003266] flex items-center justify-center animate__animated animate__slideInRight animate__fast relative z-10 overflow-visible">
      <img v-animate="'animate__animated animate__fadeInDown'" :src="circle2" alt="Circle2" class="absolute max-w-[200px] max-h-[200px] top-0 right-0 sm:hidden tengah:block z-[5]">
      <img v-animate="'animate__animated animate__zoomIn'" :src="logo" alt="Logo" class="relative z-20">
    </div>
  </div>
</template>

<script setup lang="ts">
import circle from '../assets/image/circle.svg'
import circle2 from '../assets/image/circle4.svg'
import logo from '../assets/image/logo2.svg'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>
