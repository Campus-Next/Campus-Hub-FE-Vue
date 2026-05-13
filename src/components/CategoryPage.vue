<template>
  <div class="font-sans flex flex-col box-border w-full">
    <Navbar />

    <div class="font-sans flex flex-col box-border mx-auto w-full">
      <div class="bg-[#EAF4FF] border-transparent rounded-t-[100px] flex flex-col items-center justify-center">
        <h1 class="font-semibold text-[#003266] mt-[80px] mb-[80px] flex sm:text-[32px] md:text-[48px]">
          {{ title }}
        </h1>
        <div class="flex flex-wrap justify-center mb-[80px]">
          <LoadingSpinner v-if="isLoading" fullScreen />
          <ErrorMessage v-else-if="error" :message="error" />
          <CardPage v-else :events="events" />
          <div class="relative">
            <img
              src="../assets/image/circle6.svg"
              alt="Circle dekorasi"
              class="absolute left-0 top-[1300px]"
            />
          </div>
        </div>
      </div>
    </div>

    <div id="aboutus">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import CardPage from '../components/CardPage.vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

interface Props {
  categoryId: string
  title: string
}

const props = defineProps<Props>()

const { checkAdminAccess } = useAuth()
const { events, isLoading, error, loadEvents } = useEvents()

onMounted(async () => {
  window.scrollTo(0, 0)
  
  if (!checkAdminAccess()) return
  
  await loadEvents(props.categoryId)
})
</script>
