<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
    <h1 class="text-4xl font-bold text-red-500">Oops!</h1>
    <p class="text-lg text-gray-700">Sorry, an unexpected error has occurred.</p>
    <p v-if="error?.statusText || error?.message" class="text-gray-500 mt-4">
      <i>{{ error.statusText || error.message }}</i>
    </p>
    <a
      href="/"
      class="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Back to Home
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const error = route.meta.error as { statusText?: string; message?: string } | undefined
</script>
