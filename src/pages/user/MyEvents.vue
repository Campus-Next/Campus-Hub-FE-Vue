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
            <div class="features flex flex-wrap gap-4 items-center mt-4 lg:mt-0 w-full sm:w-auto">
              <div class="search flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-4 py-2 border border-gray-300 rounded-lg flex items-center">
                <input
                  type="text"
                  placeholder="Cari acara..."
                  class="focus:outline-none w-full"
                  v-model="searchQuery"
                />
              </div>
              <div class="sort relative sm:max-w-[200px] lg:max-w-[150px]" ref="dropdownRef">
                <div
                  class="dropdown-select flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                  @click="toggleDropdown"
                >
                  <span class="text-sm sm:text-base">
                    {{ sortOption === 'date' ? 'By date' : 'A-Z' }}
                  </span>
                  <img src="../../assets/image/menu.svg" alt="menu" class="dropdown-icon" />
                </div>
                <div v-if="isDropdownOpen" class="dropdown-menu absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md w-full">
                  <ul>
                    <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="handleSortChange('date')">
                      By date
                    </li>
                    <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="handleSortChange('title')">
                      A-Z
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="event-status flex flex-wrap gap-8 sm:gap-12 lg:gap-16 py-4">
            <ul class="flex gap-8 sm:gap-12 lg:gap-16 w-full text-sm sm:text-base justify-center lg:justify-start lg:px-20">
              <li
                :class="['cursor-pointer', statusFilter === 'All' ? 'font-bold underline' : '']"
                @click="handleStatusFilter('All')"
              >
                All ({{ allCount }})
              </li>
              <li
                :class="['cursor-pointer', statusFilter === 'Registered' ? 'font-bold underline' : '']"
                @click="handleStatusFilter('Registered')"
              >
                Registered ({{ registeredCount }})
              </li>
              <li
                :class="['cursor-pointer', statusFilter === 'Cancelled' ? 'font-bold underline' : '']"
                @click="handleStatusFilter('Cancelled')"
              >
                Canceled ({{ canceledCount }})
              </li>
              <li
                :class="['cursor-pointer', statusFilter === 'Attended' ? 'font-bold underline' : '']"
                @click="handleStatusFilter('Attended')"
              >
                Attended ({{ attendedCount }})
              </li>
              <li
                :class="['cursor-pointer', statusFilter === 'Absent' ? 'font-bold underline' : '']"
                @click="handleStatusFilter('Absent')"
              >
                Absent ({{ absentCount }})
              </li>
            </ul>
          </div>

          <div class="event-list flex flex-col gap-6 px-4 sm:px-6 lg:px-20 py-2">
            <div v-if="sortedEvents.length > 0">
              <div
                v-for="(event, index) in sortedEvents"
                :key="`${event.id}-${statusFilter}-${index}`"
                class="event-box p-4 border border-customBlue rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-4 py-2 flex justify-between items-center cursor-pointer"
                @click="router.push(`/my-events/${event.id}/view`)"
              >
                <div class="event-data flex items-center">
                  <img
                    :src="`${storage}/${event.foto_event}`"
                    :alt="event.judul"
                    class="w-20 h-20 object-cover rounded-full my-2"
                  />
                  <div class="event-details flex flex-col px-4">
                    <span class="event-title block font-semibold text-lg mb-2">
                      {{ event.judul }}
                    </span>
                    <span class="event-date text-sm text-gray-500 mb-1 block">
                      Join date: {{ new Date(event.join_date).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <router-link :to="`/my-events/${event.id}/view`">
                  <i class="ri-more-fill text-4xl"></i>
                </router-link>
              </div>
            </div>
            <div v-else>No events found.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchMyEvents } from '../../services/api'
import Navbar from '../../components/Navbar.vue'

interface Event {
  id: number
  judul: string
  foto_event: string
  join_date: string
  status: string
}

const router = useRouter()
const route = useRoute()

const events = ref<Event[]>([])
const searchQuery = ref('')
const sortOption = ref('date')
const statusFilter = ref('All')
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isLoading = ref(true)

const storage = import.meta.env.VITE_STORAGE_BASE_URL

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleSortChange = (option: string) => {
  sortOption.value = option
  isDropdownOpen.value = false
}

const handleStatusFilter = (status: string) => {
  statusFilter.value = status
}

const filteredEvents = computed(() => {
  return events.value
    .filter(event => event.judul.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(event => {
      switch (statusFilter.value.toLowerCase()) {
        case 'registered':
          return event.status.toLowerCase() === 'registered'
        case 'cancelled':
          return event.status.toLowerCase() === 'cancelled'
        case 'attended':
          return event.status.toLowerCase() === 'attended'
        case 'absent':
          return event.status.toLowerCase() === 'absent'
        case 'all':
          return true
        default:
          return false
      }
    })
})

const sortedEvents = computed(() => {
  return [...filteredEvents.value].sort((a, b) => {
    if (sortOption.value === 'date') {
      return new Date(a.join_date).getTime() - new Date(b.join_date).getTime()
    } else if (sortOption.value === 'title') {
      return a.judul.localeCompare(b.judul)
    }
    return 0
  })
})

const allCount = computed(() => events.value.length)
const registeredCount = computed(() => events.value.filter(e => e.status.toLowerCase() === 'registered').length)
const canceledCount = computed(() => events.value.filter(e => e.status.toLowerCase() === 'cancelled').length)
const attendedCount = computed(() => events.value.filter(e => e.status.toLowerCase() === 'attended').length)
const absentCount = computed(() => events.value.filter(e => e.status.toLowerCase() === 'absent').length)

onMounted(async () => {
  if (route.state?.activeTab) {
    statusFilter.value = route.state.activeTab as string
  }

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
    if (err.status === 403) {
      router.push('/my-events')
    }
  } finally {
    isLoading.value = false
  }
})
</script>



