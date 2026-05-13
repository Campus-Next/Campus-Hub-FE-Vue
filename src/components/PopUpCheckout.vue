<template>
  <PopUpNotification
    :is-visible="isVisible"
    :message="message"
    type="success"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
import PopUpNotification from './PopUpNotification.vue'

interface Props {
  isVisible: boolean
  message: string
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>
