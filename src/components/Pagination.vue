<template>
  <div v-if="maxPage > 1" class="flex justify-center items-center gap-8 mt-8 mb-8">
    <img
      src="../assets/icon/arrow-circle-left.svg"
      alt="Previous page"
      class="w-[54px] h-[54px] cursor-pointer sm:w-[40px] md:w-[54px]"
      @click="emit('page-change', currentPage - 1)"
    />
    <span
      v-for="(_, index) in maxPage"
      :key="index"
      :class="[
        'w-[24px] h-[24px] rounded-full cursor-pointer sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]',
        currentPage === index + 1 ? 'bg-[#027FFF]' : 'bg-gray-300'
      ]"
      @click="emit('page-change', index + 1)"
    ></span>
    <img
      src="../assets/icon/arrow-circle-right.svg"
      alt="Next page"
      class="w-[54px] h-[54px] cursor-pointer sm:w-[40px] md:w-[54px]"
      @click="emit('page-change', currentPage + 1)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  maxPage: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()
</script>
