<template>
  <div class="flex gap-x-[4px] text-white">
    <p class="border bg-[#027FFF] rounded-[20px] p-[4px] w-[122px] text-[14px] justify-center flex">
      {{ kategori }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  kategori: string
}

defineProps<Props>()
</script>
