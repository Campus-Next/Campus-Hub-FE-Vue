<template>
  <div class="detail-event h-screen">
    <Navbar />

    <div v-if="error" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <h1 class="text-red-500 text-2xl font-semibold">Error</h1>
        <p class="text-red-700 text-lg">{{ error }}</p>
      </div>
    </div>

    <div
      v-else-if="eventData"
      :class="['detail-event-container [1024px] pt-10 mx-4 lg:mx-20', isLoaded ? 'loaded' : '', isExiting ? 'exiting' : '']"
    >
      <div class="breadcrumb pt-auto flex ml-2 pb-10">
        <ol class="list-none flex text-black text-medium">
          <li><router-link to="/" class="hover:underline">Home</router-link></li>
          <li class="mx-2"> &gt; </li>
          <li>
            <span class="text-gray-500">Event Detail</span>
          </li>
        </ol>
      </div>

      <div class="content-box flex flex-col md:flex-row">
        <div class="PosterEvent w-3/12 h-1/2">
          <img
            class="w-full h-full object-cover rounded-2xl shadow-lg"
            src="https://via.placeholder.com/400x300/027FFF/FFFFFF?text=Event"
            alt="Poster Event"
          />
        </div>

        <div class="description text-left mx-8 mt-4 md:mt-0 md:ml-8 w-6/12">
          <h1 class="font-bold text-[32px] py-4 sm:text-[24px]">
            {{ eventData.title }}
          </h1>
          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <div class="event-details grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div class="detail-item flex items-center gap-3">
              <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                <img src="../../assets/image/date.svg" alt="Calendar" class="w-5 h-5 object-contain" />
              </div>
              <div class="detail-content">
                <p class="text-sm text-gray-500 font-medium">Tanggal</p>
                <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                  {{ new Date(eventData.start_date).toLocaleDateString('id-ID') }}
                </p>
              </div>
            </div>

            <div class="detail-item flex items-center gap-3">
              <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                <img src="../../assets/image/clock.svg" alt="Clock" class="w-5 h-5 object-contain" />
              </div>
              <div class="detail-content">
                <p class="text-sm text-gray-500 font-medium">Waktu</p>
                <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                  {{ new Date(eventData.start_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }} - {{ new Date(eventData.end_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }}
                </p>
              </div>
            </div>

            <div class="detail-item flex items-center gap-3">
              <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                <img src="../../assets/image/location.svg" alt="Location" class="w-5 h-5 object-contain" />
              </div>
              <div class="detail-content">
                <p class="text-sm text-gray-500 font-medium">Lokasi</p>
                <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                  {{ eventData.location }}
                </p>
              </div>
            </div>

            <div class="detail-item flex items-center gap-3">
              <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                <img src="../../assets/image/chair.svg" alt="Capacity" class="w-5 h-5 object-contain" />
              </div>
              <div class="detail-content">
                <p class="text-sm text-gray-500 font-medium">Kapasitas</p>
                <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                  {{ eventData.max_participants }} Kursi
                </p>
              </div>
            </div>
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <div>
            <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full max-w-[486px]">
              {{ eventData.description }}
            </p>
          </div>
        </div>

        <div class="booking w-full md:w-3/12 h-36 px-6 mx-auto bg-white shadow-lg rounded-2xl flex flex-col mt-4 md:mt-0">
          <h1 class="text-left my-4 font-semibold text-[20px] sm:text-[18px] pl-2 lg:text-left sm:text-center">
            Pesan Sekarang!
          </h1>
          <button
            class="bg-[#027FFF] font-regular w-full h-11 my-4 rounded-lg text-medium text-white text-[16px] sm:text-[14px]"
            @click="handleExit"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 -z-10">
      <img src="../../assets/image/Ellipse.svg" alt="Background" class="w-[300px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchEvent } from '../../services/api'
import Navbar from '../../components/Navbar.vue'
import type { Event } from '../../types'

const route = useRoute()
const router = useRouter()

const storage = import.meta.env.VITE_STORAGE_BASE_URL
const eventData = ref<Event | null>(null)
const error = ref<string | null>(null)
const isLoaded = ref(false)
const isExiting = ref(false)

const handleExit = () => {
  isExiting.value = true
  setTimeout(() => {
    router.push(`/events/${eventData.value?.id}/preview`)
  }, 500)
}

onMounted(async () => {
  const id = route.params.id as string
  try {
    const data = await fetchEvent(Number(id))
    eventData.value = data
  } catch (err: any) {
    error.value = err.message
  }

  setTimeout(() => {
    isLoaded.value = true
  }, 500)
})
</script>



