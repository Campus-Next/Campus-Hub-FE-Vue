<template>
  <div class="detail-event h-screen">
    <Navbar />

    <div :class="`container ${pageAnimation} pt-10 mx-auto`">
      <div class="breadcrumb pt-auto flex ml-2 pb-10 text-sm lg:text-base">
        <ol class="list-none flex text-black text-medium">
          <li><RouterLink to="/my-events">My Events</RouterLink></li>
          <li class="mx-2"> &gt; </li>
          <li><RouterLink :to="{ path: `/my-events/${route.params.id}/edit`, state: { step: 1, data: eventData } }">Update Event</RouterLink></li>
          <li class="mx-2"> &gt; </li>
          <li><RouterLink :to="{ path: `/my-events/${route.params.id}/edit`, state: { step: 2, data: eventData } }">Detail Event</RouterLink></li>
          <li class="mx-2"> &gt; </li>
          <li><a href="#" @click.prevent="window.location.reload()">Preview</a></li>
        </ol>
      </div>
      <div class="content-box flex flex-col lg:flex-row">
        <div class="PosterEvent w-full lg:w-1/2 h-auto lg:h-1/2">
          <img class="w-full h-auto object-cover rounded-2xl shadow-lg" :src="eventData.eventsPreview" alt="Poster Event">
        </div>
        <div class="description text-left mt-6 lg:mt-0 lg:mx-8">
          <span class="bg-[#027FFF] font-regular px-4 py-1 lg:px-8 lg:py-1 rounded-full text-white text-[12px] lg:text-[14px]">
            Event
          </span>
          <h1 class="font-bold text-[20px] lg:text-[32px] py-4 max-w-[40rem]">
            {{ eventData.title }}
          </h1>
          <div class="border-b-2 border-[#003266] w-full lg:w-[486px] my-4" />

          <div class="flex gap-2 ml-2">
            <img :src="DateIcon" alt="Calendar" class="text-4xl sm:text-3xl">
            <span class="font-medium text-[16px] sm:text-[14px] mt-2">{{ new Date(eventData.start_date).toLocaleDateString('id-ID') }}</span>
            <span class="font-medium text-[16px] sm:text-[14px] mt-2 ml-auto mr-2">
              {{ new Date(eventData.start_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }} - {{ new Date(eventData.end_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }}
            </span>
          </div>
          <div class="flex gap-2 ml-1 my-4">
            <i class="ri-map-pin-2-fill text-4xl sm:text-3xl" />
            <span class="font-medium text-[16px] sm:text-[14px] mt-2">
              {{ eventData.isOffline ? eventData.location : 'Online' }}
            </span>
            <img :src="Chair" alt="Location" class="text-4xl sm:text-3xl ml-auto">
            <span class="font-medium text-[16px] sm:text-[14px] mt-2 mr-2">
              {{ eventData.max_participants }} Kursi
            </span>
          </div>

          <div class="border-b-2 border-[#003266] w-full lg:w-[486px] my-4" />
          <div>
            <p class="eventdescription font-regular text-wrap text-[14px] lg:text-[16px] block w-full lg:max-w-[486px]">
              {{ eventData.description }}
            </p>
          </div>
        </div>

        <div class="booking w-full lg:w-4/12 h-1/2 px-6 py-6 mt-6 lg:mt-0 lg:mx-8 bg-white shadow-lg rounded-2xl flex flex-col">
          <div class="checkout flex flex-col">
            <button class="bg-[#027FFF] font-regular w-full h-10 lg:h-11 my-2 rounded-lg text-medium text-white text-[14px] lg:text-[16px]" @click="handleUpdate">
              Update
            </button>
            <button class="bg-transparent border-2 border-[#027FFF] font-regular w-full h-10 lg:h-11 my-2 rounded-lg text-medium text-black text-[14px] lg:text-[16px] hover:bg-red-300 hover:border-red-500" @click="handleBack">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 right-0 -z-10">
      <img :src="Ellipse2" alt="Background" class="w-40 lg:w-[300px]">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Ellipse2 from '../../assets/image/Ellipse2.svg'
import DateIcon from '../../assets/image/date.svg'
import Chair from '../../assets/image/chair.svg'
import Navbar from '../../components/Navbar.vue'
import { updateEvent } from '../../services/api'
import { useAuthCheck } from '../../composables/useAuthCheck'

const router = useRouter()
const route = useRoute()
const eventData = ref<any>(null)
const pageAnimation = ref('page-enter')

useAuthCheck(true)



const handleBack = () => {
  pageAnimation.value = 'page-exit'
  setTimeout(() => window.history.back(), 400)
}

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push(`/user/login?redirect=${encodeURIComponent(route.path)}`)
      return
    }

    const formData = new FormData()
    formData.append('title', eventData.value.title)
    formData.append('start_date', eventData.value.start_date)
    formData.append('end_date', eventData.value.end_date)
    formData.append('description', eventData.value.description)
    formData.append('max_participants', eventData.value.max_participants)
    formData.append('registration_fee', eventData.value.registration_fee || '0')
    if (eventData.value.registration_open) {
      formData.append('registration_open', eventData.value.registration_open)
    }
    if (eventData.value.registration_deadline) {
      formData.append('registration_deadline', eventData.value.registration_deadline)
    }
    if (eventData.value.isOffline) {
      formData.append('location', eventData.value.location)
    } else {
      formData.append('location', 'Online')
    }
    // We are currently omitting event image upload to match API spec,
    // unless you want to append it to the separate endpoint. For now we skip it here.

    await updateEvent(route.params.id as string, formData, token)
    router.push('/my-events')
  } catch (error: any) {
    alert(`Update gagal: ${error.message || 'Coba lagi nanti.'}`)
  }
}

onMounted(() => {
  if (route.state) {
    eventData.value = route.state
  } else {
    router.replace(`/my-events/${route.params.id}/edit`)
  }
})
</script>

