<template>
  <div class="relative z-10">
    <div class="flex flex-wrap justify-around px-14 gap-10">
      <template v-if="currentEvents.length > 0">
        <div v-for="event in currentEvents" :key="event.id" class="gap-y-[50px]">
          <Card @click="handleCardClick(event.id)">
            <CardImage :image="event.foto_event" />
            <CardKategori :kategori="event.category_name" />
            <CardBody :title="event.judul" :content="event.deskripsi" />
            <CardTanggal>{{ event.date }}</CardTanggal>
            <CardCreator :image="event.foto_pembicara" :nama="event.pembicara" :title="event.role" />
          </Card>
        </div>
      </template>
      <p v-else>Belum ada acara unggulan saat ini.</p>
    </div>

    <div v-if="events.length > eventsPerPage" class="flex justify-center items-center gap-3 mt-8 mb-8">
      <div class="flex justify-center items-center gap-8 mt-4">
        <img
          src="../assets/icon/arrow-circle-left.svg"
          alt="Previous page"
          class="w-[54px] h-[54px] cursor-pointer sm:w-[40px] md:w-[54px]"
          @click="prevPage"
        />
        <span
          v-for="(_, index) in maxPage"
          :key="index"
          :class="[
            'w-[24px] h-[24px] rounded-full cursor-pointer sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]',
            currentPage === index + 1 ? 'bg-[#027FFF]' : 'bg-gray-300'
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from './Card.vue'
import CardBody from './CardBody.vue'
import CardKategori from './CardKategori.vue'
import CardImage from './CardImage.vue'
import CardTanggal from './CardTanggal.vue'
import CardCreator from './CardCreator.vue'

interface Event {
  id: number
  foto_event: string
  category_name: string
  accessibility: string
  judul: string
  deskripsi: string
  date: string
  foto_pembicara: string
  pembicara: string
  role: string
}

interface Props {
  events: Event[]
}

const props = defineProps<Props>()
const router = useRouter()

const currentPage = ref(1)
const eventsPerPage = 6

const indexOfLastEvent = computed(() => currentPage.value * eventsPerPage)
const indexOfFirstEvent = computed(() => indexOfLastEvent.value - eventsPerPage)
const currentEvents = computed(() => props.events.slice(indexOfFirstEvent.value, indexOfLastEvent.value))
const maxPage = computed(() => Math.ceil(props.events.length / eventsPerPage))

const nextPage = () => {
  if (currentPage.value < maxPage.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const handleCardClick = (id: number) => {
  router.push(`/events/${id}/view`)
}
</script>
