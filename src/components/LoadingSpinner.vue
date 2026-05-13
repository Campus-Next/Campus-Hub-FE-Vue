<template>
  <svg class="animate-spin h-5 w-5" :class="colorClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="M22 12a10 10 0 01-10 10" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  colorClass?: string
}>()
</script>
