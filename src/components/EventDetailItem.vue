<template>
  <div class="detail-item flex items-start gap-3">
    <div class="icon-wrapper flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
      <img :src="iconSrc" :alt="label" class="w-5 h-5 object-contain" />
    </div>
    <div class="detail-content">
      <p class="text-sm text-gray-500 font-medium">{{ label }}</p>
      <p class="font-semibold text-[16px] sm:text-[14px] text-gray-800">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  label: string
  value: string
}

const props = defineProps<Props>()

const iconSrc = computed(() => {
  return new URL(`../../assets/image/${props.icon}`, import.meta.url).href
})
</script>
