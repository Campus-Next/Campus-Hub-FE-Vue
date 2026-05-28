<template>
  <div class="detail-event min-h-screen">
    <Navbar />

    <LoadingSpinner v-if="loading" fullScreen />
    <ErrorMessage v-else-if="pageError" :message="pageError" />

    <div v-else-if="eventData" :class="['pt-10 px-8 lg:px-16 w-full', pageAnimation]">
      <div class="breadcrumb pt-auto flex pb-10 px-4">
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

      <div class="content-box flex flex-col lg:flex-row gap-8 px-4 w-full">
        <div class="PosterEvent w-full lg:w-3/12">
          <img
            class="w-full object-cover rounded-2xl shadow-lg"
            :src="getEventImageUrl(eventData)"
            alt="Poster Event"
          >
        </div>

        <div class="description text-left flex-1 max-w-full px-6">
          <h1 class="font-bold text-[32px] py-4 sm:text-[24px]">{{ eventData.title }}</h1>
          <div class="border-b-2 border-[#003266] w-full my-4" />

          <div class="event-details grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <EventDetailItem icon="date.svg" label="Tanggal" :value="new Date(eventData.start_date).toLocaleDateString('id-ID')" />
            <EventDetailItem icon="clock.svg" label="Waktu" :value="`${new Date(eventData.start_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })} - ${new Date(eventData.end_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })}`" />
            <EventDetailItem icon="location.svg" label="Lokasi" :value="eventData.location" />
            <EventDetailItem icon="chair.svg" label="Kapasitas" :value="`${eventData.max_participants} Kursi`" />
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4" />

          <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full">
            {{ eventData.description }}
          </p>

          <div v-if="eventData.event_links && eventData.event_links.length > 0" class="event-links mt-6">
            <h3 class="font-semibold text-[18px] mb-3">Tautan Acara</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in eventData.event_links" :key="link.id">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 rounded-lg border border-[#027FFF] bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <i class="ri-external-link-line text-[#027FFF] text-xl" />
                  <span class="font-medium text-[#003266] text-[14px]">{{ link.title }}</span>
                </a>
              </li>
            </ul>
          </div>

          <div v-if="status === 'registered' && code.length === 4" class="mt-6">
            <h3 class="font-semibold text-[18px] mb-3">Kode Tiket</h3>
            <div class="unique-code bg-[#027FFF] w-fit flex flex-col items-center px-6 py-4 rounded-xl">
              <div class="flex gap-2 justify-center">
                <input
                  v-for="(char, index) in code"
                  :key="index"
                  type="text"
                  maxlength="1"
                  :value="char"
                  readonly
                  class="w-10 h-12 text-center text-[24px] font-bold border border-gray-400 rounded-lg bg-white focus:outline-none"
                >
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              Tunjukkan kode ini kepada panitia saat check-in.
            </p>
          </div>
        </div>

        <div class="booking w-full lg:w-3/12 h-fit px-6 py-6 bg-white shadow-lg rounded-2xl flex flex-col">
          <div class="status-section mb-4">
            <div :class="['status-display p-4 rounded-xl shadow-md', statusConfig.gradientClass]">
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
            <div :class="['status-badge px-4 py-2 rounded-full mb-6', statusConfig.badgeClass]">
              <span class="font-semibold text-[14px] lg:text-[16px]">
                {{ statusConfig.badgeText }}
              </span>
            </div>
            <p class="font-regular text-[12px] lg:text-[14px] text-center text-gray-600 max-w-xs leading-relaxed">
              {{ statusConfig.message }}
            </p>
          </div>

          <div class="checkout flex flex-col pt-3">
            <button
              class="bg-[#027FFF] hover:bg-[#0066CC] font-medium w-full h-11 lg:h-12 mb-3 rounded-lg text-white text-[14px] lg:text-[16px] transition-colors shadow-sm"
              @click="handleBack"
            >
              Kembali
            </button>
            <button
              v-if="showCancelButton"
              class="bg-transparent border-2 border-red-400 hover:bg-red-50 hover:border-red-500 font-medium w-full h-11 lg:h-12 rounded-lg text-red-600 text-[14px] lg:text-[16px] transition-colors"
              @click="showPopUp = true"
            >
              Batalkan Pendaftaran
            </button>
          </div>
        </div>
      </div>
    </div>

    <PopUpCancel v-if="showPopUp" @close="showPopUp = false" />

    <div class="fixed bottom-0 left-0 -z-10">
      <img src="../assets/image/Ellipse.svg" alt="Background" class="w-40 lg:w-[300px]">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
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
import type { ParticipantStatus } from '../types'

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
      message: 'Tunjukan kode unik ini kepada panitia atau narahubung terkait saat check-in acara',
      icon: CheckIcon,
      iconColor: 'text-gray-800',
    },
    attended: {
      breadcrumb: 'Attended',
      gradientClass: 'bg-gradient-to-r from-green-500 to-green-600',
      borderClass: 'border-green-200',
      badgeClass: 'bg-green-100 text-green-800',
      badgeText: 'Telah Hadir',
      message: 'Selamat, Anda telah mengikuti event ini. Silahkan jelajahi event lainnya.',
      icon: CheckIcon,
      iconColor: 'text-green-500',
    },
    absent: {
      breadcrumb: 'Absent',
      gradientClass: 'bg-gradient-to-r from-gray-500 to-gray-600',
      borderClass: 'border-gray-200',
      badgeClass: 'bg-gray-100 text-gray-800',
      badgeText: 'Tidak Hadir',
      message: 'Acara ini telah berlangsung dan Anda tidak hadir. Silahkan cek event lainnya.',
      icon: CrossIcon,
      iconColor: 'text-gray-500',
    },
  }

  return configs[props.status]
})

const showCancelButton = computed(() => props.status === 'registered')

const handleBack = () => {
  pageAnimation.value = 'page-exit'
  setTimeout(() => router.push('/my-events'), 400)
}

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

    if (props.status === 'registered' && token) {
      const codeData = await fetchUniqueCode(eventId, token)
      if (codeData.unique_code) {
        code.value = codeData.unique_code.split('')
      }
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

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
</style>
