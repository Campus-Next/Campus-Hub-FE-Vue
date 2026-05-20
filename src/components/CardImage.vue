<template>
  <div class="relative overflow-hidden rounded-[16px] group">
    <img
      :src="imageUrl"
      alt="Event image"
      class="w-[372px] h-[232px] object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import defaultPoster from '../assets/image/Poster.svg'

interface Props {
  image?: string | null
}

const props = defineProps<Props>()

const storage = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage'

const imageUrl = computed(() => {
  if (!props.image) {
    return defaultPoster
  }
  if (props.image.startsWith('http://') || props.image.startsWith('https://')) {
    return props.image
  }
  return `${storage}/${props.image}`
})
</script>
