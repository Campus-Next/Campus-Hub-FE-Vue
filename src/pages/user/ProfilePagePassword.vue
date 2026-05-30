<template>
  <div class="font-sans flex flex-col box-border w-full">
    <div class="profile-page h-screen">
      <Navbar />
      <div class="mx-4 sm:mx-10 md:mx-20 lg:mx-32">
        <div class="content-box px-4 sm:px-8 md:px-16">
          <div class="header flex flex-col lg:flex-row justify-between lg:py-10 py-6">
            <div class="text-header flex flex-col">
              <span class="page-title font-semibold text-[24px] sm:text-[32px]">Password</span>
              <span class="description text-regular text-[16px] sm:text-[18px]">
                Anda dapat mengubah password akun Anda di sini.
              </span>
            </div>
            <span class="title font-semibold text-[24px] sm:text-[32px] lg:text-[32px]">Profil Akun</span>
          </div>

          <div class="content flex flex-col sm:flex-row justify-between gap-8">
            <div class="profile flex flex-col lg:w-10/12 py-10">
              <div class="edit-password flex flex-col w-full gap-4 lg:mb-0">
                <form @submit.prevent="handleSubmit">
                  <div class="form flex flex-col gap-6 lg:gap-10 lg:w-full pl-0 lg:mb-12">
                    <div class="lg:flex lg:items-center gap-4 w-full">
                      <label for="currentpassword" class="font-semibold text-[16px] lg:text-[20px] hidden lg:block lg:w-4/12">
                        Password Saat Ini
                      </label>
                      <div class="w-full lg:w-8/12 flex flex-col relative">
                        <div class="flex flex-col sm:items-start sm:gap-2">
                          <label for="currentpassword" class="lg:hidden font-semibold text-[16px]">Password Saat Ini</label>
                          <div class="flex py-2 w-full">
                            <input
                              :type="showCurrentPassword ? 'text' : 'password'"
                              id="currentpassword"
                              v-model="currentPassword"
                              placeholder="Masukkan Password Saat Ini..."
                              class="p-3 border border-customBlue rounded-lg flex hover:shadow-lg transition duration-300 px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                            <button
                              type="button"
                              @click="showCurrentPassword = !showCurrentPassword"
                              class="absolute right-3 py-2 text-gray-500 hover:text-gray-700"
                            >
                              <i :class="showCurrentPassword ? 'ri-eye-line text-2xl' : 'ri-eye-close-line text-2xl'"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="lg:flex lg:items-center gap-4 w-full">
                      <label for="newpassword" class="font-semibold text-[16px] lg:text-[20px] hidden lg:block lg:w-4/12">
                        Password Baru
                      </label>
                      <div class="w-full lg:w-8/12 flex flex-col relative">
                        <div class="flex flex-col sm:items-start sm:gap-2">
                          <label for="newpassword" class="lg:hidden font-semibold text-[16px]">Password Baru</label>
                          <div class="flex py-2 w-full">
                            <input
                              :type="showNewPassword ? 'text' : 'password'"
                              id="newpassword"
                              v-model="newPassword"
                              @input="handlePasswordChange"
                              placeholder="Masukkan Password Anda..."
                              class="p-3 border border-customBlue rounded-lg flex hover:shadow-lg transition duration-300 px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                            <button
                              type="button"
                              @click="showNewPassword = !showNewPassword"
                              class="absolute right-3 py-2 text-gray-500 hover:text-gray-700"
                            >
                              <i :class="showNewPassword ? 'ri-eye-line text-2xl' : 'ri-eye-close-line text-2xl'"></i>
                            </button>
                          </div>
                        </div>
                        <div
                          v-if="passwordError"
                          class="error-popup absolute left-0 top-full mt-2 p-3 w-full rounded-lg border-2 border-red-500 bg-red-100 text-red-500 text-sm shadow-lg z-10"
                        >
                          {{ passwordError }}
                        </div>
                      </div>
                    </div>

                    <div class="lg:flex lg:items-center gap-4 w-full">
                      <label for="passwordconfirmation" class="font-semibold text-[16px] lg:text-[20px] hidden lg:block lg:w-4/12">
                        Konfirmasi Password
                      </label>
                      <div class="w-full lg:w-8/12 flex flex-col relative">
                        <div class="flex flex-col sm:items-start sm:gap-2">
                          <label for="passwordconfirmation" class="lg:hidden font-semibold text-[16px]">Konfirmasi Password</label>
                          <div class="flex py-2 w-full">
                            <input
                              :type="showConfirmationPassword ? 'text' : 'password'"
                              id="passwordconfirmation"
                              v-model="passwordConfirmation"
                              @input="handleConfirmationChange"
                              placeholder="Konfirmasi Password Anda..."
                              class="p-3 border border-customBlue rounded-lg flex hover:shadow-lg transition duration-300 px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                            <button
                              type="button"
                              @click="showConfirmationPassword = !showConfirmationPassword"
                              class="absolute right-3 py-2 text-gray-500 hover:text-gray-700"
                            >
                              <i :class="showConfirmationPassword ? 'ri-eye-line text-2xl' : 'ri-eye-close-line text-2xl'"></i>
                            </button>
                          </div>
                        </div>
                        <div
                          v-if="confirmationError"
                          class="error-popup absolute left-0 top-full mt-2 p-3 w-full rounded-lg border-2 border-red-500 bg-red-100 text-red-500 text-sm shadow-lg z-10"
                        >
                          {{ confirmationError }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="save-button flex flex-col lg:flex-row gap-4 items-center justify-center py-6 w-full">
                    <button
                      type="button"
                      @click="router.push('/account/profile')"
                      class="bg-transparent border-2 border-customBlue font-medium w-full sm:w-1/3 h-11 my-2 rounded-lg text-medium text-black text-[16px] hover:shadow-lg transition duration-30"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      :disabled="!isFormValid"
                      :class="[
                        'border-2 border-white font-medium w-full sm:w-1/3 h-11 my-2 rounded-lg text-medium text-white text-[16px] transition duration-30',
                        isFormValid ? 'bg-[#027FFF] hover:shadow-lg' : 'bg-[#A2A2A2] cursor-not-allowed'
                      ]"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div class="action-list flex flex-col lg:text-right text-center gap-6 lg:gap-11">
              <ul class="flex flex-col gap-4 lg:gap-11">
                <li>
                  <router-link
                    to="/account/profile"
                    :class="['font-regular text-lg sm:text-base md:text-lg hover:underline', activePage === 'info-personal' ? 'font-semibold underline' : '']"
                    @click="activePage = 'info-personal'"
                  >
                    Info Personal
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/account/password"
                    :class="['font-regular text-lg sm:text-base md:text-lg hover:underline', activePage === 'password' ? 'font-semibold underline' : '']"
                    @click="activePage = 'password'"
                  >
                    Password
                  </router-link>
                </li>
                <li>
                  <button
                    :class="['font-regular text-lg hover:underline', activePage === 'delete-account' ? 'font-semibold underline' : '']"
                    @click.prevent="showDeletePopUp = true"
                  >
                    Hapus Akun
                  </button>
                </li>
                <li>
                  <button
                    :class="['font-regular text-lg hover:underline', activePage === 'delete-account' ? 'font-semibold underline' : '']"
                    @click.prevent="showLogoutPopUp = true"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="absolute bottom-0 left-0">
          <img src="../../assets/image/Ellipse.svg" alt="Background" />
        </div>

        <PopUpDelete v-if="showDeletePopUp" :setShowPopUp="(val) => showDeletePopUp = val" />
        <PopUpLogOut v-if="showLogoutPopUp" :setShowPopUp="(val) => showLogoutPopUp = val" />
        <PopUpUpdate
          v-if="showUpdatePopUp"
          :setShowPopUp="(val) => showUpdatePopUp = val"
          :current-password="currentPassword"
          :password="newPassword"
          :confirmation="passwordConfirmation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import PopUpDelete from '../../components/PopUpDelete.vue'
import PopUpLogOut from '../../components/PopUpLogOut.vue'
import PopUpUpdate from '../../components/PopUpUpdate.vue'

const router = useRouter()

const activePage = ref('password')
const currentPassword = ref('')
const newPassword = ref('')
const passwordConfirmation = ref('')
const passwordError = ref('')
const confirmationError = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmationPassword = ref(false)
const showDeletePopUp = ref(false)
const showLogoutPopUp = ref(false)
const showUpdatePopUp = ref(false)

const isFormValid = computed(
  () =>
    currentPassword.value &&
    newPassword.value &&
    passwordConfirmation.value &&
    !passwordError.value &&
    !confirmationError.value,
)

const handlePasswordChange = () => {
  const value = newPassword.value
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (value === '') {
    passwordError.value = ''
  } else if (!passwordFormat.test(value)) {
    passwordError.value = 'Password harus mengandung minimal 8 karakter, dengan huruf besar, huruf kecil, dan angka.'
  } else {
    passwordError.value = ''
  }
}

const handleConfirmationChange = () => {
  const value = passwordConfirmation.value
  if (value === '') {
    confirmationError.value = ''
  } else if (value !== newPassword.value) {
    confirmationError.value = 'Password tidak cocok.'
  } else {
    confirmationError.value = ''
  }
}

const handleSubmit = () => {
  showUpdatePopUp.value = true
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/welcome')
  }
})
</script>



