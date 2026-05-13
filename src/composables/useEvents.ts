import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchEvents as apiFetchEvents } from '../services/api'
import type { Event } from '../types'

export function useEvents(categoryId?: string, options?: { autoLoad?: boolean, checkAdmin?: boolean }) {
  const router = useRouter()
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const trendingCount = ref(0)
  const categoryCount = ref(0)

  const loadEvents = async (id?: string) => {
    const targetId = id || categoryId
    
    // Check if user is admin and redirect if needed
    if (options?.checkAdmin) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.is_admin) {
          router.replace('/')
          return
        }
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await apiFetchEvents(targetId)
      
      if (targetId) {
        // For category-specific requests
        if (Array.isArray(data) && data.length > 0) {
          events.value = data
        } else {
          error.value = 'Tidak ada data acara.'
        }
      } else {
        // For all events request (homepage)
        if (data.events && Array.isArray(data.events)) {
          events.value = data.events
          trendingCount.value = data.trending || 0
          categoryCount.value = data.category || 0
        } else {
          error.value = 'Tidak ada data acara.'
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Terjadi kesalahan saat memuat data'
    } finally {
      isLoading.value = false
    }
  }

  const clearEvents = () => {
    events.value = []
    error.value = null
  }

  // Auto load on mount if enabled
  if (options?.autoLoad !== false) {
    onMounted(() => {
      window.scrollTo(0, 0)
      loadEvents()
    })
  }

  return {
    events,
    isLoading,
    error,
    trendingCount,
    categoryCount,
    loadEvents,
    clearEvents
  }
}
