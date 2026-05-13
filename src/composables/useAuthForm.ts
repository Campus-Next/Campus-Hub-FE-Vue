import { ref, computed } from 'vue'

export function useLoginForm() {
  const email = ref('')
  const password = ref('')
  const remember = ref(false)
  const isLoading = ref(false)
  const showGagal = ref(false)
  const message = ref('')

  const params = new URLSearchParams(location.search)
  const redirectPath = params.get('redirect') || '/'

  const isFormValid = computed(() => 
    email.value.trim() !== '' && password.value.trim() !== ''
  )

  return {
    email,
    password,
    remember,
    isLoading,
    showGagal,
    message,
    redirectPath,
    isFormValid
  }
}

export function useRegisterForm() {
  const formData = ref({
    nama: '',
    email: '',
    password: '',
    telepon: ''
  })
  
  const errorMessage = ref('')
  const isLoading = ref(false)
  const showPopup = ref(false)
  const showGagal = ref(false)
  const message = ref('')

  const params = new URLSearchParams(location.search)
  const redirectPath = params.get('redirect') || '/'

  const isFormValid = computed(() => 
    Object.values(formData.value).every(value => value.trim() !== '')
  )

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      formData.value.telepon = value
      errorMessage.value = ''
    }
  }

  const validatePhone = () => {
    if (formData.value.telepon.length < 11) {
      errorMessage.value = 'Nomor telepon harus memiliki minimal 11 digit!'
      return false
    }
    return true
  }

  return {
    formData,
    errorMessage,
    isLoading,
    showPopup,
    showGagal,
    message,
    redirectPath,
    isFormValid,
    handlePhoneChange,
    validatePhone
  }
}
