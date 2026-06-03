<template>
  <div v-if="displayName" class="event-attachment mt-6">
    <h3 class="font-semibold text-[18px] mb-3 text-[#003266]">Dokumen Acara</h3>
    <component
      :is="href ? 'a' : 'div'"
      :href="href || undefined"
      target="_blank"
      rel="noopener noreferrer"
      :title="displayName"
      class="flex min-h-[68px] max-w-[486px] min-w-0 items-center gap-3 p-3 rounded-lg border border-[#027FFF] bg-blue-50 hover:bg-blue-100 transition-colors"
    >
      <i class="ri-file-text-line text-[#027FFF] text-xl flex-shrink-0" />
      <span class="event-attachment-title min-w-0 font-medium text-[#003266] text-[14px]">
        {{ displayName }}
      </span>
      <i v-if="href" class="ri-download-line text-[#027FFF] text-xl flex-shrink-0 ml-auto" />
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveStorageFileUrl } from '../utils/helpers'

const props = defineProps<{
  name?: string | null
  path?: string | null
  url?: string | null
}>()

const displayName = computed(() => props.name || props.path?.split('/').pop() || '')
const href = computed(() => props.url || resolveStorageFileUrl(props.path || ''))
</script>

<style scoped>
.event-attachment-title {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
