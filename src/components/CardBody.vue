<template>
  <div :class="bodyClasses">
    <h1 :class="titleClasses">
      {{ truncatedTitle }}
    </h1>
    <p :class="contentClasses">
      {{ truncatedContent }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  content: string
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const truncateText = (text: string, maxWords: number): string => {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(' ')}...`
  }
  return text
}

const truncatedTitle = computed(() => truncateText(props.title, props.compact ? 5 : 4))
const truncatedContent = computed(() => truncateText(props.content, props.compact ? 10 : 12))

const bodyClasses = computed(() => [
  'w-full flex-grow',
  props.compact ? 'space-y-2' : 'max-w-[369px] space-y-3',
])

const titleClasses = computed(() => [
  'font-bold leading-tight text-gray-800 line-clamp-2',
  props.compact ? 'text-[22px]' : 'text-[24px]',
])

const contentClasses = computed(() => [
  'font-normal text-gray-600 leading-relaxed line-clamp-3',
  props.compact ? 'text-[14px]' : 'text-[15px]',
])
</script>
