<template>
  <div class="relative overflow-hidden rounded-[16px] group">
    <img
      :src="imageUrl"
      alt="Event image"
      :class="imageClasses"
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
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const imageUrl = computed(() => {
  if (!props.image) {
    return defaultPoster
  }
  return resolveStorageUrl(props.image)
})

const imageClasses = computed(() => [
  'w-full object-cover transition-transform duration-300 group-hover:scale-105',
  props.compact ? 'h-[178px]' : 'h-[232px]',
])
</script>
