import { ref, computed } from 'vue'
import { sanitizeRedirectPath } from '../utils/authSession'

export function useLoginForm() {
  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const showGagal = ref(false)
  const message = ref('')

  const params = new URLSearchParams(location.search)
  const redirectPath = sanitizeRedirectPath(params.get('redirect'))
  const redirectQuery = encodeURIComponent(redirectPath)

  const isFormValid = computed(() => 
    email.value.trim() !== '' && password.value.trim() !== ''
  )

  return {
    email,
    password,
    isLoading,
    showGagal,
    message,
    redirectPath,
    redirectQuery,
    isFormValid
  }
}

export function useRegisterForm() {
  const formData = ref({
    nama: '',
    email: '',
    password: '',
  })
  
  const errorMessage = ref('')
  const isLoading = ref(false)
  const showPopup = ref(false)
  const showGagal = ref(false)
  const message = ref('')

  const params = new URLSearchParams(location.search)
  const redirectPath = sanitizeRedirectPath(params.get('redirect'))
  const redirectQuery = encodeURIComponent(redirectPath)

  const isFormValid = computed(() => 
    Object.values(formData.value).every(value => value.trim() !== '')
  )

  return {
    formData,
    errorMessage,
    isLoading,
    showPopup,
    showGagal,
    message,
    redirectPath,
    redirectQuery,
    isFormValid,
  }
}
