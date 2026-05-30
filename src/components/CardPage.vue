<template>
  <div :class="containerClasses">
    <div :class="gridClasses">
      <template v-if="currentEvents.length > 0">
        <div v-for="event in currentEvents" :key="event.id" class="w-full flex justify-center">
          <Card :compact="compact" @click="handleCardClick(event.id)">
            <CardImage :compact="compact" :image="event.images && event.images.length > 0 ? event.images[0].path : null" />
            <CardBody :compact="compact" :title="event.title" :content="event.description" />
            <CardTanggal :compact="compact">{{ new Date(event.start_date).toLocaleDateString('id-ID') }}</CardTanggal>
          </Card>
        </div>
      </template>
      <p v-else>Belum ada acara unggulan saat ini.</p>
    </div>

    <div v-if="showPagination" class="flex justify-center items-center gap-3 mt-8 mb-8">
      <div class="flex justify-center items-center gap-8 mt-4">
        <img
          src="../assets/icon/arrow-circle-left.svg"
          alt="Previous page"
          class="w-[54px] h-[54px] cursor-pointer sm:w-[40px] md:w-[54px]"
          @click="prevPage"
        />
        <span
          v-for="(_, index) in effMaxPage"
          :key="index"
          :class="[
            'w-[24px] h-[24px] rounded-full cursor-pointer sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]',
            effCurrentPage === index + 1 ? 'bg-[#027FFF]' : 'bg-gray-300'
          ]"
          @click="goToPage(index + 1)"
        ></span>
        <img
          src="../assets/icon/arrow-circle-right.svg"
          alt="Next page"
          class="w-[54px] h-[54px] cursor-pointer sm:w-[40px] md:w-[54px]"
          @click="nextPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from './Card.vue'
import CardBody from './CardBody.vue'
import CardImage from './CardImage.vue'
import CardTanggal from './CardTanggal.vue'

import type { Event } from '../types'

interface Props {
  events: Event[]
  compact?: boolean
  eventsPerPage?: number
  serverPaginated?: boolean
  currentPage?: number
  maxPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  eventsPerPage: 6,
  serverPaginated: false,
  currentPage: 1,
  maxPage: 1,
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()
const router = useRouter()

const currentPage = ref(1)
const compact = computed(() => props.compact)
const eventsPerPage = computed(() => props.eventsPerPage)

const containerClasses = computed(() => [
  'relative z-10 w-full',
  props.compact ? 'max-w-[1160px] mx-auto' : '',
])

const gridClasses = computed(() => [
  props.compact
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-10 px-6 sm:px-10 lg:px-12'
    : 'flex flex-wrap justify-around px-14 gap-10',
])

const indexOfLastEvent = computed(() => currentPage.value * eventsPerPage.value)
const indexOfFirstEvent = computed(() => indexOfLastEvent.value - eventsPerPage.value)
const clientMaxPage = computed(() => Math.ceil(props.events.length / eventsPerPage.value))

const currentEvents = computed(() =>
  props.serverPaginated
    ? props.events
    : props.events.slice(indexOfFirstEvent.value, indexOfLastEvent.value),
)

const effCurrentPage = computed(() => (props.serverPaginated ? props.currentPage : currentPage.value))
const effMaxPage = computed(() => (props.serverPaginated ? props.maxPage : clientMaxPage.value))
const showPagination = computed(() =>
  props.serverPaginated ? props.maxPage > 1 : props.events.length > eventsPerPage.value,
)

// Client (legacy) mode resets to page 1 when the dataset changes; server mode
// owns the page externally so we leave it alone.
watch(() => props.events, () => {
  if (!props.serverPaginated) currentPage.value = 1
})

const goToPage = (page: number) => {
  if (props.serverPaginated) {
    if (page >= 1 && page <= props.maxPage) emit('page-change', page)
    return
  }
  currentPage.value = page
}

const nextPage = () => goToPage(effCurrentPage.value + 1)
const prevPage = () => goToPage(effCurrentPage.value - 1)

const handleCardClick = (id: number) => {
  router.push(`/events/${id}/view`)
}
</script>
