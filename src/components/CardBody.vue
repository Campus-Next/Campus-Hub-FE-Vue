<template>
  <div class="w-full max-w-[369px] space-y-3 flex-grow">
    <h1 class="font-bold text-[24px] leading-tight text-gray-800 line-clamp-2">
      {{ truncatedTitle }}
    </h1>
    <p class="text-[15px] font-normal text-gray-600 leading-relaxed line-clamp-3">
      {{ truncatedContent }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  content: string
}

const props = defineProps<Props>()

const truncateText = (text: string, maxWords: number): string => {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(' ')}...`
  }
  return text
}

const truncatedTitle = computed(() => truncateText(props.title, 4))
const truncatedContent = computed(() => truncateText(props.content, 12))
</script>
