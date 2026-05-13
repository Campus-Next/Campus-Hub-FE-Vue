<template>
  <div class="font-sans flex flex-col box-border w-full">
    <div class="MyParticipants">
      <Navbar />

      <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <div class="loader w-16 h-16 border-4 border-customBlue border-t-transparent rounded-full animate-spin" />
        <p class="ml-4 text-lg font-medium">Loading...</p>
      </div>

      <div v-else class="container mx-auto px-4 sm:px-6 lg:px-20">
        <div class="content-box flex flex-col">
          <div class="page-features flex flex-wrap justify-between px-4 sm:px-6 lg:px-20 pt-16">
            <h1 class="text-3xl font-bold">MyParticipants</h1>

            <SearchSort
              v-model="searchQuery"
              :sort-option="sortOption"
              :is-open="isDropdownOpen"
              placeholder="Cari acara..."
              @toggle="toggleDropdown"
              @sort="handleSortChange"
            >
              <button class="bg-blue-500 text-white px-4 py-2 w-[10rem] rounded-lg" @click="router.push(`/my-events/${route.params.id}/check-in`)">
                Check In
              </button>
            </SearchSort>
          </div>

          <FilterTabs
            :tabs="[
              { value: 'All', label: 'All', count: statusCounts.all },
              { value: 'Registered', label: 'Registered', count: statusCounts.registered },
              { value: 'Cancelled', label: 'Canceled', count: statusCounts.cancelled },
              { value: 'Attended', label: 'Attended', count: statusCounts.attended },
              { value: 'Absent', label: 'Absent', count: statusCounts.absent }
            ]"
            :active-tab="statusFilter"
            @change="handleStatusFilter"
          />

          <div class="event-list flex flex-col gap-6 px-4 sm:px-6 lg:px-20 py-2">
            <div
              v-for="(event, index) in sortedEvents"
              :key="`${event.id}-${statusFilter}-${index}`"
              class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center animate-slideIn opacity-0"
              :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
            >
              <div class="event-data flex items-center">
                <img
                  :src="event.photo ? `${storage}/${event.photo}` : `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(event.fullname)}&size=250`"
                  :alt="event.fullname"
                  class="w-20 h-20 object-cover rounded-full my-2"
                >
                <div class="event-details flex flex-col px-4">
                  <span class="event-title block font-semibold text-lg mb-2">{{ event.fullname }}</span>
                  <span class="event-date text-sm text-gray-500 mb-1 block">
                    Join date: {{ new Date(event.join_date).toLocaleDateString() }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="sortedEvents.length === 0">No participants found.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import SearchSort from '../../components/SearchSort.vue'
import FilterTabs from '../../components/FilterTabs.vue'
import { fetchEventParticipants } from '../../services/api'
import { useAuthCheck } from '../../composables/useAuthCheck'
import { useEventFilters, useStatusFilter } from '../../composables/useFilters'

const router = useRouter()
const route = useRoute()
const events = ref<any[]>([])
const isLoading = ref(true)
const storage = import.meta.env.VITE_STORAGE_BASE_URL

useAuthCheck(true)

const { statusFilter, handleStatusFilter, filteredByStatus, statusCounts } = useStatusFilter(events)
const { searchQuery, sortOption, isDropdownOpen, toggleDropdown, handleSortChange } = useEventFilters(filteredByStatus, 'fullname', 'join_date')

const sortedEvents = computed(() => {
  const filtered = filteredByStatus.value.filter(event => 
    event.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  const sorted = [...filtered]
  if (sortOption.value === 'date') {
    return sorted.sort((a, b) => new Date(a.join_date).getTime() - new Date(b.join_date).getTime())
  } else if (sortOption.value === 'title') {
    return sorted.sort((a, b) => a.fullname.localeCompare(b.fullname))
  }
  return sorted
})

watch(() => route.state?.activeTab, (activeTab) => {
  if (activeTab) {
    statusFilter.value = activeTab as string
  }
})

onMounted(async () => {
  window.scrollTo(0, 0)

  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const data = await fetchEventParticipants(route.params.id as string, token)
    events.value = data
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

