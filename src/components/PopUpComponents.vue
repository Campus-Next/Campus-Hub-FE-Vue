<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div :class="`bg-white rounded-lg shadow-xl ${maxWidth} w-full mx-4`">
        <div class="p-6">
          <h2 v-if="title" class="text-xl font-semibold mb-4 text-center">{{ title }}</h2>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  maxWidth?: string
}>()
</script>
