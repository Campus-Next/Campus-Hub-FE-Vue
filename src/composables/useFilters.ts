import { ref, computed } from 'vue'

export function useEventFilters<T extends Record<string, any>>(
  events: any,
  searchKey: keyof T,
  dateKey?: keyof T
) {
  const searchQuery = ref('')
  const sortOption = ref('date')
  const isDropdownOpen = ref(false)

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  const handleSortChange = (option: string) => {
    sortOption.value = option
    isDropdownOpen.value = false
  }

  const filteredEvents = computed(() =>
    events.value.filter((event: T) =>
      String(event[searchKey]).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  const sortedEvents = computed(() => {
    const sorted = [...filteredEvents.value]
    if (sortOption.value === 'date' && dateKey) {
      return sorted.sort((a, b) => 
        new Date(a[dateKey] as any).getTime() - new Date(b[dateKey] as any).getTime()
      )
    } else if (sortOption.value === 'title') {
      return sorted.sort((a, b) => 
        String(a[searchKey]).localeCompare(String(b[searchKey]))
      )
    }
    return sorted
  })

  return {
    searchQuery,
    sortOption,
    isDropdownOpen,
    toggleDropdown,
    handleSortChange,
    filteredEvents,
    sortedEvents
  }
}

export function useCategoryFilter<T extends { kategori_id: number }>(events: any) {
  const categoryFilter = ref<string | number>('All')

  const handleCategoryFilter = (category: string | number) => {
    categoryFilter.value = category
  }

  const filteredByCategory = computed(() =>
    events.value.filter((event: T) =>
      categoryFilter.value === 'All' ? true : event.kategori_id === categoryFilter.value
    )
  )

  const categoryCounts = computed(() => ({
    all: events.value.length,
    webinar: events.value.filter((e: T) => e.kategori_id === 1).length,
    seminar: events.value.filter((e: T) => e.kategori_id === 2).length,
    kuliahTamu: events.value.filter((e: T) => e.kategori_id === 3).length,
    workshop: events.value.filter((e: T) => e.kategori_id === 4).length,
    sertifikasi: events.value.filter((e: T) => e.kategori_id === 5).length
  }))

  return {
    categoryFilter,
    handleCategoryFilter,
    filteredByCategory,
    categoryCounts
  }
}

export function useStatusFilter<T extends { status: string }>(events: any) {
  const statusFilter = ref('All')

  const handleStatusFilter = (status: string) => {
    statusFilter.value = status
  }

  const filteredByStatus = computed(() =>
    events.value.filter((event: T) => {
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
  )

  const statusCounts = computed(() => ({
    all: events.value.length,
    registered: events.value.filter((e: T) => e.status.toLowerCase() === 'registered').length,
    cancelled: events.value.filter((e: T) => e.status.toLowerCase() === 'cancelled').length,
    attended: events.value.filter((e: T) => e.status.toLowerCase() === 'attended').length,
    absent: events.value.filter((e: T) => e.status.toLowerCase() === 'absent').length
  }))

  return {
    statusFilter,
    handleStatusFilter,
    filteredByStatus,
    statusCounts
  }
}
