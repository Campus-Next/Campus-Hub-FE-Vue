<template>
  <div class="detail-event min-h-screen relative overflow-hidden">
    <Navbar />

    <div v-if="error" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <h1 class="text-red-500 text-2xl font-semibold">Error</h1>
        <p class="text-red-700 text-lg">{{ error }}</p>
      </div>
    </div>

    <div
      v-else-if="eventData"
      :class="['detail-event-container pt-10 mx-4 lg:mx-20', isLoaded ? 'loaded' : '', isExiting ? 'exiting' : '']"
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

      <div class="content-box flex flex-col lg:flex-row items-start gap-8">
        <div class="PosterEvent w-full max-w-[416px] mx-auto lg:mx-0 lg:w-[30%] xl:w-[27%] aspect-[21/25] flex-shrink-0 lg:mt-1">
          <img
            class="w-full h-full object-cover rounded-2xl shadow-lg"
            :src="getEventImageUrl(eventData)"
            alt="Poster Event"
          />
        </div>

        <div class="description text-left mt-4 lg:mt-0 flex-1 min-w-0">
          <h1 class="font-bold text-[34px] pt-0 pb-2 sm:text-[26px]">
            {{ eventData.title }}
          </h1>
          <div class="border-b-2 border-[#003266] w-full mt-1 mb-4"></div>

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
                <p class="text-sm text-gray-500 font-medium">Kapasitas Tersisa</p>
                <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                  {{ capacityText }}
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

          <div v-if="eventData.event_links && eventData.event_links.length > 0" class="mt-6 w-full">
            <h2 class="font-semibold text-[18px] text-[#003266] mb-3">Link Acara</h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full items-stretch">
              <li v-for="link in eventData.event_links" :key="link.id" class="min-w-0 h-full">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="link.title"
                  class="flex h-full min-h-[68px] min-w-0 items-center gap-3 p-3 rounded-lg border border-[#027FFF] bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <i class="ri-external-link-line text-[#027FFF] text-xl flex-shrink-0"></i>
                  <span class="event-link-title min-w-0 font-medium text-[#003266] text-[14px]">{{ link.title }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="booking w-full sm:w-fit lg:w-[260px] px-4 py-5 bg-white shadow-lg rounded-2xl flex flex-col mt-4 lg:mt-0 gap-4 flex-shrink-0">
          <h1 class="text-left font-semibold text-[18px]">
            Pendaftaran Event
          </h1>
          <p v-if="isCancelled" class="text-sm text-left text-red-600 font-medium">
            Pendaftaran sebelumnya telah dibatalkan. Kamu masih bisa daftar ulang jika tersedia.
          </p>
          <p v-if="feedback" :class="['text-sm text-center', feedbackError ? 'text-red-600 font-medium' : 'text-green-600 font-medium']">{{ feedback }}</p>
          
          <button
            v-if="isRegistered"
            type="button"
            class="bg-green-600 hover:bg-green-700 font-medium w-full h-11 rounded-lg text-white text-[16px] transition-colors"
            @click="viewTicket"
          >
            Lihat Tiket (Terdaftar)
          </button>
          <button
            v-else-if="hasStatusDetail"
            type="button"
            class="bg-[#027FFF] hover:bg-[#0066CC] font-medium w-full h-11 rounded-lg text-white text-[16px] transition-colors"
            @click="viewTicket"
          >
            {{ statusDetailLabel }}
          </button>
          <button
            v-else-if="isFull"
            type="button"
            class="bg-[#A2A2A2] cursor-not-allowed font-medium w-full h-11 rounded-lg text-white text-[16px]"
            disabled
          >
            Kapasitas Penuh
          </button>
          <button
            v-else-if="registrationMessage"
            type="button"
            class="bg-[#A2A2A2] cursor-not-allowed font-medium w-full min-h-11 rounded-lg text-white text-[15px] px-3 py-2"
            disabled
          >
            {{ registrationMessage }}
          </button>
          <template v-else>
            <button
              type="button"
              class="bg-[#027FFF] hover:bg-[#0066CC] disabled:bg-[#A2A2A2] disabled:cursor-not-allowed font-medium w-full h-11 rounded-lg text-white text-[16px] transition-colors"
              :disabled="isAdding"
              @click="handleAddToCart"
            >
              {{ isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang' }}
            </button>
            <button
              type="button"
              class="bg-white border-2 border-[#027FFF] hover:bg-[#EAF4FF] font-medium w-full h-11 rounded-lg text-[#027FFF] text-[16px] transition-colors"
              :disabled="isRegistering"
              @click="handleRegister"
            >
              {{ isRegistering ? 'Mendaftar...' : 'Daftar Sekarang' }}
            </button>
          </template>
          <button
            v-if="isCancelled"
            type="button"
            class="bg-white border-2 border-red-400 hover:bg-red-50 font-medium w-full h-11 rounded-lg text-red-600 text-[15px] transition-colors"
            @click="viewTicket"
          >
            Lihat Riwayat Pembatalan
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 -z-10">
      <img src="../../assets/image/Ellipse.svg" alt="Background" class="w-[300px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchEvent, enrollEvent, fetchUniqueCode } from '../../services/api'
import { useAuth } from '../../composables/useAuth'
import { useCart } from '../../composables/useCart'
import Navbar from '../../components/Navbar.vue'
import { getEventImageUrl } from '../../utils/helpers'
import { isAuthenticated } from '../../utils/authSession'
import type { Event, ParticipantStatus } from '../../types'

const route = useRoute()
const router = useRouter()
const { getToken } = useAuth()
const { add } = useCart()

const eventData = ref<Event | null>(null)
const isAdding = ref(false)
const error = ref<string | null>(null)
const isLoaded = ref(false)
const isExiting = ref(false)
const isRegistering = ref(false)
const participantStatus = ref<ParticipantStatus | null>(null)
const feedback = ref('')
const feedbackError = ref(false)

const ensureAuth = (): boolean => {
  if (isAuthenticated()) return true
  router.push(`/user/login?redirect=${encodeURIComponent(route.fullPath)}`)
  return false
}

const remainingSlots = computed(() => {
  if (!eventData.value) return 0
  if (!eventData.value.max_participants || eventData.value.max_participants <= 0) return Number.POSITIVE_INFINITY
  const registered = eventData.value.participants_count ?? 0
  return Math.max(0, eventData.value.max_participants - registered)
})

const isFull = computed(() =>
  !!eventData.value?.max_participants && eventData.value.max_participants > 0 && remainingSlots.value <= 0,
)

const capacityText = computed(() => {
  if (!eventData.value?.max_participants || eventData.value.max_participants <= 0) return 'Tidak terbatas'
  return `${remainingSlots.value} / ${eventData.value.max_participants} Kursi`
})

const isRegistered = computed(() => participantStatus.value === 'registered')
const isCancelled = computed(() => participantStatus.value === 'cancelled')
const hasStatusDetail = computed(() => participantStatus.value === 'attended' || participantStatus.value === 'absent')
const statusDetailLabel = computed(() => participantStatus.value === 'attended' ? 'Lihat Status Kehadiran' : 'Lihat Detail Status')

const registrationMessage = computed(() => {
  if (!eventData.value) return ''
  const now = new Date()
  if (eventData.value.registration_open && now < new Date(eventData.value.registration_open)) {
    return 'Pendaftaran Belum Dibuka'
  }
  if (eventData.value.registration_deadline) {
    const deadline = new Date(eventData.value.registration_deadline)
    deadline.setHours(23, 59, 59, 999)
    if (now > deadline) return 'Pendaftaran Ditutup'
  }
  return ''
})

const viewTicket = () => {
  if (eventData.value) {
    router.push(`/my-events/${eventData.value.id}/view`)
  }
}

const handleRegister = async () => {
  if (!eventData.value || !ensureAuth()) return
  isRegistering.value = true
  feedback.value = ''
  const previousStatus = participantStatus.value
  try {
    const token = getToken()
    if (!token) return
    await enrollEvent(eventData.value.id, token)
    feedbackError.value = false
    feedback.value = 'Pendaftaran berhasil!'
    participantStatus.value = 'registered'
    if (previousStatus !== 'registered' && previousStatus !== 'attended' && eventData.value.participants_count !== undefined) {
      eventData.value.participants_count++
    } else if (eventData.value.participants_count === undefined) {
      eventData.value.participants_count = 1
    }
    setTimeout(() => {
      router.push(`/my-events/${eventData.value?.id}/view`)
    }, 1500)
  } catch (err: any) {
    feedbackError.value = true
    feedback.value = err?.data || err?.message || 'Gagal mendaftar ke acara.'
  } finally {
    isRegistering.value = false
  }
}

const handleAddToCart = async () => {
  if (!eventData.value || !ensureAuth()) return
  isAdding.value = true
  feedback.value = ''
  try {
    await add(eventData.value.id)
    feedbackError.value = false
    feedback.value = 'Acara ditambahkan ke keranjang.'
  } catch (err: any) {
    feedbackError.value = true
    feedback.value = err?.data || err?.message || 'Gagal menambahkan ke keranjang.'
  } finally {
    isAdding.value = false
  }
}

const checkEnrollment = async () => {
  const token = getToken()
  if (!token || !eventData.value) return
  try {
    const res = await fetchUniqueCode(eventData.value.id, token)
    if (res?.status) {
      participantStatus.value = res.status
    }
  } catch (err) {
    participantStatus.value = null
  }
}

onMounted(async () => {
  const id = route.params.id as string
  try {
    const data = await fetchEvent(Number(id))
    eventData.value = data
    await checkEnrollment()
  } catch (err: any) {
    error.value = err.message
  }

  setTimeout(() => {
    isLoaded.value = true
  }, 500)
})
</script>

<style scoped>
.event-link-title {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>



