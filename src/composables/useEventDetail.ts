import { ref } from 'vue'
import { fetchEvent, fetchEventStatus } from '../services/api'
import type { Event } from '../types'

export function useEventDetail() {
  const eventData = ref<Event | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEvent = async (eventId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchEvent(Number(eventId))
      eventData.value = data
    } catch (err: any) {
      error.value = err.message || 'Terjadi kesalahan saat memuat data'
    } finally {
      isLoading.value = false
    }
  }

  const clearEvent = () => {
    eventData.value = null
    error.value = null
  }

  return {
    eventData,
    isLoading,
    error,
    loadEvent,
    clearEvent
  }
}

export function useEventStatus() {
  const status = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadStatus = async (eventId: string | number, token: string) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchEventStatus(Number(eventId), token)
      status.value = data.status
    } catch (err: any) {
      error.value = err.message || 'Terjadi kesalahan saat memuat status'
    } finally {
      isLoading.value = false
    }
  }

  return {
    status,
    isLoading,
    error,
    loadStatus
  }
}
