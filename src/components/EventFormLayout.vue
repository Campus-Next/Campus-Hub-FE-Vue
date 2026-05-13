<template>
  <div class="grid lg:grid-cols-2 gap-12">
    <!-- Image Upload Section -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ step === 1 ? 'Gambar Acara' : 'Foto Pembicara' }}
      </h3>
      <div
        class="group border-3 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl h-80 flex flex-col items-center justify-center text-blue-600 transition-all duration-300 cursor-pointer bg-blue-50 hover:bg-blue-100"
        @drop="(e) => $emit('drop', e, step)"
        @dragover="$emit('dragover', $event)"
      >
        <label for="file-upload" class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
          <div v-if="preview" class="relative w-full h-full">
            <img :src="preview" alt="Preview" class="w-full h-full object-contain rounded-lg">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
              <span class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                Klik untuk mengganti
              </span>
            </div>
          </div>
          <div v-else class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors">
              <img :src="uploadIcon" alt="Upload" class="w-8 h-8">
            </div>
            <div class="space-y-2">
              <p class="text-lg font-medium">
                Drag & drop {{ step === 1 ? 'gambar acara' : 'foto pembicara' }} di sini
              </p>
              <p class="text-sm text-gray-500">
                atau <span class="text-blue-600 underline font-medium">pilih file</span>
              </p>
            </div>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".png, .jpg, .jpeg"
          class="hidden"
          @change="$emit('fileChange', $event)"
        >
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Format: PNG, JPG, JPEG</span>
        <span>Maksimal: 25MB</span>
      </div>
    </div>

    <!-- Form Section -->
    <div class="space-y-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">
        {{ step === 1 ? 'Informasi Acara' : 'Informasi Pembicara' }}
      </h3>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import uploadIcon from '../assets/image/upload.svg'

defineProps<{
  step: number
  preview?: string
}>()

defineEmits<{
  drop: [event: DragEvent, step: number]
  dragover: [event: DragEvent]
  fileChange: [event: Event]
}>()
</script>

