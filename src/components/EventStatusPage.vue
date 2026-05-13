<template>
  <div class="detail-event min-h-screen">
    <Navbar />
    
    <LoadingSpinner v-if="loading" fullScreen />
    <ErrorMessage v-else-if="error" :message="error" />
    
    <div v-else :class="['pt-10 px-8 lg:px-16 w-full', pageAnimation]">
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
        <!-- Event Poster -->
        <div class="PosterEvent w-full lg:w-3/12">
          <img
            class="w-full object-cover rounded-2xl shadow-lg"
            :src="`${storage}/${eventData.foto_event}`"
            alt="Poster Event"
          />
        </div>

        <!-- Event Description -->
        <div class="description text-left flex-1 max-w-full px-6">
          <span class="bg-[#027FFF] font-regular px-8 py-1 rounded-full text-white text-[14px] sm:text-[12px]">
            {{ eventData.category_name }}
          </span>
          <h1 class="font-bold text-[32px] py-4 sm:text-[24px]">{{ eventData.judul }}</h1>
          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <!-- Event Details Grid -->
          <div class="event-details grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <EventDetailItem icon="date.svg" label="Tanggal" :value="eventData.date" />
            <EventDetailItem icon="clock.svg" label="Waktu" :value="`${eventData.start_time} - ${eventData.end_time}`" />
            <EventDetailItem icon="location.svg" label="Lokasi" :value="eventData.tempat" />
            <EventDetailItem icon="chair.svg" label="Kapasitas" :value="`${eventData.available_slot} Kursi Tersedia`" />
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <!-- Lecturer Info -->
          <div class="lecturer flex gap-2 w-auto">
            <img
              :src="`${storage}/${eventData.foto_pembicara}`"
              alt="Profile"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div class="lecturername flex flex-col ml-4 gap-2 justify-center">
              <span class="font-semibold text-[16px] sm:text-[14px]">{{ eventData.pembicara }}</span>
              <span class="text-regular text-[14px] sm:text-[12px]">{{ eventData.role }}</span>
            </div>
          </div>

          <div class="border-b-2 border-[#003266] w-full my-4"></div>

          <div>
            <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full">
              {{ eventData.deskripsi }}
            </p>
          </div>
        </div>

        <!-- Status Card -->
        <div class="booking w-full lg:w-3/12 h-fit px-6 py-6 bg-white shadow-lg rounded-2xl flex flex-col">
          <!-- Status Icon -->
          <div class="status-section mb-4">
            <div :class="['status-display p-4 rounded-xl shadow-md', statusConfig.gradientClass]">
              <div class="status-icon-container flex justify-center">
                <div
                  :class="[
                    'relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full border-4 transition-all duration-1000',
                    isIconVisible ? 'bg-white border-white' : `bg-transparent ${statusConfig.borderClass}`
                  ]"
                >
                  <component
                    :is="statusConfig.icon"
                    :class="[
                      'w-8 h-8 lg:w-10 lg:h-10 transform transition-all duration-1000',
                      statusConfig.iconColor,
                      isIconVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Status Badge and Message -->
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

          <!-- Action Buttons -->
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

    <PopUpCancel v-if="showPopUp" :setShowPopUp="(val) => showPopUp = val" />

    <div class="fixed bottom-0 left-0 -z-10">
      <img src="../assets/image/Ellipse.svg" alt="Background" class="w-40 lg:w-[300px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useEventDetail } from '../composables/useEventDetail'
import { fetchUniqueCode } from '../services/api'
import { STORAGE_BASE_URL, EVENT_STATUS } from '../constants'
import Navbar from '../components/Navbar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'
import EventDetailItem from './EventDetailItem.vue'
import PopUpCancel from '../components/PopUpCancel.vue'

interface Props {
  status: 'registered' | 'cancelled' | 'attended' | 'absent'
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const { getToken, requireAuth } = useAuth()
const { eventData, loadEvent } = useEventDetail()

const storage = STORAGE_BASE_URL
const loading = ref(true)
const error = ref<string | null>(null)
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
  'stroke-linejoin': 'round'
}, [h('path', { d: 'M5 13l4 4L19 7' })])

const CrossIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '3',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [h('path', { d: 'M6 18L18 6M6 6l12 12' })])

const statusConfig = computed(() => {
  const configs = {
    registered: {
      breadcrumb: 'Registered',
      gradientClass: 'bg-gradient-to-r from-[#027FFF] to-[#0066CC]',
      borderClass: 'border-gray-100',
      badgeClass: 'bg-green-100 text-green-800',
      badgeText: '✓ Terdaftar',
      message: 'Tunjukan kode unik ini kepada panitia atau narahubung terkait saat check-in acara',
      icon: CheckIcon,
      iconColor: 'text-gray-800'
    },
    cancelled: {
      breadcrumb: 'Cancelled',
      gradientClass: 'bg-gradient-to-r from-red-500 to-red-600',
      borderClass: 'border-red-200',
      badgeClass: 'bg-red-100 text-red-800',
      badgeText: '✗ Dibatalkan',
      message: 'Kamu sudah membatalkan acara ini, segera daftar ulang atau cari acara serupa',
      icon: CrossIcon,
      iconColor: 'text-red-500'
    },
    attended: {
      breadcrumb: 'Attended',
      gradientClass: 'bg-gradient-to-r from-green-500 to-green-600',
      borderClass: 'border-green-200',
      badgeClass: 'bg-green-100 text-green-800',
      badgeText: '✓ Telah Hadir',
      message: 'Selamat! Anda telah mengikuti event ini. Silahkan jelajahi event lainnya.',
      icon: CheckIcon,
      iconColor: 'text-green-500'
    },
    absent: {
      breadcrumb: 'Absent',
      gradientClass: 'bg-gradient-to-r from-gray-500 to-gray-600',
      borderClass: 'border-gray-200',
      badgeClass: 'bg-gray-100 text-gray-800',
      badgeText: '✗ Tidak Hadir',
      message: 'Acara ini telah berlangsung dan Anda tidak hadir. Silahkan cek event lainnya.',
      icon: CrossIcon,
      iconColor: 'text-gray-500'
    }
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

    if (props.status === 'registered' && token) {
      const codeData = await fetchUniqueCode(Number(eventId), token)
      if (codeData.kode_unik) {
        code.value = codeData.kode_unik.split('')
      }
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }

  setTimeout(() => {
    isIconVisible.value = true
  }, 1000)
})
</script>

<style scoped>


.page-enter {
  animation: fadeIn 0.5s ease-in;
}

.page-exit {
  animation: fadeOut 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
</style>




