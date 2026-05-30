<template>
  <AuthLayout title="Daftar Sekarang!" subtitle="Buat akun anda di Campus Hub">
    <div class="w-full flex flex-col max-w-[280px] lg:max-w-[480px] sm:max-w-[320px] items-center">
      <form class="w-full flex flex-col items-center" @submit.prevent="handleSubmit">
        <Input
          id="nama"
          v-model="formData.nama"
          label="Nama"
          type="text"
          name="nama"
          placeholder="Your Name"
          required
          container-class="mb-4 w-full"
        />

        <Input
          id="email"
          v-model="formData.email"
          label="Alamat email"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          required
          container-class="mb-4 w-full"
        />

        <Input
          id="password"
          v-model="formData.password"
          label="Password"
          name="password"
          placeholder="Enter your password here"
          required
          show-password-toggle
          container-class="mb-4 w-full"
        />

        <div class="w-full">
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            :class="[
              'w-full px-[24px] py-[16px] text-[20px] font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center',
              isFormValid ? 'bg-[#003266] hover:bg-blue-800 focus:ring-[#003266]' : 'bg-[#A2A2A2] cursor-not-allowed'
            ]"
          >
            <LoadingSpinner v-if="isLoading" color-class="text-white" />
            <span v-else>Daftar</span>
          </button>
        </div>
      </form>

      <p class="text-[#003266] font-normal text-[16px] mt-4 w-full text-center">
        Sudah punya akun?
        <RouterLink :to="`/user/login?redirect=${redirectQuery}`" class="text-[#027FFF] hover:underline ml-1">
          Masuk
        </RouterLink>
      </p>
    </div>

    <PopUpNotification
      v-if="showPopup"
      :is-visible="showPopup"
      :message="message"
      type="success"
      @close="showPopup = false"
    />
    <PopUpNotification
      v-if="showGagal"
      :is-visible="showGagal"
      :message="message"
      type="error"
      @close="showGagal = false"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import Input from '../../components/Input.vue'
import PopUpNotification from '../../components/PopUpNotification.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { register } from '../../services/api'
import { useRegisterForm } from '../../composables/useAuthForm'
import { isAuthenticated } from '../../utils/authSession'

const router = useRouter()

const {
  formData,
  isLoading,
  showPopup,
  showGagal,
  message,
  redirectPath,
  redirectQuery,
  isFormValid,
} = useRegisterForm()

const showErrorPopup = async (text: string) => {
  message.value = text
  showGagal.value = false
  await nextTick()
  showGagal.value = true
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const userData = {
      name: formData.value.nama,
      email: formData.value.email,
      password: formData.value.password,
    }

    await register(userData)
    message.value = 'Registrasi berhasil!'
    showPopup.value = true

    setTimeout(() => {
      router.push(`/user/login?redirect=${redirectQuery}`)
    }, 1000)
  } catch (error: any) {
    await showErrorPopup(error.data || 'Koneksi Timeout, Silahkan Coba Lagi')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (isAuthenticated()) {
    router.replace('/')
  }
})
</script>
