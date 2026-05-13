<template>
  <div class="font-sans flex flex-col box-border w-full">
    <Navbar />
    
    <div v-if="loading" class="flex items-center justify-center h-screen w-full">
      <div class="loader w-16 h-16 border-4 border-[#027FFF] border-t-transparent rounded-full animate-spin" />
      <p class="ml-4 text-lg font-medium text-[#003266]">Memuat acara...</p>
    </div>

    <div v-else class="bg-[#EAF4FF] border-transparent rounded-t-[100px] flex flex-col items-center min-h-screen">
      <h1 class="font-semibold text-[48px] text-[#003266] mt-[80px] sm:text-[32px] md:text-[48px] text-center">
        Jelajahi Event Publik
      </h1>
      <p class="text-[#003266] text-lg max-w-4xl mt-6 mb-12 text-center">
        Temukan berbagai acara menarik yang diadakan di universitas-universitas di Indonesia.
        <br>
        Dari seminar, konferensi, hingga festival budaya, ada banyak hal yang bisa kamu ikuti!
      </p>

      <div class="container mx-auto px-4 pb-8">
        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Gagal memuat acara</h3>
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Events Grid -->
        <div v-if="!error && events.length > 0" class="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-12 max-w-7xl mx-auto">
          <div
            v-for="(event, index) in events"
            :key="index"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex flex-col h-full"
          >
            <div v-if="event.thumbnail" class="h-48 overflow-hidden">
              <img :src="event.image || event.thumbnail" :alt="event.title" class="w-full h-full object-cover" @error="(e) => e.target.style.display = 'none'">
            </div>

            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-[#003266] mb-3 line-clamp-2 min-h-[3.5rem]">
                {{ event.title }}
              </h3>

              <div class="flex items-center text-gray-600 mb-2">
                <svg class="w-5 h-5 mr-2 text-[#027FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">{{ formatDate(event.date) }}</span>
              </div>

              <div class="flex items-start text-gray-600 mb-3">
                <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-[#027FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm line-clamp-2 min-h-[2.5rem]">{{ formatAddress(event.address) }}</span>
              </div>

              <div v-if="event.description" class="mb-4 flex-grow">
                <p class="text-gray-700 text-sm line-clamp-3">{{ event.description }}</p>
              </div>

              <div class="mb-4 h-[3.5rem]">
                <div v-if="event.venue" class="p-3 bg-gray-100 rounded-lg border border-blue-100 h-full flex items-center">
                  <div class="flex items-center justify-between w-full">
                    <span class="font-medium text-[#003266]">{{ event.venue.name }}</span>
                    <div v-if="event.venue.rating" class="flex items-center">
                      <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="text-sm text-gray-600">{{ event.venue.rating }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 mt-auto">
                <a
                  v-if="event.link"
                  :href="event.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 bg-[#027FFF] text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-[#0066CC] transition-all duration-200 transform hover:scale-105"
                >
                  Lihat Acara
                </a>
                <a
                  v-if="event.ticket_info && event.ticket_info.length > 0"
                  :href="event.ticket_info[0].link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  Beli Tiket
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && events.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-[#003266] mb-2">Tidak ada acara ditemukan</h3>
          <p class="text-gray-500">Belum ada acara publik yang tersedia saat ini.</p>
        </div>

        <!-- Pagination -->
        <div v-if="!error && events.length > 0" class="flex justify-center items-center space-x-4">
          <button
            :disabled="currentPage === 0"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105',
              currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#027FFF] text-white hover:bg-[#0066CC]'
            ]"
            @click="handlePageChange(currentPage - 1)"
          >
            Sebelumnya
          </button>
          
          <span class="text-[#003266] font-medium text-lg">{{ currentPage + 1 }}</span>
          
          <button
            :disabled="!hasNextPage"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105',
              !hasNextPage ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#027FFF] text-white hover:bg-[#0066CC]'
            ]"
            @click="handlePageChange(currentPage + 1)"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <div id="aboutus">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'

const events = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(0)
const hasNextPage = ref(false)

const EVENTS_PER_PAGE = 10
const API_KEY = import.meta.env.VITE_SERPAPI_API_KEY

const fetchEvents = async (page = 0) => {
  loading.value = true
  error.value = null
  try {
    const startParam = page * EVENTS_PER_PAGE
    const response = await fetch(
      `/api/serpapi/search.json?engine=google_events&q=University+Event+In+Indonesia&start=${startParam}&api_key=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.events_results) {
      events.value = data.events_results
      hasNextPage.value = data.events_results.length === EVENTS_PER_PAGE
    } else {
      events.value = []
      hasNextPage.value = false
    }
  } catch (err: any) {
    error.value = err.message
    events.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateObj: any) => {
  if (!dateObj) return 'Date TBA'
  return dateObj.when || dateObj.start_date || 'Date TBA'
}

const formatAddress = (address: any) => {
  if (!address || !Array.isArray(address)) return 'Location TBA'
  return address.join(', ')
}

watch(currentPage, (newPage) => {
  fetchEvents(newPage)
})

onMounted(() => {
  fetchEvents(currentPage.value)
})
</script>
