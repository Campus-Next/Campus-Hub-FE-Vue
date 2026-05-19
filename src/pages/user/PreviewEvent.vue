<template>
  <div class="preview-event h-screen relative">
    <Navbar />
    
    <ErrorMessage v-if="error" :message="error" class="m-4" />

    <div
      v-else-if="eventData"
      :class="['pt-10 mx-4 lg:mx-20 preview-event-container', isLoaded ? 'loaded' : '', isExiting ? 'exiting' : '']"
    >
      <div class="breadcrumb pt-auto flex ml-2 pb-10">
        <ol class="list-none flex text-black text-medium">
          <li><router-link to="/" class="hover:underline">Home</router-link></li>
          <li class="mx-2"> &gt; </li>
          <li>
            <span class="text-gray-500">Event Preview</span>
          </li>
          <li class="mx-2"> &gt; </li>
          <li><a href="" class="hover:underline">Booking</a></li>
        </ol>
      </div>

      <div class="content-box flex flex-col lg:flex-row gap-8">
        <div class="event-description border-2 border-dashed border-black pl-4 py-8 custom-dashed rounded-2xl w-9/12">
          <div class="event-detail flex flex-col lg:flex-row px-4">
            <div class="PosterEvent w-6/12 mr-4">
              <img
                class="w-full h-full object-cover rounded-2xl shadow-lg"
                src="https://via.placeholder.com/400x300/027FFF/FFFFFF?text=Event"
                alt="Poster Event"
              />
            </div>

            <div class="description text-left mx-4 mt-4 lg:mt-0 lg:w-8/12 sm:w-full">
              <h1 class="font-bold text-[28px] py-4">{{ eventData.title }}</h1>
              <div class="border-b-2 border-[#003266] w-full my-4"></div>

              <div class="event-details grid grid-cols-1 sm:grid-cols-2 gap-6 ml-2">
                <div class="detail-item flex items-center gap-3">
                  <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                    <img src="../../assets/image/date.svg" alt="Date" class="w-5 h-5 object-contain" />
                  </div>
                  <div class="detail-content">
                    <p class="text-sm text-gray-500 font-medium">Tanggal</p>
                    <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">{{ new Date(eventData.start_date).toLocaleDateString('id-ID') }}</p>
                  </div>
                </div>

                <div class="detail-item flex items-center gap-3">
                  <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                    <img src="../../assets/image/clock.svg" alt="Time" class="w-5 h-5 object-contain" />
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
                    <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">{{ eventData.location }}</p>
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

              <div class="description-section px-2">
                <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full max-w-[486px]">
                  {{ eventData.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="booking w-3/12 max-w-md h-full px-6 py-6 mx-auto lg:mx-2 bg-white shadow-lg rounded-2xl flex flex-col lg:relative">
          <div class="sub-total flex gap-4">
            <span class="text-left my-2 font-medium text-[14px] pl-2 me-auto">Sub Total</span>
            <span class="text-right my-2 font-medium text-[14px] ms-auto">1 seat(s)</span>
          </div>
          <span class="event-type my-2 font-medium text-[14px] pl-2">Event</span>
          <div class="border-b-2 border-[#003266] w-full my-4"></div>
          <div class="total flex gap-4">
            <span class="text-left my-2 font-semibold text-[18px] pl-2 me-auto">Total</span>
            <span class="text-right my-2 font-semibold text-[18px] ms-auto">1 seat(s)</span>
          </div>
          <div class="checkout flex flex-col">
            <button
              class="bg-[#027FFF] font-regular w-full h-11 my-2 rounded-lg text-medium text-white text-[16px]"
              @click="handleBooking"
            >
              Checkout
            </button>
            <button
              class="bg-white border-2 border-[#027FFF] font-regular w-full h-11 my-2 rounded-lg text-medium text-[#027FFF] text-[16px]"
              @click="handleExit"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <PopUpCheckout v-if="showPopup" :isVisible="showPopup" @close="showPopup = false" :message="message" />
    <PopUpGagal v-if="gagalPopup" :isVisible="gagalPopup" @close="gagalPopup = false" :message="message" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useEventDetail } from '../../composables/useEventDetail'
import { registerEventWithToken } from '../../services/api'
import { getCategoryRoute } from '../../utils/helpers'
import { STORAGE_BASE_URL } from '../../constants'
import Navbar from '../../components/Navbar.vue'
import PopUpCheckout from '../../components/PopUpCheckout.vue'
import PopUpGagal from '../../components/PopUpGagal.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const { getToken } = useAuth()
const { eventData, error, loadEvent } = useEventDetail()

const storage = STORAGE_BASE_URL
const showPopup = ref(false)
const gagalPopup = ref(false)
const isExiting = ref(false)
const isLoaded = ref(false)
const message = ref('')

const handleBooking = async () => {
  try {
    const token = getToken()
    if (!token) {
      router.push(`/user/login?redirect=${encodeURIComponent(route.path)}`)
      return
    }

    const eventId = route.params.id as string
    const data = await registerEventWithToken(Number(eventId), token)
    message.value = data.message
    showPopup.value = true

    setTimeout(() => {
      router.push(`/my-events/${eventData.value?.id}/kode-unik`)
    }, 2000)
  } catch (error: any) {
    message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
    gagalPopup.value = true
  }
}

const handleExit = () => {
  isExiting.value = true
  setTimeout(() => {
    router.go(-2)
  }, 500)
}

onMounted(async () => {
  const eventId = route.params.id as string
  await loadEvent(eventId)

  setTimeout(() => {
    isLoaded.value = true
  }, 500)
})
</script>



