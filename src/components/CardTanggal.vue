<template>
  <div :class="wrapperClasses">
    <img src="../assets/image/date.svg" alt="Date icon" :class="iconClasses" />
    <p :class="textClasses">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const wrapperClasses = computed(() => [
  'flex items-center gap-x-[8px] bg-gray-50 rounded-lg w-fit',
  props.compact ? 'px-2.5 py-1' : 'px-3 py-1.5',
])

const iconClasses = computed(() => [
  'opacity-80',
  props.compact ? 'w-4 h-4' : 'w-5 h-5',
])

const textClasses = computed(() => [
  'font-medium text-gray-700',
  props.compact ? 'text-[12px]' : 'text-[14px]',
])
</script>
