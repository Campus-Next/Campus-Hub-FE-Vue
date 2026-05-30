import { ref, computed, watch, onMounted, type Ref } from 'vue'
import type { ListMeta, ListQuery, Paginated } from '../services/api'

export interface UseServerListOptions {
  perPage?: number
  autoLoad?: boolean
  initialSort?: string
  initialStatus?: string
  debounceMs?: number
}

/**
 * Drives a server-paginated list: it owns search/sort/status/category/page
 * state, debounces search, resets to page 1 on any filter change, and ignores
 * stale responses (anti-race). The fetcher receives the assembled query and
 * returns { items, meta } from the API.
 */
export function useServerList<T>(
  fetcher: (query: ListQuery) => Promise<Paginated<T>>,
  options: UseServerListOptions = {},
) {
  const {
    perPage = 12,
    autoLoad = true,
    initialSort = 'date',
    initialStatus = 'All',
    debounceMs = 300,
  } = options

  const items = ref<T[]>([]) as Ref<T[]>
  const meta = ref<ListMeta | null>(null)
  const isLoading = ref(autoLoad)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const sortOption = ref(initialSort)
  const statusFilter = ref(initialStatus)
  const categoryId = ref<number | null>(null)
  const page = ref(1)
  const isDropdownOpen = ref(false)

  let requestId = 0
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const load = async () => {
    const currentId = ++requestId
    isLoading.value = true
    error.value = null

    const query: ListQuery = {
      page: page.value,
      per_page: perPage,
      sort: sortOption.value,
    }
    if (searchQuery.value.trim()) query.search = searchQuery.value.trim()
    if (statusFilter.value && statusFilter.value.toLowerCase() !== 'all') {
      query.status = statusFilter.value
    }
    if (categoryId.value != null) query.category_id = categoryId.value

    try {
      const result = await fetcher(query)
      if (currentId !== requestId) return // a newer request superseded this one

      items.value = result.items
      meta.value = result.meta

      // If filters shrank the set below the current page, snap back.
      if (result.meta && result.meta.last_page >= 1 && page.value > result.meta.last_page) {
        page.value = result.meta.last_page
        load()
      }
    } catch (err: any) {
      if (currentId !== requestId) return
      error.value = err?.data || err?.message || 'Terjadi kesalahan saat memuat data'
      items.value = []
      meta.value = null
    } finally {
      if (currentId === requestId) isLoading.value = false
    }
  }

  const resetAndLoad = () => {
    page.value = 1
    load()
  }

  watch(sortOption, resetAndLoad)
  watch(statusFilter, resetAndLoad)
  watch(categoryId, resetAndLoad)
  watch(searchQuery, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(resetAndLoad, debounceMs)
  })

  const setPage = (n: number) => {
    if (n < 1) return
    if (meta.value && n > meta.value.last_page) return
    if (n === page.value) return
    page.value = n
    load()
  }

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  const handleSortChange = (option: string) => {
    sortOption.value = option
    isDropdownOpen.value = false
  }

  const handleStatusFilter = (status: string | number) => {
    statusFilter.value = String(status)
  }

  const setCategory = (id: number | null) => {
    categoryId.value = id
  }

  const currentPage = computed(() => meta.value?.current_page ?? page.value)
  const maxPage = computed(() => meta.value?.last_page ?? 1)
  const total = computed(() => meta.value?.total ?? items.value.length)
  const counts = computed(() => meta.value?.counts ?? null)

  if (autoLoad) {
    onMounted(load)
  }

  return {
    items,
    meta,
    isLoading,
    error,
    searchQuery,
    sortOption,
    statusFilter,
    categoryId,
    page,
    isDropdownOpen,
    currentPage,
    maxPage,
    total,
    counts,
    load,
    setPage,
    setCategory,
    toggleDropdown,
    handleSortChange,
    handleStatusFilter,
  }
}
