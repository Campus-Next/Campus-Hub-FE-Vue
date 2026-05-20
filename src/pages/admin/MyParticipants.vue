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
              v-for="(participant, index) in sortedEvents"
              :key="`${participant.id}-${statusFilter}-${index}`"
              class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center animate-slideIn opacity-0"
              :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
            >
              <div class="event-data flex items-center">
                <img
                  :src="`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(participant.user?.name || 'Participant')}&size=250`"
                  :alt="participant.user?.name"
                  class="w-20 h-20 object-cover rounded-full my-2"
                >
                <div class="event-details flex flex-col px-4">
                  <span class="event-title block font-semibold text-lg mb-2">{{ participant.user?.name }}</span>
                  <span class="event-date text-sm text-gray-500 mb-1 block">
                    Join date: {{ participant.created_at ? new Date(participant.created_at).toLocaleDateString() : 'N/A' }}
                  </span>
                  <span class="text-xs text-gray-400">Status: {{ participant.status }}</span>
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
import { useStatusFilter } from '../../composables/useFilters'
import type { EventParticipant } from '../../types'

const router = useRouter()
const route = useRoute()
const events = ref<EventParticipant[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const sortOption = ref('date')
const isDropdownOpen = ref(false)

useAuthCheck(true)

const { statusFilter, handleStatusFilter, filteredByStatus, statusCounts } = useStatusFilter<EventParticipant>(events)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleSortChange = (option: string) => {
  sortOption.value = option
  isDropdownOpen.value = false
}

const sortedEvents = computed(() => {
  const q = searchQuery.value.toLowerCase()
  const filtered = filteredByStatus.value.filter(p =>
    (p.user?.name || '').toLowerCase().includes(q),
  )
  const sorted = [...filtered]
  if (sortOption.value === 'date') {
    return sorted.sort(
      (a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime(),
    )
  }
  if (sortOption.value === 'title') {
    return sorted.sort((a, b) => (a.user?.name || '').localeCompare(b.user?.name || ''))
  }
  return sorted
})

watch(
  () => (route as any).state?.activeTab,
  (activeTab) => {
    if (activeTab) {
      statusFilter.value = activeTab as any
    }
  },
)

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

