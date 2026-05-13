<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <LoadingSpinner fullScreen />
  </div>

  <DescriptionPageRegistered v-else-if="status === 'registered'" />
  <DescriptionPageCancel v-else-if="status === 'cancelled'" />
  <DescriptionPageAbsent v-else-if="status === 'absent'" />
  <DescriptionPageAttend v-else-if="status === 'attended'" />

  <ErrorMessage v-else-if="error" :message="error" variant="error" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useEventStatus } from '../../composables/useEventDetail'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import DescriptionPageRegistered from './DescriptionPageRegistered.vue'
import DescriptionPageCancel from './DescriptionPageCancel.vue'
import DescriptionPageAbsent from './DescriptionPageAbsent.vue'
import DescriptionPageAttend from './DescriptionPageAttend.vue'

const route = useRoute()
const router = useRouter()
const { getToken, requireAuth } = useAuth()
const { status, isLoading, error, loadStatus } = useEventStatus()

onMounted(async () => {
  if (!requireAuth()) return

  const eventId = route.params.id as string
  const token = getToken()

  if (token) {
    await loadStatus(eventId, token)
  }
})
</script>
