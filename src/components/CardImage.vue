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
import { resolveStorageUrl } from '../utils/helpers'

interface Props {
  image?: string | null
}

const props = defineProps<Props>()

const imageUrl = computed(() => {
  if (!props.image) {
    return defaultPoster
  }
  return resolveStorageUrl(props.image)
})
</script>
