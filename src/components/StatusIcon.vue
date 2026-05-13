<template>
  <div class="flex flex-col items-center" :class="animationClass">
    <div class="relative p-4 border-4 rounded-full animate-pulse" :class="borderColorClass">
      <svg class="h-24 w-24" :class="iconColorClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <span class="mt-4 font-medium text-[20px] text-center" :class="textColorClass">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'success' | 'error'
  message: string
}>()

const animationClass = computed(() => 
  props.type === 'success' ? 'animate__animated animate__jackInTheBox' : 'animate__animated animate__shakeX'
)

const borderColorClass = computed(() => 
  props.type === 'success' ? 'border-green-600' : 'border-red-600'
)

const iconColorClass = computed(() => 
  props.type === 'success' ? 'text-green-600' : 'text-red-600'
)

const textColorClass = computed(() => 
  props.type === 'success' ? 'text-green-500' : 'text-red-500'
)
</script>
