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
            <router-link :to="categoryLink" class="hover:underline">
              {{ eventData.category_name }}
            </router-link>
          </li>
        </ol>
      </div>

      <div class="content-box flex flex-col md:flex-row">
        <div class="PosterEvent w-3/12 h-1/2">
          <img
            class="w-full h-full object-cover rounded-2xl shadow-lg"
            :src="`${storage}/${eventData.foto_event}`"
            alt="Poster Event"
          />
        </div>

        <div class="description text-left mx-8 mt-4 md:mt-0 md:ml-8 w-6/12">
          <span class="bg-[#027FFF] font-regular px-8 py-1 rounded-full text-white text-[14px] sm:text-[12px]">
            {{ eventData.category_name }}
          </span>
          <h1 class="font-bold text-[32px] py-4 sm:text-[24px]">
            {{ eventData.judul }}
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
                  {{ eventData.date }}
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
                  {{ eventData.start_time }} - {{ eventData.end_time }}
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
                  {{ eventData.tempat }}
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
                  {{ eventData.available_slot }} Kursi Tersedia
                </p>
              </div>
            </div>
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <div class="lecturer flex gap-2 ml-2 w-auto">
            <img
              :src="`${storage}/${eventData.foto_pembicara}`"
              alt="Profile"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div class="lecturername flex flex-col ml-4 gap-2 justify-center">
              <span class="font-semibold text-[16px] sm:text-[14px]">
                {{ eventData.pembicara }}
              </span>
              <span class="text-regular text-[14px] sm:text-[12px]">
                {{ eventData.role }}
              </span>
            </div>
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <div>
            <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full max-w-[486px]">
              {{ eventData.deskripsi }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchEvent } from '../../services/api'
import Navbar from '../../components/Navbar.vue'

interface EventData {
  id: number
  category_name: string
  judul: string
  foto_event: string
  date: string
  start_time: string
  end_time: string
  tempat: string
  available_slot: number
  foto_pembicara: string
  pembicara: string
  role: string
  deskripsi: string
}

const route = useRoute()
const router = useRouter()

const storage = import.meta.env.VITE_STORAGE_BASE_URL
const eventData = ref<EventData | null>(null)
const error = ref<string | null>(null)
const isLoaded = ref(false)
const isExiting = ref(false)

const categoryLink = computed(() => {
  if (!eventData.value) return '/home'
  const category = eventData.value.category_name
  const links: Record<string, string> = {
    'Seminar': '/seminar',
    'Webinar': '/webinar',
    'Kuliah Tamu': '/kuliah-tamu',
    'Sertifikasi': '/sertifikasi',
    'Workshop': '/workshop'
  }
  return links[category] || '/home'
})

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



