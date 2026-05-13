<template>
  <div class="features flex flex-wrap gap-4 items-center mt-4 lg:mt-0 w-full sm:w-auto">
    <div class="search flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-4 py-2 border border-gray-300 rounded-lg flex items-center">
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="focus:outline-none w-full"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
    <div ref="dropdownRef" class="sort relative sm:max-w-[200px] lg:max-w-[150px]">
      <div class="dropdown-select flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer" @click="$emit('toggle')">
        <span class="text-sm sm:text-base">
          {{ sortOption === 'date' ? 'By date' : 'A-Z' }}
        </span>
        <img :src="MenuIcon" alt="menu" class="dropdown-icon">
      </div>
      <div v-if="isOpen" class="dropdown-menu absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md w-full z-10">
        <ul>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="$emit('sort', 'date')">
            By date
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="$emit('sort', 'title')">
            A-Z
          </li>
        </ul>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuIcon from '../assets/image/menu.svg'

defineProps<{
  modelValue: string
  sortOption: string
  isOpen: boolean
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  toggle: []
  sort: [option: string]
}>()

const dropdownRef = ref<HTMLElement | null>(null)
</script>
