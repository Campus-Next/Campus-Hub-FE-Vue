<template>
  <div class="event-status flex flex-wrap gap-8 sm:gap-12 lg:gap-16 py-4">
    <ul class="flex gap-8 sm:gap-12 lg:gap-16 w-full text-sm sm:text-base justify-center lg:justify-start lg:px-20">
      <li
        v-for="tab in tabs"
        :key="tab.value"
        :class="['cursor-pointer', activeTab === tab.value ? 'font-bold underline' : '']"
        @click="$emit('change', tab.value)"
      >
        {{ tab.label }} ({{ tab.count }})
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: Array<{ value: string | number; label: string; count: number }>
  activeTab: string | number
}>()

defineEmits<{
  change: [value: string | number]
}>()
</script>
