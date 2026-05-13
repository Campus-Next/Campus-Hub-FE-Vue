<template>
  <CategoryPageLayout
    title="Jelajahi Webinar"
    :is-loading="isLoading"
    :events="events"
    :error="error"
  />
</template>

<script setup lang="ts">
import CategoryPageLayout from '../../components/CategoryPageLayout.vue'
import { useCategoryPage } from '../../composables/useCategoryPage'

const { isLoading, events, error } = useCategoryPage('1')
</script>
