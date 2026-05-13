<template>
  <button
    v-if="!to"
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
  <router-link
    v-else
    :to="to"
    :class="linkClasses"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantStyles = {
  primary: 'bg-[#027FFF] hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  outline: 'bg-transparent border border-[#027FFF] text-[#027FFF] hover:bg-blue-50',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
}

const sizeStyles = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg'
}

const baseStyles = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'

const buttonClasses = computed(() => [
  baseStyles,
  variantStyles[props.variant],
  sizeStyles[props.size],
  props.fullWidth ? 'w-full' : '',
  props.disabled ? 'opacity-50 cursor-not-allowed' : ''
])

const linkClasses = computed(() => [
  baseStyles,
  'inline-block text-center',
  variantStyles[props.variant],
  sizeStyles[props.size],
  props.fullWidth ? 'w-full' : ''
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
