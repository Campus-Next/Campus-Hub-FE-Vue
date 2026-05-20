<template>
  <div class="font-sans flex flex-col box-border w-full">
    <div class="profile-page h-screen">
      <Navbar />
      <div class="mx-4 sm:mx-10 md:mx-20 lg:mx-32">
        <div class="content-box px-4 sm:px-8 md:px-16 py-0">
          <div class="header flex flex-col lg:flex-row justify-between lg:py-10 py-6">
            <div class="text-header flex flex-col">
              <span class="page-title font-semibold text-[24px] lg:text-[32px]">Info Personal</span>
              <span class="description text-regular text-[14px] lg:text-[18px]">
                Anda dapat mengubah foto profil dan informasi pribadi di sini.
              </span>
            </div>
            <span class="title font-semibold text-[24px] lg:text-[32px] mt-4 lg:mt-0">Profil Akun</span>
          </div>

          <div class="content flex flex-col sm:flex-row justify-between gap-8">
            <div class="profile flex flex-col lg:flex-row lg:items-start justify-center lg:justify-between lg:w-10/12 py-10">
              <div class="profile-picture w-[120px] lg:w-2/12 mx-auto rounded-full relative group">
                <img
                  :src="userPhoto"
                  alt="Foto Profil"
                  class="w-full aspect-square rounded-full object-cover"
                />
              </div>

              <div class="form flex flex-col w-full lg:w-10/12 gap-12 mt-6 lg:mt-0">
                <div class="flex flex-col gap-6 lg:gap-16 lg:w-11/12 pl-0 lg:pl-12">
                  <div class="field-pair flex flex-col lg:flex-row lg:items-center gap-4 w-full">
                    <label for="name" class="font-semibold text-[16px] lg:text-[20px] hidden sm:block lg:w-4/12">Nama</label>
                    <div class="flex flex-col sm:flex-col sm:items-start sm:gap-2 lg:w-8/12">
                      <label for="name" class="sm:block lg:hidden font-semibold text-[16px]">Nama</label>
                      <div class="input-box p-3 border-2 border-[#027FFF] rounded-lg hover:shadow-lg transition duration-300 px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none">
                        <input
                          type="text"
                          id="name"
                          v-model="user.name"
                          class="transition duration-300 w-full focus:outline-none"
                          placeholder="Masukkan Nama"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="field-pair flex flex-col lg:flex-row lg:items-center gap-4 w-full">
                    <label for="email" class="font-semibold text-[16px] lg:text-[20px] hidden sm:block lg:w-4/12">Alamat Email</label>
                    <div class="flex flex-col sm:flex-col sm:items-start sm:gap-2 lg:w-8/12">
                      <label for="email" class="sm:block lg:hidden font-semibold text-[16px]">Alamat Email</label>
                      <div class="input-box p-3 border-2 border-[#027FFF] rounded-lg hover:shadow-lg transition duration-300 px-4 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none">
                        <input
                          type="email"
                          id="email"
                          v-model="user.email"
                          class="transition duration-300 w-full focus:outline-none"
                          placeholder="Masukkan Email"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="save-button flex flex-col lg:flex-row gap-4 items-center justify-center py-6 w-full">
                  <button
                    type="button"
                    @click="router.push('/')"
                    class="bg-transparent border-2 border-customBlue font-medium w-full sm:w-1/3 h-11 my-2 rounded-lg text-medium text-black text-[16px] hover:shadow-lg transition duration-30"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    @click="handleUpdate"
                    :disabled="!isFormValid"
                    :class="[
                      'border-2 border-white font-medium w-full sm:w-1/3 h-11 my-2 rounded-lg text-medium text-white text-[16px] transition duration-30',
                      isFormValid ? 'bg-[#027FFF] hover:shadow-lg' : 'bg-[#A2A2A2] cursor-not-allowed'
                    ]"
                  >
                    <div v-if="isProcessing" class="flex items-center justify-center">
                      <svg class="animate-spin h-5 w-5 text-white-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="M22 12a10 10 0 01-10 10"></path>
                      </svg>
                    </div>
                    <span v-else>Ubah Profil</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="action-list flex flex-col lg:text-right text-center gap-6 lg:gap-11">
              <ul class="flex flex-col gap-4 lg:gap-11">
                <li>
                  <router-link
                    to="/account/profile"
                    :class="['font-regular text-lg hover:underline', activePage === 'info-personal' ? 'font-semibold underline' : '']"
                    @click="activePage = 'info-personal'"
                  >
                    Info Personal
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/account/password"
                    :class="['font-regular text-lg hover:underline', activePage === 'password' ? 'font-semibold underline' : '']"
                    @click="activePage = 'password'"
                  >
                    Password
                  </router-link>
                </li>
                <li>
                  <button
                    :class="['font-regular text-lg hover:underline', activePage === 'delete-account' ? 'font-semibold underline' : '']"
                    @click="showDeletePopUp = true"
                  >
                    Hapus Akun
                  </button>
                </li>
                <li>
                  <button
                    :class="['font-regular text-lg hover:underline', activePage === 'logout' ? 'font-semibold underline' : '']"
                    @click="showLogoutPopUp = true"
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
        <PopUpBerhasil v-if="showBerhasil" :isVisible="showBerhasil" :message="datas" @close="showBerhasil = false" />
        <PopUpGagal v-if="showGagal" :isVisible="showGagal" :message="datas" @close="showGagal = false" />
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
import PopUpBerhasil from '../../components/PopUpBerhasil.vue'
import PopUpGagal from '../../components/PopUpGagal.vue'
import { fetchUserProfile, updateUserProfile } from '../../services/api'

interface User {
  name: string
  email: string
}

const router = useRouter()
const storage = import.meta.env.VITE_STORAGE_BASE_URL

const activePage = ref('info-personal')
const user = ref<User>({
  name: '',
  email: ''
})
const showDeletePopUp = ref(false)
const showLogoutPopUp = ref(false)
const isProcessing = ref(false)
const datas = ref<string | null>(null)
const showBerhasil = ref(false)
const showGagal = ref(false)

const token = localStorage.getItem('token')

const isFormValid = computed(() => user.value.name && user.value.email)

const userPhoto = computed(() => {
  return `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(user.value.name || 'User')}&size=250`
})

const handleUpdate = async () => {
  isProcessing.value = true
  try {
    const updated = await updateUserProfile(
      { name: user.value.name, email: user.value.email },
      token || '',
    )
    localStorage.setItem('user', JSON.stringify(updated))
    datas.value = 'Profil berhasil diubah'
    showBerhasil.value = true
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error: any) {
    datas.value = error.data || 'Koneksi bermasalah, silahkan coba lagi'
    showGagal.value = true
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  if (!token) {
    router.replace('/welcome')
    return
  }

  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
})
</script>



