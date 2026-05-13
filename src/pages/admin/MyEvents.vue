<template>
  <div class="font-sans flex flex-col box-border w-full">
    <div class="myevents">
      <Navbar />

      <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <div class="loader w-16 h-16 border-4 border-customBlue border-t-transparent rounded-full animate-spin" />
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
              { value: 'All', label: 'All', count: categoryCounts.all },
              { value: 1, label: 'Webinar', count: categoryCounts.webinar },
              { value: 2, label: 'Seminar', count: categoryCounts.seminar },
              { value: 3, label: 'Kuliah Tamu', count: categoryCounts.kuliahTamu },
              { value: 4, label: 'Workshop', count: categoryCounts.workshop },
              { value: 5, label: 'Sertifikasi', count: categoryCounts.sertifikasi }
            ]"
            :active-tab="categoryFilter"
            @change="handleCategoryFilter"
          />

          <div v-if="error" class="flex justify-center items-center py-8 px-4 sm:px-6 lg:px-20">
            <div class="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-md">
              {{ error }}
            </div>
          </div>

          <div class="event-list flex flex-col gap-6 px-4 sm:px-6 lg:px-20 py-2">
            <div
              v-for="(event, index) in sortedEvents"
              :key="`${event.id}-${statusFilter}-${index}`"
              class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center animate-slideIn opacity-0"
              :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
              @click="router.push(`/my-events/${event.id}/participants`)"
            >
              <div class="event-data flex items-center">
                <img :src="`${storage}/${event.foto_event}`" :alt="event.judul" class="w-20 h-20 object-cover rounded-full my-2">
                <div class="event-details flex flex-col px-4">
                  <span class="event-title block font-semibold text-lg mb-2">{{ event.judul }}</span>
                  <span class="event-date text-sm text-gray-500 mb-1 block">
                    Updated: {{ new Date(event.uploaded).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <div class="gap-2 flex">
                <RouterLink :to="`/my-events/${event.id}/edit`" @click.stop>
                  <i class="ri-edit-box-line text-4xl hover:text-customBlue animations-all duration-300" />
                </RouterLink>
                <a @click.stop="handleDelete($event, event.id)">
                  <i class="ri-delete-bin-line text-4xl hover:text-red-500 animations-all duration-300" />
                </a>
              </div>
            </div>
            <div v-if="sortedEvents.length === 0" class="flex justify-center items-center py-8">
              <div class="text-gray-500 text-lg">No events found.</div>
            </div>
          </div>
        </div>
      </div>

      <PopUpDeleteEvent
        v-if="showConfirm"
        :id="selectedEventId"
        @success="onSuccess"
        @back="onBack"
        @failure="onFailure"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import PopUpDeleteEvent from '../../components/PopUpDeleteEvent.vue'
import SearchSort from '../../components/SearchSort.vue'
import FilterTabs from '../../components/FilterTabs.vue'
import { fetchMyEvents } from '../../services/api'
import { useEventFilters, useCategoryFilter } from '../../composables/useFilters'

const router = useRouter()
const route = useRoute()
const events = ref<any[]>([])
const selectedEventId = ref<string | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const showConfirm = ref(false)
const storage = import.meta.env.VITE_STORAGE_BASE_URL

const { categoryFilter, handleCategoryFilter, filteredByCategory, categoryCounts } = useCategoryFilter(events)
const { searchQuery, sortOption, isDropdownOpen, toggleDropdown, handleSortChange } = useEventFilters(filteredByCategory, 'judul', 'uploaded')

const sortedEvents = computed(() => {
  const filtered = filteredByCategory.value.filter(event => 
    event.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  const sorted = [...filtered]
  if (sortOption.value === 'date') {
    return sorted.sort((a, b) => new Date(a.uploaded).getTime() - new Date(b.uploaded).getTime())
  } else if (sortOption.value === 'title') {
    return sorted.sort((a, b) => a.judul.localeCompare(b.judul))
  }
  return sorted
})

const handleDelete = (e: Event, id: string) => {
  e.stopPropagation()
  selectedEventId.value = id
  showConfirm.value = true
}

const onSuccess = () => {
  showConfirm.value = false
  window.location.reload()
}

const onBack = () => {
  showConfirm.value = false
}

const onFailure = () => {
  showConfirm.value = false
}

const statusFilter = ref('All')

watch(() => route.state?.activeTab, (activeTab) => {
  if (activeTab) {
    statusFilter.value = activeTab as string
  }
})

onMounted(async () => {
  window.scrollTo(0, 0)
  
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/welcome?redirect=/my-events')
    return
  }

  try {
    const data = await fetchMyEvents(token)
    events.value = data
  } catch (err: any) {
    error.value = err.data || 'Koneksi Timeout. Silahkan Coba Lagi'
    if (err.status === 403) {
      router.push('/my-events')
    }
  } finally {
    isLoading.value = false
  }
})
</script>
