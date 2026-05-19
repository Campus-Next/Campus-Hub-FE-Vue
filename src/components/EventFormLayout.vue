<template>
  <div class="space-y-6">
    <!-- Form Section -->
    <h3 class="text-xl font-semibold text-gray-800 mb-6">
      {{ step === 1 ? 'Informasi Acara' : 'Detail Pendaftaran & Lokasi' }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  step: number
}>()
</script>
