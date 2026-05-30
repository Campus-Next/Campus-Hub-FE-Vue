<template>
  <div class="font-sans flex flex-col box-border w-full">
    <div class="myevents">
      <Navbar />

      <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <div class="loader w-16 h-16 border-4 border-customBlue border-t-transparent rounded-full animate-spin"></div>
        <p class="ml-4 text-lg font-medium">Loading...</p>
      </div>

      <div v-else class="container mx-auto px-4 sm:px-6 lg:px-20">
        <div class="content-box flex flex-col">
          <div class="page-features flex flex-wrap justify-between px-4 sm:px-6 lg:px-20 pt-16">
            <h1 class="text-3xl font-bold">My Events</h1>
            <SearchSort
              v-model="searchQuery"
              :sort-option="sortOption"
              :is-open="isDropdownOpen"
              placeholder="Cari acara..."
              @toggle="toggleDropdown"
              @sort="handleSortChange"
            />
          </div>

          <FilterTabs
            :tabs="[
              { value: 'All', label: 'All', count: counts?.all ?? 0 },
              { value: 'Registered', label: 'Registered', count: counts?.registered ?? 0 },
              { value: 'Attended', label: 'Attended', count: counts?.attended ?? 0 },
              { value: 'Absent', label: 'Absent', count: counts?.absent ?? 0 },
              { value: 'Cancelled', label: 'Cancelled', count: counts?.cancelled ?? 0 }
            ]"
            :active-tab="statusFilter"
            @change="handleStatusFilter"
          />

          <div class="event-list flex flex-col gap-6 px-4 sm:px-6 lg:px-20 py-2">
            <div v-if="items.length > 0" class="flex flex-col gap-6">
              <div
                v-for="(participant, index) in items"
                :key="`${participant.id}-${statusFilter}-${index}`"
                class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center cursor-pointer"
                @click="router.push(`/my-events/${participant.event_id}/view`)"
              >
                <div class="event-data flex items-center">
                  <img
                    :src="getEventImageUrl(participant.event)"
                    alt="Event"
                    class="w-20 h-20 object-cover rounded-full my-2"
                  />
                  <div class="event-details flex flex-col px-4">
                    <span class="event-title block font-semibold text-lg mb-2">
                      {{ participant.event?.title || 'Untitled Event' }}
                    </span>
                    <span class="event-date text-sm text-gray-500 mb-1 block">
                      Join date: {{ participant.created_at ? new Date(participant.created_at).toLocaleDateString() : 'N/A' }}
                    </span>
                    <span class="text-xs text-gray-400">Status: {{ participant.status }}</span>
                  </div>
                </div>
                <router-link :to="`/my-events/${participant.event_id}/view`">
                  <i class="ri-more-fill text-4xl"></i>
                </router-link>
              </div>
            </div>
            <div v-else>No events found.</div>
          </div>

          <Pagination :current-page="currentPage" :max-page="maxPage" @page-change="setPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchMyRegisteredEventsPage } from '../../services/api'
import Navbar from '../../components/Navbar.vue'
import SearchSort from '../../components/SearchSort.vue'
import FilterTabs from '../../components/FilterTabs.vue'
import Pagination from '../../components/Pagination.vue'
import { useServerList } from '../../composables/useServerList'
import { getEventImageUrl } from '../../utils/helpers'
import type { EventParticipant } from '../../types'

const router = useRouter()
const route = useRoute()

const token = localStorage.getItem('token')

const {
  items,
  isLoading,
  searchQuery,
  sortOption,
  statusFilter,
  isDropdownOpen,
  currentPage,
  maxPage,
  counts,
  toggleDropdown,
  handleSortChange,
  handleStatusFilter,
  setPage,
  load,
} = useServerList<EventParticipant>(
  query => fetchMyRegisteredEventsPage(token as string, query),
  { autoLoad: false },
)

onMounted(() => {
  window.scrollTo(0, 0)

  if (!token) {
    router.replace('/welcome?redirect=/my-events')
    return
  }

  const activeTab = (route as any).state?.activeTab
  if (['All', 'Registered', 'Attended', 'Absent', 'Cancelled'].includes(activeTab)) {
    statusFilter.value = activeTab as string
  }

  load()
})
</script>



