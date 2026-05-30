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



          <div v-if="error" class="flex justify-center items-center py-8 px-4 sm:px-6 lg:px-20">
            <div class="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-md">
              {{ error }}
            </div>
          </div>

          <div class="event-list flex flex-col gap-6 px-4 sm:px-6 lg:px-20 pt-8 pb-8">
            <div
              v-for="(event, index) in items"
              :key="`${event.id}-${index}`"
              class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center animate-slideIn opacity-0"
              :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
              @click="router.push(`/my-events/${event.id}/participants`)"
            >
              <div class="event-data flex items-center">
                <img :src="getEventImageUrl(event)" alt="Event" class="w-20 h-20 object-cover rounded-full my-2">
                <div class="event-details flex flex-col px-4">
                  <span class="event-title block font-semibold text-lg mb-2">{{ event.title }}</span>
                  <span class="event-date text-sm text-gray-500 mb-1 block">
                    Updated: {{ event.updated_at ? new Date(event.updated_at).toLocaleDateString() : 'N/A' }}
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
            <div v-if="items.length === 0" class="flex justify-center items-center py-8">
              <div class="text-gray-500 text-lg">No events found.</div>
            </div>
          </div>

          <Pagination :current-page="currentPage" :max-page="maxPage" @page-change="setPage" />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Pagination from '../../components/Pagination.vue'
import PopUpDeleteEvent from '../../components/PopUpDeleteEvent.vue'
import SearchSort from '../../components/SearchSort.vue'
import { fetchMyOrganizedEventsPage } from '../../services/api'
import { useServerList } from '../../composables/useServerList'
import { getEventImageUrl } from '../../utils/helpers'
import type { Event } from '../../types'

const router = useRouter()
const selectedEventId = ref<string>('')
const showConfirm = ref(false)

const token = localStorage.getItem('token')

const {
  items,
  isLoading,
  error,
  searchQuery,
  sortOption,
  isDropdownOpen,
  currentPage,
  maxPage,
  toggleDropdown,
  handleSortChange,
  setPage,
  load,
} = useServerList<Event>(
  query => fetchMyOrganizedEventsPage(token as string, query),
  { autoLoad: false },
)

const handleDelete = (e: MouseEvent, id: string | number) => {
  e.stopPropagation()
  selectedEventId.value = String(id)
  showConfirm.value = true
}

const onSuccess = () => {
  showConfirm.value = false
  selectedEventId.value = ''
  load()
}

const onBack = () => {
  showConfirm.value = false
}

const onFailure = () => {
  showConfirm.value = false
}

onMounted(() => {
  window.scrollTo(0, 0)

  if (!token) {
    router.replace('/welcome?redirect=/my-events')
    return
  }

  load()
})
</script>
