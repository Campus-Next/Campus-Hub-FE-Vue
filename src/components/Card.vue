<template>
  <div
    class="border border-gray-200 rounded-[20px] bg-white max-w-[420px] h-[580px] text-[#003266] shadow-md hover:shadow-xl cursor-pointer flex flex-col transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
    @click="$emit('click')"
  >
    <div class="p-[24px] flex flex-col h-full gap-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>
