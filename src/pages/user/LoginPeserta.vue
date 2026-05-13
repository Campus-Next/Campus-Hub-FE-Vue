<template>
  <AuthLayout title="Selamat Datang!">
    <div class="w-full flex flex-col max-w-[280px] lg:max-w-[480px] sm:max-w-[320px] items-center">
      <p class="text-[#003266] font-normal text-[18px] mb-6 w-full">
        Tidak punya akun?
        <a :href="`/user/register?redirect=${redirectPath}`" class="text-[#027FFF] hover:underline ml-1">
          Daftar
        </a>
      </p>

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
              'w-full px-[24px] py-[16px] text-[20px] font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300',
              isFormValid ? 'bg-[#003266] hover:bg-[#002855] focus:ring-[#003266]' : 'bg-[#A2A2A2] cursor-not-allowed'
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
import { jwtDecode } from 'jwt-decode'
import AuthLayout from '../../components/AuthLayout.vue'
import Input from '../../components/Input.vue'
import PopUpNotification from '../../components/PopUpNotification.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { login } from '../../services/api'
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
      const data = await login({ 
        email: email.value, 
        password: password.value, 
        remember: remember.value 
      })
      
      console.log('Login response:', data)
      message.value = data.message
      localStorage.setItem('token', data.access_token)
      
      try {
        const decoded = jwtDecode(data.access_token)
        console.log('Decoded token:', decoded)
        localStorage.setItem('user', JSON.stringify(decoded))
      } catch (decodeError) {
        console.error('JWT decode error:', decodeError)
        // Fallback: simpan data user mock
        const mockUserData = {
          id: 1,
          fullname: 'Test User',
          email: email.value,
          phone: '081234567890',
          is_admin: false
        }
        localStorage.setItem('user', JSON.stringify(mockUserData))
      }

      console.log('Redirecting to:', redirectPath)
      setTimeout(() => {
        window.location.href = redirectPath
      }, 200)
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    } catch (error: any) {
      console.error('Login error:', error)
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
