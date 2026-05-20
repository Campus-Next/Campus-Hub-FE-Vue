import { ref, computed } from 'vue'

export function useEventForm(initialData?: any) {
  const title = ref(initialData?.title || '')
  const description = ref(initialData?.description || '')

  // Separated date & time for start
  const start_date_date = ref(initialData?.start_date_date || '')
  const start_date_time = ref(initialData?.start_date_time || '')

  // Separated date & time for end
  const end_date_date = ref(initialData?.end_date_date || '')
  const end_date_time = ref(initialData?.end_date_time || '')

  const max_participants = ref(initialData?.max_participants || '')
  const registration_open = ref(initialData?.registration_open || '')
  const registration_deadline = ref(initialData?.registration_deadline || '')
  const location = ref(initialData?.location || '')
  const isOffline = ref(initialData?.isOffline || false)

  // Image upload
  const imageFile = ref<File | null>(null)
  const imagePreviewUrl = ref<string | null>(null)

  // --- Validation ---

  const isFormValid = computed(() => {
    const startOk = start_date_date.value && start_date_time.value
    const endOk   = end_date_date.value   && end_date_time.value
    const startTs = startOk ? `${start_date_date.value}T${start_date_time.value}` : ''
    const endTs   = endOk   ? `${end_date_date.value}T${end_date_time.value}`     : ''
    return !!(
      title.value &&
      description.value &&
      startOk &&
      endOk &&
      endTs >= startTs
    )
  })

  const isSecondStepValid = computed(() =>
    !!(
      max_participants.value &&
      registration_open.value &&
      registration_deadline.value &&
      (!isOffline.value || location.value)
    )
  )

  // --- FormData builder ---

  const getFormData = () => {
    const formData = new FormData()

    formData.append('title', title.value)
    formData.append('description', description.value)

    // Combine date + time into 'YYYY-MM-DD HH:MM:SS'
    const combine = (date: string, time: string) => {
      if (!date || !time) return ''
      return `${date} ${time}:00`
    }

    formData.append('start_date', combine(start_date_date.value, start_date_time.value))
    formData.append('end_date',   combine(end_date_date.value,   end_date_time.value))
    formData.append('registration_open',     registration_open.value)
    formData.append('registration_deadline', registration_deadline.value)
    formData.append('max_participants', String(max_participants.value))
    formData.append('location', isOffline.value ? location.value : 'Online')

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    return formData
  }

  // --- Populate from API response ---

  const setFormData = (data: any) => {
    title.value       = data.title || ''
    description.value = data.description || data.desc || ''

    // Split 'YYYY-MM-DD HH:MM:SS' (or ISO) into date + time
    const splitDateTime = (str: string) => {
      if (!str) return { date: '', time: '' }
      const normalized = str.replace('T', ' ').slice(0, 16) // 'YYYY-MM-DD HH:MM'
      const [date, time] = normalized.split(' ')
      return { date: date || '', time: time || '' }
    }

    const start = splitDateTime(data.start_date || '')
    const end   = splitDateTime(data.end_date   || '')

    start_date_date.value = start.date
    start_date_time.value = start.time
    end_date_date.value   = end.date
    end_date_time.value   = end.time

    registration_open.value     = data.registration_open     ? data.registration_open.slice(0, 10)     : ''
    registration_deadline.value = data.registration_deadline ? data.registration_deadline.slice(0, 10) : ''

    max_participants.value = data.max_participants || data.slot || ''

    location.value  = data.location || ''
    isOffline.value = !!(data.location && data.location !== 'Online')

    // Pre-fill image preview from existing images array or direct path
    if (data.images && data.images.length > 0) {
      const existingPath = data.images[0].path
      const base = import.meta.env.VITE_STORAGE_BASE_URL || ''
      imagePreviewUrl.value = existingPath.startsWith('http') ? existingPath : `${base}/${existingPath}`
    } else {
      imagePreviewUrl.value = null
    }
  }

  // Handle file selection
  const handleImageSelect = (file: File) => {
    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
  }

  const clearImage = () => {
    if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl.value)
    }
    imageFile.value = null
    imagePreviewUrl.value = null
  }

  return {
    title,
    description,
    start_date_date,
    start_date_time,
    end_date_date,
    end_date_time,
    max_participants,
    registration_open,
    registration_deadline,
    location,
    isOffline,
    imageFile,
    imagePreviewUrl,
    isFormValid,
    isSecondStepValid,
    getFormData,
    setFormData,
    handleImageSelect,
    clearImage,
  }
}
