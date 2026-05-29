<template>
  <div class="detail-event min-h-screen relative overflow-hidden">
    <Navbar />

    <LoadingSpinner v-if="loading" fullScreen />
    <ErrorMessage v-else-if="pageError" :message="pageError" />

    <div v-else-if="eventData" :class="['detail-event-container pt-10 mx-4 lg:mx-20', pageAnimation]">
      <div class="breadcrumb pt-auto flex ml-2 pb-10">
        <ol class="list-none flex text-black text-medium">
          <li><router-link to="/my-events" class="hover:underline">MyEvents</router-link></li>
          <li class="mx-2"> &gt; </li>
          <li>
            <router-link to="/my-events" :state="{ activeTab: statusConfig.breadcrumb }">
              {{ statusConfig.breadcrumb }}
            </router-link>
          </li>
        </ol>
      </div>

      <div class="content-box flex flex-col lg:flex-row items-start gap-8">
        <div class="PosterEvent w-full max-w-[416px] mx-auto lg:mx-0 lg:w-[30%] xl:w-[27%] aspect-[21/25] flex-shrink-0 lg:mt-1">
          <img
            class="w-full h-full object-cover rounded-2xl shadow-lg"
            :src="getEventImageUrl(eventData)"
            alt="Poster Event"
          >
        </div>

        <div class="description text-left mt-4 lg:mt-0 flex-1 min-w-0">
          <h1 class="font-bold text-[34px] pt-0 pb-2 sm:text-[26px]">{{ eventData.title }}</h1>
          <div class="border-b-2 border-[#003266] w-full mt-1 mb-4" />

          <div class="event-details grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <EventDetailItem icon="date.svg" label="Tanggal" :value="new Date(eventData.start_date).toLocaleDateString('id-ID')" />
            <EventDetailItem icon="clock.svg" label="Waktu" :value="`${new Date(eventData.start_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })} - ${new Date(eventData.end_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })}`" />
            <EventDetailItem icon="location.svg" label="Lokasi" :value="eventData.location" />
            <EventDetailItem icon="chair.svg" label="Kapasitas" :value="capacityText" />
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4" />

          <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full max-w-[486px]">
            {{ eventData.description }}
          </p>

          <div v-if="eventData.event_links && eventData.event_links.length > 0" class="event-links mt-6">
            <h3 class="font-semibold text-[18px] mb-3 text-[#003266]">Tautan Acara</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-[486px] items-stretch">
              <li v-for="link in eventData.event_links" :key="link.id" class="min-w-0 h-full">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="link.title"
                  class="flex h-full min-h-[68px] min-w-0 items-center gap-3 p-3 rounded-lg border border-[#027FFF] bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <i class="ri-external-link-line text-[#027FFF] text-xl flex-shrink-0" />
                  <span class="event-link-title min-w-0 font-medium text-[#003266] text-[14px]">{{ link.title }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="booking w-full sm:w-fit lg:w-[260px] px-4 py-5 bg-white shadow-lg rounded-2xl flex flex-col mt-4 lg:mt-0 gap-4 flex-shrink-0">
          <div class="status-section">
            <div
              v-if="currentStatus === 'registered'"
              class="bg-[#027FFF] rounded-xl shadow-md px-4 py-5 text-white"
            >
              <div v-if="code.length === 4" class="flex gap-2 justify-center">
                <input
                  v-for="(char, index) in code"
                  :key="index"
                  type="text"
                  maxlength="1"
                  :value="char"
                  readonly
                  class="w-10 h-12 text-center text-[24px] font-bold border border-gray-300 rounded-lg bg-white text-[#003266] focus:outline-none"
                >
              </div>
              <p v-else class="text-sm text-center text-blue-50">Memuat kode tiket...</p>
            </div>

            <div v-else :class="['status-display p-4 rounded-xl shadow-md', statusConfig.gradientClass]">
              <div class="status-icon-container flex justify-center">
                <div
                  :class="[
                    'relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full border-4 transition-all duration-1000',
                    isIconVisible ? 'bg-white border-white' : `bg-transparent ${statusConfig.borderClass}`,
                  ]"
                >
                  <component
                    :is="statusConfig.icon"
                    :class="[
                      'w-8 h-8 lg:w-10 lg:h-10 transform transition-all duration-1000',
                      statusConfig.iconColor,
                      isIconVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="confirmation-message flex flex-col items-center py-4 border-b border-gray-200">
            <div :class="['status-badge px-4 py-2 rounded-full mb-4', statusConfig.badgeClass]">
              <span class="font-semibold text-[14px] lg:text-[16px]">
                {{ statusConfig.badgeText }}
              </span>
            </div>
            <p class="font-regular text-[12px] lg:text-[14px] text-center text-gray-600 max-w-xs leading-relaxed">
              {{ statusConfig.message }}
            </p>
          </div>

          <div class="checkout flex flex-col pt-1">
            <button
              class="bg-[#027FFF] hover:bg-[#0066CC] font-medium w-full h-11 mb-3 rounded-lg text-white text-[14px] lg:text-[16px] transition-colors shadow-sm"
              @click="handleBack"
            >
              Kembali
            </button>
            <button
              v-if="showCancelButton"
              class="bg-transparent border-2 border-red-400 hover:bg-red-50 hover:border-red-500 font-medium w-full h-11 rounded-lg text-red-600 text-[14px] lg:text-[16px] transition-colors"
              @click="showPopUp = true"
            >
              Batalkan Pendaftaran
            </button>
          </div>
        </div>
      </div>
    </div>

    <PopUpCancel v-if="showPopUp" @close="showPopUp = false" @cancelled="handleCancelled" />

    <div class="absolute bottom-0 left-0 -z-10">
      <img src="../assets/image/Ellipse.svg" alt="Background" class="w-40 lg:w-[300px]">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useEventDetail } from '../composables/useEventDetail'
import { fetchUniqueCode } from '../services/api'
import Navbar from './Navbar.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'
import EventDetailItem from './EventDetailItem.vue'
import PopUpCancel from './PopUpCancel.vue'
import { getEventImageUrl } from '../utils/helpers'
import type { EventParticipant, ParticipantStatus } from '../types'

interface Props {
  status: ParticipantStatus
}

interface StatusConfig {
  breadcrumb: string
  gradientClass: string
  borderClass: string
  badgeClass: string
  badgeText: string
  message: string
  icon: any
  iconColor: string
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const { getToken, requireAuth } = useAuth()
const { eventData, error, loadEvent } = useEventDetail()

const loading = ref(true)
const pageError = ref<string | null>(null)
const code = ref<string[]>([])
const showPopUp = ref(false)
const pageAnimation = ref('page-enter')
const isIconVisible = ref(false)
const currentStatus = ref<ParticipantStatus>(props.status)

const CheckIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '3',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [h('path', { d: 'M5 13l4 4L19 7' })])

const CrossIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '3',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [h('path', { d: 'M6 18L18 6M6 6l12 12' })])

const statusConfig = computed<StatusConfig>(() => {
  const configs: Record<ParticipantStatus, StatusConfig> = {
    registered: {
      breadcrumb: 'Registered',
      gradientClass: 'bg-gradient-to-r from-[#027FFF] to-[#0066CC]',
      borderClass: 'border-gray-100',
      badgeClass: 'bg-green-100 text-green-800',
      badgeText: 'Terdaftar',
      message: 'Tunjukkan kode unik ini kepada panitia atau narahubung terkait saat check-in acara.',
      icon: CheckIcon,
      iconColor: 'text-gray-800',
    },
    attended: {
      breadcrumb: 'Attended',
      gradientClass: 'bg-gradient-to-r from-green-500 to-green-600',
      borderClass: 'border-green-200',
      badgeClass: 'bg-green-100 text-green-800',
      badgeText: 'Telah Hadir',
      message: 'Selamat, Anda telah mengikuti event ini. Silakan jelajahi event lainnya.',
      icon: CheckIcon,
      iconColor: 'text-green-500',
    },
    absent: {
      breadcrumb: 'Absent',
      gradientClass: 'bg-gradient-to-r from-gray-500 to-gray-600',
      borderClass: 'border-gray-200',
      badgeClass: 'bg-gray-100 text-gray-800',
      badgeText: 'Tidak Hadir',
      message: 'Acara ini telah berlangsung dan Anda tidak hadir. Silakan cek event lainnya.',
      icon: CrossIcon,
      iconColor: 'text-gray-500',
    },
    cancelled: {
      breadcrumb: 'Cancelled',
      gradientClass: 'bg-gradient-to-r from-red-500 to-red-600',
      borderClass: 'border-red-200',
      badgeClass: 'bg-red-100 text-red-800',
      badgeText: 'Dibatalkan',
      message: 'Pendaftaran event ini telah dibatalkan. Jika pendaftaran masih dibuka, Anda dapat daftar ulang dari halaman detail event.',
      icon: CrossIcon,
      iconColor: 'text-red-500',
    },
  }

  return configs[currentStatus.value]
})

const capacityText = computed(() => {
  if (!eventData.value?.max_participants || eventData.value.max_participants <= 0) return 'Tidak terbatas'
  return `${eventData.value.max_participants} Kursi`
})

const showCancelButton = computed(() => currentStatus.value === 'registered')

const syncTicketCode = async (eventId: string, token: string) => {
  const codeData = await fetchUniqueCode(eventId, token)
  currentStatus.value = codeData.status
  code.value = codeData.status === 'registered' && codeData.unique_code
    ? codeData.unique_code.split('')
    : []
}

const handleBack = () => {
  pageAnimation.value = 'page-exit'
  setTimeout(() => router.push('/my-events'), 400)
}

const handleCancelled = (participant: EventParticipant) => {
  currentStatus.value = participant.status
  code.value = []
  isIconVisible.value = true
}

watch(
  () => props.status,
  (status) => {
    currentStatus.value = status
  },
)

onMounted(async () => {
  if (!requireAuth()) return

  const eventId = route.params.id as string
  const token = getToken()

  try {
    await loadEvent(eventId)
    if (error.value) {
      pageError.value = error.value
      return
    }

    if (currentStatus.value === 'registered' && token) {
      await syncTicketCode(eventId, token)
    }
  } catch (err: any) {
    pageError.value = err.message
  } finally {
    loading.value = false
  }

  setTimeout(() => {
    isIconVisible.value = true
  }, 1000)
})
</script>

<style scoped>
.page-exit {
  animation: fadeOut 0.4s ease-out;
}

.event-link-title {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
</style>
