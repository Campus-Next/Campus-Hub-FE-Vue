<template>
  <div class="features flex flex-wrap items-center gap-3 mt-4 lg:mt-0 w-full sm:w-auto">
    <!-- Search field -->
    <div class="search group relative flex-1 min-w-[200px] sm:min-w-[280px] md:min-w-[360px]">
      <i
        class="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 transition-colors duration-200 group-focus-within:text-[#027FFF]"
      />
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-10 text-sm text-gray-700 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#027FFF] focus:outline-none focus:ring-2 focus:ring-[#027FFF]/20"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="modelValue"
        type="button"
        aria-label="Hapus pencarian"
        class="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        @click="$emit('update:modelValue', '')"
      >
        <i class="ri-close-line text-lg" />
      </button>
    </div>

    <!-- Sort dropdown -->
    <div ref="dropdownRef" class="sort relative shrink-0">
      <button
        type="button"
        class="dropdown-select flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#027FFF]/20"
        :class="{ 'border-[#027FFF] ring-2 ring-[#027FFF]/20': isOpen }"
        @click="$emit('toggle')"
      >
        <i class="ri-arrow-up-down-line text-base text-gray-400" />
        <span>{{ sortOption === 'date' ? 'By date' : 'A-Z' }}</span>
        <i
          class="ri-arrow-down-s-line text-base text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
      <transition
        enter-active-class="transition ease-out duration-150"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="isOpen"
          class="dropdown-menu absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#EAF4FF]"
            :class="sortOption === 'date' ? 'bg-[#EAF4FF] font-medium text-[#027FFF]' : 'text-gray-700'"
            @click="$emit('sort', 'date')"
          >
            By date
            <i v-if="sortOption === 'date'" class="ri-check-line text-base" />
          </button>
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#EAF4FF]"
            :class="sortOption === 'title' ? 'bg-[#EAF4FF] font-medium text-[#027FFF]' : 'text-gray-700'"
            @click="$emit('sort', 'title')"
          >
            A-Z
            <i v-if="sortOption === 'title'" class="ri-check-line text-base" />
          </button>
        </div>
      </transition>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
