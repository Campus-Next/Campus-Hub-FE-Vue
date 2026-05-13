<template>
  <AuthLayout title="Selamat Datang!">
    <div class="w-full flex flex-col max-w-[250px] lg:max-w-[420px] sm:max-w-[282px] items-center">
      <form class="w-full flex flex-col items-center" @submit.prevent="handleLogin">
        <Input
          id="email"
          v-model="email"
          label="Alamat email"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          required
          container-class="mb-6 w-full"
        />

        <Input
          id="password"
          v-model="password"
          label="Password"
          name="password"
          placeholder="Enter your password here"
          required
          show-password-toggle
          container-class="mb-6 w-full"
        />

        <div class="flex items-center justify-between w-full mb-6">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              name="remember"
              class="w-4 h-4 text-[#003266] border-[#003266] rounded focus:ring-blue-500 transition-all duration-200"
            >
            <label for="remember" class="ml-2 text-sm text-[#003266]">
              Ingat saya
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-[#003266] hover:underline transition-all duration-200">
              Lupa password?
            </a>
          </div>
        </div>

        <div class="w-full">
          <button
            type="submit"
            :disabled="!isFormValid"
            :class="[
              'w-full px-[24px] py-[16px] text-[20px] font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105',
              isFormValid ? 'bg-[#003266] hover:bg-[#002855] focus:ring-[#003266] active:scale-95' : 'bg-[#A2A2A2] cursor-not-allowed'
            ]"
          >
            <LoadingSpinner v-if="isLoading" color-class="text-gray-500" />
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
    </div>

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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import Input from '../../components/Input.vue'
import PopUpNotification from '../../components/PopUpNotification.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { loginAdmin, fetchUserProfile } from '../../services/api'
import { useLoginForm } from '../../composables/useAuthForm'

const router = useRouter()

const {
  email,
  password,
  remember,
  isLoading,
  showGagal,
  message,
  redirectPath,
  isFormValid
} = useLoginForm()

const handleLogin = async () => {
  if (isFormValid.value) {
    try {
      isLoading.value = true
      const data = await loginAdmin({ 
        email: email.value, 
        password: password.value, 
        remember: remember.value 
      })
      
      message.value = data.message

      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('token_type', data.token_type)
      }

      try {
        const userData = await fetchUserProfile(data.access_token)
        localStorage.setItem('user', JSON.stringify(userData))
      } finally {
        setTimeout(() => {
          window.location.href = redirectPath
        }, 200)
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
      }
    } catch (error: any) {
      message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
      showGagal.value = true
      isLoading.value = false
    }
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.replace('/')
  }
})
</script>
