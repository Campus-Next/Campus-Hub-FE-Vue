<template>
  <div class="flex justify-center items-center mt-8 space-x-4">
    <template v-for="(stepNum, index) in steps" :key="stepNum">
      <button
        :disabled="!canNavigate(stepNum)"
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200',
          currentStep >= stepNum ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300',
          canNavigate(stepNum) ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-70'
        ]"
        @click="canNavigate(stepNum) && $emit('change', stepNum)"
      >
        {{ stepNum }}
      </button>
      <div
        v-if="index < steps.length - 1"
        :key="`line-${stepNum}`"
        :class="[
          'w-16 h-1 rounded transition-colors duration-200',
          currentStep > stepNum ? 'bg-blue-500' : 'bg-gray-300'
        ]"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStep: number
  steps: number[]
  validations: boolean[]
}>()

defineEmits<{
  change: [step: number]
}>()

const canNavigate = (step: number) => {
  if (step === 1) return true
  if (step === 2) return props.validations[0]
  if (step === 3) return props.validations[0] && props.validations[1]
  return false
}
</script>
