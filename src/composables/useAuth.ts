import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AuthSessionUser } from '../types'
import {
  clearAuthSession,
  getStoredUser,
  getToken as getStoredToken,
  isAdmin as hasAdminRole,
  isAuthenticated as hasValidSession,
} from '../utils/authSession'

export function useAuth() {
  const router = useRouter()
  const user = ref<AuthSessionUser | null>(getStoredUser())

  const isAuthenticated = computed(() => hasValidSession())
  const isAdmin = computed(() => hasAdminRole())

  const getUser = (): AuthSessionUser | null => getStoredUser()

  const getToken = (): string | null => {
    return getStoredToken()
  }

  const logout = () => {
    clearAuthSession()
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

  return {
    user,
    isAuthenticated,
    isAdmin,
    getUser,
    getToken,
    logout,
    requireAuth,
    requireGuest,
  }
}
