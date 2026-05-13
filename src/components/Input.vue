<template>
  <div :class="['w-full', containerClass]">
    <label v-if="label" :for="id" class="block mb-2 text-[20px] font-medium text-[#003266]">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="computedType"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full h-[59px] px-4 py-2 border-2 border-[#003266] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
          showPasswordToggle ? 'pr-12' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed' : '',
          inputClass
        ]"
        @input="handleInput"
      >
      <span
        v-if="showPasswordToggle"
        class="absolute inset-y-0 right-4 flex items-center cursor-pointer text-[#003266]"
        @click="togglePassword"
      >
        <i :class="showPasswordValue ? 'ri-eye-line text-2xl' : 'ri-eye-close-line text-2xl'" />
      </span>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-2">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  id?: string
  label?: string
  type?: string
  name?: string
  modelValue?: string | number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  showPasswordToggle?: boolean
  containerClass?: string
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  showPasswordToggle: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPasswordValue = ref(false)

const computedType = computed(() => {
  if (props.showPasswordToggle) {
    return showPasswordValue.value ? 'text' : 'password'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  showPasswordValue.value = !showPasswordValue.value
}
</script>
