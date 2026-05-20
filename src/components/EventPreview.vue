<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Event Image -->
      <div class="w-full md:w-1/3">
        <img :src="eventData.eventsPreview" alt="Poster Event" class="w-full h-full object-cover rounded-2xl shadow-lg">
      </div>
      
      <!-- Event Details -->
      <div class="w-full md:w-2/3 space-y-6">
        <h1 class="font-bold text-[32px] py-4 sm:text-[24px]">
          {{ eventData.title }}
        </h1>
        <div class="border-b-2 border-[#003266] w-full my-4" />

        <!-- Event Details Grid -->
        <div class="event-details grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="DateIcon" alt="Calendar" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Tanggal</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.date }}
              </p>
            </div>
          </div>

          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="ClockIcon" alt="Clock" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Waktu</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.start_time }} - {{ eventData.end_time }}
              </p>
            </div>
          </div>

          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="LocationIcon" alt="Location" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Lokasi</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.isOffline ? eventData.location : 'Online' }}
              </p>
            </div>
          </div>

          <div class="detail-item flex items-start gap-3">
            <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <img :src="ChairIcon" alt="Capacity" class="w-5 h-5 object-contain">
            </div>
            <div class="detail-content">
              <p class="text-sm text-gray-500 font-medium">Kapasitas</p>
              <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">
                {{ eventData.slot }} Kursi Tersedia
              </p>
            </div>
          </div>
        </div>

        <div class="border-b-2 border-[#003266] w-full my-4" />
        
        <div class="border-b-2 border-[#003266] w-full my-4" />
        
        <!-- Description -->
        <div>
          <p class="eventdescription font-regular text-wrap text-[16px] sm:text-[14px] block w-full">
            {{ eventData.desc }}
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
  eventData: any
}>()
</script>

