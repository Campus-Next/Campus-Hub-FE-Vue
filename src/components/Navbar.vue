<template>
  <nav :class="`sm:px-[0px] md:p-6 tengah:px-6 ${styles.bg} w-full lg:px-10 xl:px-[85px] py-6`">
    <div class="flex items-center px-[0px] w-full">
      <router-link to="/" class="flex items-center space-x-3 flex-shrink-0">
        <img
          :src="styles.logo"
          alt="Logo"
          class="hover:scale-105 hover:filter hover:drop-shadow-lg transition duration-300 sm:max-w-[150px] md:max-w-[229px] tengah:max-w-[180px]"
        />
      </router-link>

      <div class="flex-1 flex justify-center">
        <ul :class="`hidden lg:flex space-x-8 items-center ${styles.text} text-[20px] font-medium`">
          <router-link to="/" class="transition-all duration-3000 hover:scale-105">
            <li>Home</li>
          </router-link>
          <router-link to="/my-events" class="transition-all duration-3000 hover:scale-105">
            <li>My Events</li>
          </router-link>
          <router-link to="/public-events" class="transition-all duration-3000 hover:scale-105">
            <li>Public Events</li>
          </router-link>
          <li>
            <button @click="aboutus" class="transition-all duration-3000 hover:scale-105 cursor-pointer">
              About Us
            </button>
          </li>
        </ul>
      </div>

      <div class="flex justify-end gap-x-3 items-center flex-shrink-0 w-56">
        <div v-if="isLoading" class="w-12 h-12 rounded-full bg-gray-300"></div>
        <router-link v-else-if="userData" to="/account/profile" class="block">
          <img
            :src="userPhoto"
            alt="profile"
            class="w-12 h-12 rounded-full object-cover bg-gray-300 hover:scale-105 transition-transform duration-300"
          />
        </router-link>
        <div v-else class="sm:flex gap-x-[20px] sm:gap-x-[10px] item-center text-nowrap">
          <router-link to="/welcome">
            <button class="hover:scale-105 transition-all duration-300 bg-[#027FFF] border rounded-[10px] text-white sm:text-[15px] font-medium sm:w-[80px] sm:h-[30px] md:w-[155px] md:h-[46px] md:text-[20px] tengah:w-[120px] tengah:h-[36px] tengah:text-[17px]">
              Login
            </button>
          </router-link>
          <router-link to="/user/register">
            <button :class="`hover:scale-105 transition-all duration-300 ${styles.border} border-2 rounded-[10px] ${styles.buttonText} sm:text-[15px] font-medium sm:w-[80px] sm:h-[30px] md:w-[155px] md:h-[46px] md:text-[20px] tengah:w-[120px] tengah:h-[36px] tengah:text-[17px]`">
              Sign Up
            </button>
          </router-link>
        </div>

        <button
          @click="toggleMenu"
          class="lg:hidden flex items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen && !isLoading" class="lg:hidden mt-4">
      <ul :class="`flex flex-col space-y-4 ${styles.text} text-[20px] font-medium`">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/my-events">MyEvent</router-link></li>
        <li><router-link to="/public-events">Public Events</router-link></li>
        <li>
          <button @click="aboutus" class="transition-all duration-3000 hover:scale-105 cursor-pointer">
            About Us
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/image/logo.svg'
import logo2 from '../assets/image/logo2.svg'

interface UserData {
  fullname: string
  photo: string | null
  is_admin?: boolean
}

const storage = import.meta.env.VITE_STORAGE_BASE_URL
const route = useRoute()
const router = useRouter()

const userData = ref<UserData | null>(null)
const isMenuOpen = ref(false)
const isLoading = ref(true)

const darkThemePaths = [
  '/my-events',
  '/account/profile',
  '/account/password',
  '/events/upload',
  '/events/preview'
]

const isDarkTheme = computed(() => {
  const currentPath = route.path
  return darkThemePaths.includes(currentPath) ||
    currentPath.includes('/my-events/') ||
    currentPath.includes('/events/') ||
    currentPath.includes('/my-participants/')
})

const styles = computed(() => {
  const dark = isDarkTheme.value
  return {
    bg: dark ? 'bg-[#003266]' : 'bg-white',
    text: dark ? 'text-white' : 'text-[#003266]',
    logo: dark ? logo2 : logo,
    border: dark ? 'border-white/70' : 'border-[#027FFF]',
    buttonText: dark ? 'text-white' : 'text-[#027FFF]'
  }
})

const userPhoto = computed(() => {
  if (!userData.value) return ''
  if (userData.value.photo && userData.value.photo !== 'null') {
    return `${storage}/${userData.value.photo}`
  }
  return `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(userData.value.fullname)}&size=48&background=6b7280&color=ffffff`
})

const aboutus = () => {
  const aboutUsElement = document.getElementById('footer')
  
  if (!aboutUsElement) {
    router.push('/')
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 200)
  } else {
    setTimeout(() => {
      aboutUsElement.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  localStorage.setItem('isMenuOpen', isMenuOpen.value.toString())
}

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    userData.value = JSON.parse(user)
  }
  isLoading.value = false

  const savedMenuState = localStorage.getItem('isMenuOpen')
  if (savedMenuState === 'true') {
    isMenuOpen.value = true
  }
})
</script>
