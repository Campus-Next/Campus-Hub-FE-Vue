import { ref, computed } from 'vue'

export function useEventFilters<T extends Record<string, any>>(
  events: any,
  searchKey: keyof T,
  dateKey?: keyof T,
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

  const filteredEvents = computed(() => {
    const q = searchQuery.value.toLowerCase()
    if (!q) return events.value as T[]
    return (events.value as T[]).filter(event =>
      String(event[searchKey]).toLowerCase().includes(q),
    )
  })

  const sortedEvents = computed(() => {
    const sorted = [...filteredEvents.value]
    if (sortOption.value === 'date' && dateKey) {
      return sorted.sort(
        (a, b) => new Date(a[dateKey] as any).getTime() - new Date(b[dateKey] as any).getTime(),
      )
    }
    if (sortOption.value === 'title') {
      return sorted.sort((a, b) => String(a[searchKey]).localeCompare(String(b[searchKey])))
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
    sortedEvents,
  }
}

export function useCategoryFilter<T extends { category_id?: number | null }>(events: any) {
  const categoryFilter = ref<string | number>('All')

  const handleCategoryFilter = (category: string | number) => {
    categoryFilter.value = category
  }

  const filteredByCategory = computed(() => {
    const filter = categoryFilter.value
    if (filter === 'All') return events.value as T[]
    return (events.value as T[]).filter(event => event.category_id === filter)
  })

  const categoryCounts = computed(() => {
    const counts: Record<string, number> = { all: 0 }
    for (const event of events.value as T[]) {
      counts.all++
      const key = String(event.category_id ?? 'uncategorized')
      counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
  })

  return {
    categoryFilter,
    handleCategoryFilter,
    filteredByCategory,
    categoryCounts,
  }
}

const STATUS_KEYS = ['registered', 'attended', 'absent', 'cancelled'] as const
type StatusKey = (typeof STATUS_KEYS)[number]

export function useStatusFilter<T extends { status: string }>(events: any) {
  const statusFilter = ref<'All' | StatusKey | string>('All')

  const handleStatusFilter = (status: string | number) => {
    statusFilter.value = String(status)
  }

  const filteredByStatus = computed(() => {
    const targetStatus = statusFilter.value.toLowerCase()
    if (targetStatus === 'all') return events.value as T[]
    return (events.value as T[]).filter(
      event => event.status?.toLowerCase() === targetStatus,
    )
  })

  const statusCounts = computed(() => {
    const counts: Record<string, number> = { all: 0, registered: 0, attended: 0, absent: 0, cancelled: 0 }
    for (const event of events.value as T[]) {
      counts.all++
      const key = event.status?.toLowerCase()
      if (key in counts) counts[key]++
    }
    return counts
  })

  return {
    statusFilter,
    handleStatusFilter,
    filteredByStatus,
    statusCounts,
  }
}
