import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useAuthCheck(requireAdmin = false) {
  const router = useRouter()
  const route = useRoute()

  onMounted(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push(`/welcome?redirect=${encodeURIComponent(route.path)}`)
      return
    }

    if (requireAdmin) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (!user.is_admin) {
          router.replace('/')
        }
      }
    }
  })
}
