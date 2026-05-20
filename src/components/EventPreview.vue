<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Event Poster -->
      <div class="w-full md:w-1/3 flex-shrink-0">
        <div
          v-if="eventData.imagePreviewUrl"
          class="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            :src="eventData.imagePreviewUrl"
            alt="Poster Event"
            class="w-full h-full object-cover"
          >
        </div>
        <div
          v-else
          class="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center shadow-lg"
        >
          <i class="ri-image-line text-6xl text-blue-300 mb-3" />
          <p class="text-blue-400 text-sm font-medium">Belum ada gambar</p>
        </div>
      </div>

      <!-- Event Details -->
      <div class="w-full md:w-2/3 space-y-6">
        <h1 class="font-bold text-[32px] py-4 sm:text-[24px] text-gray-800">
          {{ eventData.title || '(Judul belum diisi)' }}
        </h1>
        <div class="border-b-2 border-[#003266] w-full my-4" />

        <!-- Details Grid -->
        <div class="event-details grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
          <!-- Tanggal -->
          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="DateIcon" alt="Calendar" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Tanggal</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ formattedStartDate }}
              </p>
            </div>
          </div>

          <!-- Waktu -->
          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="ClockIcon" alt="Clock" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Waktu</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.start_date_time || '--:--' }} – {{ eventData.end_date_time || '--:--' }}
              </p>
            </div>
          </div>

          <!-- Lokasi -->
          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="LocationIcon" alt="Location" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Lokasi</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.isOffline ? (eventData.location || '(belum diisi)') : 'Online' }}
              </p>
            </div>
          </div>

          <!-- Kapasitas -->
          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="ChairIcon" alt="Capacity" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Kapasitas</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.max_participants ? `${eventData.max_participants} Kursi Tersedia` : '(belum diisi)' }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-b-2 border-[#003266] w-full my-4" />

        <!-- Description -->
        <div>
          <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full text-gray-700 leading-relaxed">
            {{ eventData.description || '(Deskripsi belum diisi)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4 pt-8 border-t border-gray-200">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DateIcon from '../assets/image/date.svg'
import ClockIcon from '../assets/image/clock.svg'
import LocationIcon from '../assets/image/location.svg'
import ChairIcon from '../assets/image/chair.svg'

const props = defineProps<{
  eventData: {
    title?: string
    description?: string
    start_date_date?: string
    start_date_time?: string
    end_date_date?: string
    end_date_time?: string
    location?: string
    max_participants?: string | number
    isOffline?: boolean
    imagePreviewUrl?: string | null
  }
}>()

const formattedStartDate = computed(() => {
  const d = props.eventData.start_date_date
  if (!d) return '(belum diisi)'
  try {
    return new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return d
  }
})
</script>
