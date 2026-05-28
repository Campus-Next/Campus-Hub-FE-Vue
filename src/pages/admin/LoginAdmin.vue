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
import { login } from '../../services/api'
import { useLoginForm } from '../../composables/useAuthForm'
import { isAuthenticated, saveAuthSession } from '../../utils/authSession'

const router = useRouter()

const {
  email,
  password,
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
      })

      if (!data.roles?.includes('admin')) {
        message.value = 'Akun ini bukan akun admin.'
        showGagal.value = true
        isLoading.value = false
        return
      }

      message.value = 'Login berhasil'

      saveAuthSession({
        token: data.access_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        user: data.user,
        roles: data.roles || [],
      })
      await router.replace(redirectPath)
    } catch (error: any) {
      message.value = error.data || 'Koneksi Timeout, Silahkan Coba Lagi'
      showGagal.value = true
      isLoading.value = false
    }
  }
}

onMounted(() => {
  if (isAuthenticated()) {
    router.replace('/')
  }
})
</script>
