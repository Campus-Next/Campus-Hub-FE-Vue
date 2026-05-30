import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  fetchEvents as apiFetchEvents,
  fetchCategories as apiFetchCategories,
} from '../services/api'
import type { Category, Event } from '../types'
import { isAdmin } from '../utils/authSession'

export function useEvents(
  categoryId?: string | number,
  options?: { autoLoad?: boolean; checkAdmin?: boolean },
) {
  const router = useRouter()
  const events = ref<Event[]>([])
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEvents = async (id?: string | number) => {
    const targetId = id ?? categoryId

    if (options?.checkAdmin) {
      if (isAdmin()) {
        router.replace('/')
        return
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const query = targetId ? { category_id: Number(targetId) } : {}
      const [eventList, categoryList] = await Promise.all([
        apiFetchEvents(query),
        apiFetchCategories(),
      ])

      const loadedEvents = Array.isArray(eventList) ? eventList : []
      events.value = targetId && loadedEvents.some(event => event.category_id)
        ? loadedEvents.filter(event => event.category_id === Number(targetId))
        : loadedEvents
      categories.value = Array.isArray(categoryList) ? categoryList : []

      if (events.value.length === 0) {
        error.value = 'Tidak ada data acara.'
      }
    } catch (err: any) {
      error.value = err?.data || err?.message || 'Terjadi kesalahan saat memuat data'
    } finally {
      isLoading.value = false
    }
  }

  if (options?.autoLoad !== false) {
    onMounted(() => {
      window.scrollTo(0, 0)
      loadEvents()
    })
  }

  return {
    events,
    categories,
    isLoading,
    error,
    loadEvents,
  }
}
