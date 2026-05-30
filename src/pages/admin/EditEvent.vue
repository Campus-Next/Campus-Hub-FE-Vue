<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto my-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            {{ step === 1 ? 'Edit Acara' : step === 2 ? 'Detail Pendaftaran & Lokasi' : 'Preview Perubahan' }}
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Perbarui kelengkapan acara Anda dengan detail yang menarik
          </p>

          <StepIndicator
            :current-step="step"
            :steps="[1, 2, 3]"
            :validations="[isFormValid, isSecondStepValid]"
            @change="setStep"
          />
        </div>
      </div>

      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="p-8 lg:p-12">

            <!-- ── Section 3: Preview ─────────────────────────────────── -->
            <EventPreview
              v-if="step === 3"
              :event-data="{
                title,
                description,
                start_date_date,
                start_date_time,
                end_date_date,
                end_date_time,
                location,
                max_participants,
                isOffline,
                imagePreviewUrl,
                event_links: getCleanEventLinks(),
              }"
            >
              <template #actions>
                <button :class="buttonSecondaryClasses" @click="handleBack">
                  Kembali
                </button>
                <button
                  class="bg-green-500 hover:bg-green-600 font-semibold py-3 px-8 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isLoading"
                  @click="handleUpdate"
                >
                  {{ isLoading ? 'Mengupdate...' : 'Update Event' }}
                </button>
              </template>
            </EventPreview>

            <EventFormLayout v-else :step="step">

              <!-- ── Section 1: Info Acara ─────────────────────────────── -->
              <div v-if="step === 1" class="space-y-6">

                <!-- Image Upload -->
                <div class="space-y-2">
                  <label :class="labelClasses">Poster / Gambar Acara</label>
                  <div
                    class="relative border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden"
                    :class="imagePreviewUrl
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'"
                    @dragover.prevent
                    @drop.prevent="onDrop"
                  >
                    <!-- Preview -->
                    <div v-if="imagePreviewUrl" class="relative group">
                      <img
                        :src="imagePreviewUrl"
                        alt="Preview Poster"
                        class="w-full max-h-64 object-cover rounded-xl"
                      >
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <button
                          type="button"
                          class="bg-white text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                          @click="clearImage"
                        >
                          <i class="ri-delete-bin-line mr-2" />Ganti Gambar
                        </button>
                      </div>
                    </div>

                    <!-- Drop zone -->
                    <label v-else class="flex flex-col items-center justify-center py-12 cursor-pointer">
                      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <i class="ri-image-add-line text-3xl text-blue-500" />
                      </div>
                      <p class="text-gray-700 font-semibold mb-1">Klik untuk upload atau drag & drop</p>
                      <p class="text-gray-400 text-sm">JPEG, PNG, WebP — Maks. 5 MB</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        class="hidden"
                        @change="onFileChange"
                      >
                    </label>
                  </div>
                </div>

                <!-- Title -->
                <div class="space-y-2">
                  <label :class="labelClasses">Judul Acara *</label>
                  <input
                    v-model="title"
                    type="text"
                    placeholder="Masukkan judul acara yang menarik"
                    :class="`${inputClasses} w-full`"
                    required
                  >
                </div>

                <div class="space-y-2">
                  <label :class="labelClasses">Kategori</label>
                  <select
                    v-model="category_id"
                    :class="`${inputClasses} w-full bg-white`"
                  >
                    <option value="">Pilih kategori</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="String(category.id)"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label :class="labelClasses">Waktu Mulai *</label>
                    <input
                      v-model="start_date_date"
                      type="date"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                    <input
                      v-model="start_date_time"
                      type="time"
                      :class="`${inputClasses} w-full cursor-pointer`"
                      required
                    >
                  </div>
                </div>

                <!-- End Date & Time -->
                <div class="space-y-2">
                  <label :class="labelClasses">Waktu Berakhir *</label>
                  <div class="grid grid-cols-2 gap-4">
                    <input
                      v-model="end_date_date"
                      type="date"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                    <input
                      v-model="end_date_time"
                      type="time"
                      :class="`${inputClasses} w-full cursor-pointer`"
                      required
                    >
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <label :class="labelClasses">Deskripsi *</label>
                  <textarea
                    v-model="description"
                    placeholder="Tulis deskripsi acara yang detail dan menarik..."
                    rows="5"
                    :class="`${inputClasses} w-full resize-none`"
                    required
                  />
                </div>
              </div>

              <!-- ── Section 2: Detail & Lokasi ───────────────────────── -->
              <div v-else class="space-y-6">

                <!-- Kapasitas -->
                <div class="space-y-2">
                  <label :class="labelClasses">Kapasitas Peserta *</label>
                  <input
                    v-model="max_participants"
                    type="number"
                    min="1"
                    placeholder="Masukkan jumlah maksimum peserta"
                    :class="`${inputClasses} w-full`"
                    required
                  >
                </div>

                <!-- Pendaftaran open/close -->
                <div class="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
                  <i class="ri-information-line text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Aturan waktu pendaftaran:</strong>
                    Pendaftaran harus <em>ditutup</em> paling lambat saat acara dimulai
                    ({{ eventStartDateTime || '-' }}).
                  </span>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label :class="labelClasses">Pendaftaran Buka *</label>
                    <input
                      v-model="registration_open"
                      type="datetime-local"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                  <div class="space-y-1">
                    <label :class="labelClasses">Pendaftaran Tutup *</label>
                    <input
                      v-model="registration_deadline"
                      type="datetime-local"
                      :min="registration_open || undefined"
                      :max="eventStartDateTime || undefined"
                      :class="[
                        inputClasses,
                        'w-full',
                        dateErrors.registration_deadline ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''
                      ]"
                      required
                    >
                    <!-- Inline error -->
                    <p v-if="dateErrors.registration_deadline" class="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <i class="ri-error-warning-line" />
                      {{ dateErrors.registration_deadline }}
                    </p>
                  </div>
                </div>

                <!-- Tipe Acara -->
                <div class="space-y-4">
                  <label :class="labelClasses">Tipe Acara *</label>
                  <div class="flex gap-8">
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input
                        v-model="isOffline"
                        type="radio"
                        name="eventType"
                        :value="false"
                        class="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                      >
                      <span class="text-gray-700 group-hover:text-blue-600 transition-colors">🌐 Online</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input
                        v-model="isOffline"
                        type="radio"
                        name="eventType"
                        :value="true"
                        class="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                      >
                      <span class="text-gray-700 group-hover:text-blue-600 transition-colors">📍 Offline</span>
                    </label>
                  </div>
                </div>

                <!-- Lokasi (only for offline) -->
                <div v-if="isOffline" class="space-y-2">
                  <label :class="labelClasses">Lokasi *</label>
                  <input
                    v-model="location"
                    type="text"
                    placeholder="Masukkan alamat lengkap lokasi acara"
                    :class="`${inputClasses} w-full`"
                    required
                  >
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-4">
                    <label :class="labelClasses">Link Acara</label>
                    <button
                      type="button"
                      class="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                      @click="addEventLink"
                    >
                      <i class="ri-add-line mr-1" />Tambah Link
                    </button>
                  </div>
                  <div v-if="eventLinks.length === 0" class="text-sm text-gray-500">
                    Tambahkan Google Form, media sosial, atau tautan informasi acara jika diperlukan.
                  </div>
                  <div v-for="(link, index) in eventLinks" :key="link.id ?? index" class="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] gap-3">
                    <input
                      v-model="link.title"
                      type="text"
                      maxlength="255"
                      placeholder="Judul link"
                      :class="[inputClasses, 'w-full min-w-0', eventLinkErrors[index] ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : '']"
                    >
                    <input
                      v-model="link.url"
                      type="url"
                      maxlength="255"
                      placeholder="https://example.com"
                      :class="[inputClasses, 'w-full min-w-0', eventLinkErrors[index] ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : '']"
                    >
                    <button
                      type="button"
                      class="border border-red-200 text-red-600 rounded-lg w-11 h-11 hover:bg-red-50 transition flex items-center justify-center"
                      aria-label="Hapus link"
                      @click="removeEventLink(index)"
                    >
                      <i class="ri-delete-bin-line text-lg" />
                    </button>
                    <p v-if="eventLinkErrors[index]" class="md:col-span-3 text-sm text-red-600 flex items-center gap-1 -mt-1">
                      <i class="ri-error-warning-line" />
                      {{ eventLinkErrors[index] }}
                    </p>
                  </div>
                  <p v-if="!isLinksValid" class="text-sm text-red-600">
                    Setiap link harus memiliki judul dan URL valid yang diawali http:// atau https://.
                  </p>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  :class="buttonSecondaryClasses"
                  @click="step === 1 ? router.push('/my-events') : handleBack()"
                >
                  {{ step === 1 ? 'Batal' : 'Kembali' }}
                </button>
                <button
                  type="button"
                  :class="canGoNext ? buttonPrimaryClasses : 'bg-gray-400 text-white py-3 px-8 rounded-lg cursor-not-allowed'"
                  :disabled="!canGoNext"
                  @click="handleNext"
                >
                  {{ step === 1 ? 'Lanjut' : 'Preview' }}
                </button>
              </div>
            </EventFormLayout>
          </div>
        </div>
      </div>
    </div>

    <PopUpGagal
      v-if="isPopupVisible"
      :is-visible="isPopupVisible"
      :message="popupMessage"
      @close="isPopupVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import PopUpGagal from '../../components/PopUpGagal.vue'
import StepIndicator from '../../components/StepIndicator.vue'
import EventFormLayout from '../../components/EventFormLayout.vue'
import EventPreview from '../../components/EventPreview.vue'
import {
  createEventLink,
  deleteEventLink,
  fetchCategories,
  fetchEvent,
  updateEvent,
  updateEventLink,
} from '../../services/api'
import { useEventForm } from '../../composables/useEventForm'
import { useAuthCheck } from '../../composables/useAuthCheck'
import type { Category } from '../../types'

const router = useRouter()
const route  = useRoute()
const step   = ref((route.state as any)?.step || 1)
const isPopupVisible = ref(false)
const popupMessage = ref('')
const isLoading = ref(false)
const categories = ref<Category[]>([])

useAuthCheck(true)

const {
  title,
  description,
  category_id,
  start_date_date,
  start_date_time,
  end_date_date,
  end_date_time,
  max_participants,
  registration_open,
  registration_deadline,
  location,
  isOffline,
  imagePreviewUrl,
  isFormValid,
  isSecondStepValid,
  isFormComplete,
  isLinksValid,
  removedLinkIds,
  eventStartDateTime,
  dateErrors,
  getFormData,
  getCleanEventLinks,
  setFormData,
  handleImageSelect,
  clearImage,
  cleanupImagePreview,
  addEventLink,
  removeEventLink,
} = useEventForm()

const inputClasses          = 'border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 transition-all duration-200 outline-none'
const labelClasses          = 'text-lg font-semibold text-gray-700'
const buttonPrimaryClasses  = 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg'
const buttonSecondaryClasses = 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200'

const canGoNext = computed(() => step.value === 1 ? isFormValid.value : isFormComplete.value)

const setStep = (newStep: number) => { step.value = newStep }
const handleNext = () => { if (step.value < 3) step.value++ }
const handleBack = () => { if (step.value > 1) step.value-- }

// File handlers
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleImageSelect(file)
}
const onDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) handleImageSelect(file)
}

const handleUpdate = async () => {
  isLoading.value = true
  try {
    const token    = localStorage.getItem('token')
    const formData = getFormData()
    const eventId = Number(route.params.id)
    await updateEvent(eventId, formData, token!)
    const links = getCleanEventLinks()
    await Promise.all([
      ...links.map(link => link.id
        ? updateEventLink(eventId, link.id, { title: link.title, url: link.url }, token!)
        : createEventLink(eventId, { title: link.title, url: link.url }, token!)),
      ...removedLinkIds.value.map(linkId => deleteEventLink(eventId, linkId, token!)),
    ])
    router.push('/my-events')
  } catch (error: any) {
    popupMessage.value  = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
    isPopupVisible.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  fetchCategories()
    .then((data) => {
      categories.value = Array.isArray(data) ? data : []
    })
    .catch(() => {
      categories.value = []
    })

  if (route.state?.data) {
    setFormData(route.state.data)
  } else {
    try {
      const data = await fetchEvent(Number(route.params.id))
      setFormData(data)
    } catch (error) {
      popupMessage.value  = 'Terjadi kesalahan saat memuat data event. Silakan coba lagi.'
      isPopupVisible.value = true
      console.error('Error fetching event details:', error)
    }
  }
})

onUnmounted(cleanupImagePreview)
</script>
