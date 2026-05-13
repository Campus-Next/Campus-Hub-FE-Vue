<template>
  <PopUpNotification
    :is-visible="isVisible"
    :message="message"
    :user="user"
    type="success"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
import PopUpNotification from './PopUpNotification.vue'

interface Props {
  isVisible: boolean
  message: string
  user?: string
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>
