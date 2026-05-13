<template>
  <div class="flex gap-x-[16px] items-center pt-4 border-t border-gray-100 mt-auto">
    <div class="relative">
      <img 
        :src="`${storage}/${image}`" 
        :alt="`${nama}'s profile`" 
        class="w-[44px] h-[44px] rounded-full object-cover ring-2 ring-gray-100" 
      />
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-[15px] text-gray-800 truncate">{{ nama }}</p>
      <p class="font-normal text-[13px] text-gray-500 truncate">{{ title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image: string
  nama: string
  title: string
}

defineProps<Props>()

const storage = import.meta.env.VITE_STORAGE_BASE_URL
</script>
