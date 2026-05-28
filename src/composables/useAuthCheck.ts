import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { clearAuthSession, isAdmin, isAuthenticated } from '../utils/authSession'

export function useAuthCheck(requireAdmin = false) {
  const router = useRouter()
  const route = useRoute()

  onMounted(() => {
    if (!isAuthenticated()) {
      clearAuthSession()
      router.push(`/welcome?redirect=${encodeURIComponent(route.path)}`)
      return
    }

    if (requireAdmin && !isAdmin()) {
      router.replace('/')
    }
  })
}
