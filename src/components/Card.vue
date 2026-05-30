<template>
  <div
    :class="cardClasses"
    @click="$emit('click')"
  >
    <div :class="contentClasses">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

defineEmits<{
  click: []
}>()

const cardClasses = computed(() => [
  'border border-gray-200 rounded-[20px] bg-white text-[#003266] shadow-md hover:shadow-xl cursor-pointer flex flex-col transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden',
  props.compact
    ? 'w-full max-w-[340px] h-[430px]'
    : 'max-w-[420px] h-[580px]',
])

const contentClasses = computed(() => [
  'flex flex-col h-full',
  props.compact ? 'p-5 gap-y-3.5' : 'p-[24px] gap-y-4',
])
</script>
