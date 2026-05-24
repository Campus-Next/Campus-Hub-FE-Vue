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
            <EventPreview
              v-if="step === 3"
              :event-data="{ title, description, start_date, end_date, location, max_participants, isOffline }"
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

            <EventFormLayout
              v-else
              :step="step"
            >
              <div v-if="step === 1" class="space-y-6">
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
                      v-model="start_date"
                      type="datetime-local"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                  <div class="space-y-2">
                    <label :class="labelClasses">Waktu Berakhir *</label>
                    <input
                      v-model="end_date"
                      type="datetime-local"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                </div>

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

              <div v-else class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label :class="labelClasses">Jumlah Tiket / Kapasitas *</label>
                    <input
                      v-model="max_participants"
                      type="number"
                      placeholder="Masukkan jumlah tiket"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                  <div class="space-y-2">
                    <label :class="labelClasses">Biaya Pendaftaran (0 = Gratis) *</label>
                    <input
                      v-model="registration_fee"
                      type="number"
                      placeholder="Contoh: 50000"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label :class="labelClasses">Pendaftaran Buka *</label>
                    <input
                      v-model="registration_open"
                      type="date"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                  <div class="space-y-2">
                    <label :class="labelClasses">Pendaftaran Tutup *</label>
                    <input
                      v-model="registration_deadline"
                      type="date"
                      :class="`${inputClasses} w-full`"
                      required
                    >
                  </div>
                </div>

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
                      <span class="text-gray-700 group-hover:text-blue-600 transition-colors">
                        🌐 Online
                      </span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input
                        v-model="isOffline"
                        type="radio"
                        name="eventType"
                        :value="true"
                        class="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                      >
                      <span class="text-gray-700 group-hover:text-blue-600 transition-colors">
                        📍 Offline
                      </span>
                    </label>
                  </div>
                </div>

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
              </div>

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
                  :class="(step === 1 && isFormValid) || (step === 2 && isSecondStepValid) ? buttonPrimaryClasses : 'bg-gray-400 text-white py-3 px-8 rounded-lg cursor-not-allowed'"
                  :disabled="(step === 1 && !isFormValid) || (step === 2 && !isSecondStepValid)"
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import PopUpGagal from '../../components/PopUpGagal.vue'
import StepIndicator from '../../components/StepIndicator.vue'
import EventFormLayout from '../../components/EventFormLayout.vue'
import EventPreview from '../../components/EventPreview.vue'
import { fetchCategories, fetchEventDetails, updateEvent } from '../../services/api'
import { useEventForm } from '../../composables/useEventForm'
import { useAuthCheck } from '../../composables/useAuthCheck'
import type { Category } from '../../types'

const router = useRouter()
const route = useRoute()
const step = ref(route.state?.step || 1)
const isPopupVisible = ref(false)
const popupMessage = ref('')
const isLoading = ref(false)
const categories = ref<Category[]>([])

useAuthCheck(true)

const {
  title,
  description,
  start_date,
  end_date,
  max_participants,
  registration_fee,
  registration_open,
  registration_deadline,
  location,
  isOffline,
  category_id,
  isFormValid,
  isSecondStepValid,
  getFormData,
  setFormData
} = useEventForm()

const inputClasses = 'border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 transition-all duration-200 outline-none'
const labelClasses = 'text-lg font-semibold text-gray-700 min-w-[120px]'
const buttonPrimaryClasses = 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg'
const buttonSecondaryClasses = 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200'

const setStep = (newStep: number) => {
  step.value = newStep
}

const handleNext = () => {
  if (step.value === 1) step.value = 2
  else if (step.value === 2) step.value = 3
}

const handleBack = () => {
  if (step.value === 2) step.value = 1
  else if (step.value === 3) step.value = 2
}

const handleUpdate = async () => {
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    const formData = getFormData()
    
    await updateEvent(Number(route.params.id), formData, token!)
    router.push('/my-events')
  } catch (error: any) {
    popupMessage.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
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
      const data = await fetchEventDetails(Number(route.params.id))
      setFormData(data)
    } catch (error) {
      popupMessage.value = 'Terjadi kesalahan saat memuat data event. Silakan coba lagi.'
      isPopupVisible.value = true
      console.error('Error fetching event details:', error)
    }
  }
})
</script>
