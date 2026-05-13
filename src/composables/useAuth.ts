import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types'
import { STORAGE_KEYS } from '../constants'

export function useAuth() {
  const router = useRouter()
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!localStorage.getItem(STORAGE_KEYS.TOKEN))
  const isAdmin = computed(() => user.value?.is_admin === true)

  const getUser = (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  const getToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  }

  const setUser = (userData: User) => {
    user.value = userData
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
  }

  const setToken = (token: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE)
    user.value = null
    router.push('/')
  }

  const requireAuth = (redirectTo = '/welcome') => {
    if (!isAuthenticated.value) {
      router.replace(redirectTo)
      return false
    }
    return true
  }

  const requireGuest = () => {
    if (isAuthenticated.value) {
      router.replace('/')
      return false
    }
    return true
  }

  const checkAdminAccess = () => {
    const userData = getUser()
    if (userData?.is_admin) {
      router.replace('/')
      return false
    }
    return true
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    getUser,
    getToken,
    setUser,
    setToken,
    logout,
    requireAuth,
    requireGuest,
    checkAdminAccess
  }
}
