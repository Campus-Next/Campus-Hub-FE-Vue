<template>
  <div class="font-sans flex flex-col box-border w-full">
    <Navbar />

    <header class="bg-[#003266] w-full">
      <main class="max-w-7xl mx-auto flex justify-around text-white items-center px-5 py-10">
        <div class="flex flex-col gap-y-[24px] flex-1 pr-12 animate__animated animate__fadeInUp">
          <h1 class="font-bold sm:text-[20px] md:text-[28px] lg:text-[54px] max-w-[640px] w-full tengah:text-[24px] animate__animated animate__fadeInUp animate__delay-1s">
            Wujudkan Potensimu Melalui Pengalaman yang Tak Terbatas!
          </h1>
          <p class="max-w-[550px] font-medium sm:text-[15px] md:text-[23px] tengah:text-[20px] lg:text-[26px] animate__animated animate__fadeInUp animate__delay-1s">
            Kembangkan dirimu sekarang dan raih prestasi luar biasa.
          </p>
          <div class="animate__animated animate__fadeInUp animate__delay-1s">
            <a
              href="#acara"
              @click.prevent="scrollToAcara"
              class="hover:scale-105 transition-all duration-300 max-w-[278px] px-[16px] py-[8px] bg-[#027FFF] rounded-[10px] sm:max-w-[200px] md:max-w-[278px] lg:max-w-[278px] tengah:max-w-[240px] flex justify-center cursor-pointer"
            >
              <p>Pesan</p>
            </a>
          </div>

          <div class="flex gap-x-[20px] sm:gap-x-[15px] sm:max-w-[200px] lg:gap-x-[20px] tengah:max-w-[530px] animate__animated animate__fadeInUp animate__delay-1s">
            <div class="flex flex-col items-center hover:scale-105 transition-transform duration-200">
              <h1 class="font-bold text-[38px] sm:text-[20px] lg:text-[38px] md:text-[38px]">
                {{ isLoading ? '0' : animatedTrendingCount }}
              </h1>
              <p class="font-normal text-[18px] sm:text-[12px] lg:text-[18px] md:text-[18px]">
                Trending Events
              </p>
            </div>

            <div class="flex flex-col items-center hover:scale-105 transition-transform duration-200">
              <h1 class="font-bold text-[38px] sm:text-[20px] lg:text-[38px] md:text-[38px]">
                {{ isLoading ? '0' : animatedCategoryCount }}
              </h1>
              <p class="font-normal text-[18px] sm:text-[12px] lg:text-[18px] md:text-[18px]">
                Kategori Acara
              </p>
            </div>
          </div>
        </div>

        <img
          src="../../assets/image/gambarutama.svg"
          alt="Gambar utama"
          class="relative z-10 w-full sm:w-[200px] md:w-[440px] lg:w-[550px] animate__animated animate__fadeInRight animate__delay-1s"
        />
      </main>
    </header>

    <div v-if="categories.length > 0" class="flex flex-col gap-y-[24px] my-[24px]" id="kategori">
      <h1 v-animate class="flex justify-center items-center font-semibold text-[32px]">Kategori</h1>
      <div v-animate>
        <ul class="flex gap-x-[64px] justify-center flex-wrap">
          <li
            v-for="category in categories"
            :key="category.id"
            class="hover:scale-110 hover:-translate-y-2 transition-transform duration-150"
          >
            <button
              type="button"
              class="flex flex-col items-center gap-2 text-[#003266] font-medium"
              @click="scrollToAcara"
            >
              <div class="w-20 h-20 rounded-full bg-[#EAF4FF] flex items-center justify-center">
                <i class="ri-calendar-event-line text-3xl text-[#027FFF]" />
              </div>
              <span class="text-sm">{{ category.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div
      id="acara"
      class="bg-[#EAF4FF] border-transparent rounded-t-[100px] flex flex-col items-center"
    >
      <h1 v-animate class="font-semibold text-[48px] text-[#003266] mt-[80px] mb-[80px] sm:text-[32px] md:text-[48px]">
        Jelajahi Acara Unggulan
      </h1>

      <div v-animate class="flex flex-wrap justify-center mb-[80px] relative z-10 w-full max-w-7xl">
        <div v-if="isLoading" class="flex items-center justify-center py-20 w-full">
          <div class="loader w-16 h-16 border-4 border-[#027FFF] border-t-transparent rounded-full animate-spin"></div>
          <p class="ml-4 text-lg font-medium">Loading...</p>
        </div>
        <p v-else-if="error" class="text-red-500 py-20">{{ error }}</p>
        <CardPage v-else :events="events" />
      </div>

      <img
        src="../../assets/image/circle6.svg"
        alt="Circle dekorasi"
        v-animate="'animate__animated animate__fadeInLeft'"
        class="absolute left-0 top-[1300px] z-0 pointer-events-none"
      />
    </div>

    <div id="aboutus">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardPage from '../../components/CardPage.vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useCountUp } from '../../composables/useCountUp'
import { computed } from 'vue'
import { useEvents } from '../../composables/useEvents'

const { events, categories, isLoading, error } = useEvents(undefined, { autoLoad: true })

const trendingCount = computed(() => events.value.length)
const categoryCount = computed(() => categories.value.length)

const animatedTrendingCount = useCountUp(trendingCount, 2000)
const animatedCategoryCount = useCountUp(categoryCount, 2000)

const scrollToAcara = () => {
  const element = document.getElementById('acara')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>
