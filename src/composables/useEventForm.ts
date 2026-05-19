import { ref, computed } from 'vue'

export function useEventForm(initialData?: any) {
  const title = ref(initialData?.title || '')
  const description = ref(initialData?.description || '')
  const start_date = ref(initialData?.start_date || '')
  const end_date = ref(initialData?.end_date || '')
  const max_participants = ref(initialData?.max_participants || '')
  const registration_fee = ref(initialData?.registration_fee || '0')
  const registration_open = ref(initialData?.registration_open || '')
  const registration_deadline = ref(initialData?.registration_deadline || '')
  const location = ref(initialData?.location || '')
  const isOffline = ref(initialData?.isOffline || false)

  const isFormValid = computed(() => 
    title.value &&
    description.value &&
    start_date.value &&
    end_date.value &&
    end_date.value >= start_date.value
  )

  const isSecondStepValid = computed(() => 
    max_participants.value && 
    registration_fee.value !== '' && 
    registration_open.value &&
    registration_deadline.value &&
    (!isOffline.value || location.value)
  )

  const getFormData = () => {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    
    // Formatting date to SQL timestamp 'YYYY-MM-DD HH:MM:SS'
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toISOString().slice(0, 19).replace('T', ' ')
    }
    
    formData.append('start_date', formatDate(start_date.value))
    formData.append('end_date', formatDate(end_date.value))
    
    // The registration dates are just dates
    const formatJustDate = (dateStr: string) => {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toISOString().slice(0, 10)
    }

    formData.append('registration_open', formatJustDate(registration_open.value))
    formData.append('registration_deadline', formatJustDate(registration_deadline.value))
    
    formData.append('max_participants', max_participants.value)
    formData.append('registration_fee', registration_fee.value)
    formData.append('location', isOffline.value ? location.value : 'Online')

    return formData
  }

  const setFormData = (data: any) => {
    title.value = data.title || ''
    description.value = data.description || data.desc || ''
    
    // Transform 'YYYY-MM-DD HH:MM:SS' to 'YYYY-MM-DDTHH:MM'
    const toDatetimeLocal = (str: string) => str ? str.replace(' ', 'T').slice(0, 16) : ''
    start_date.value = toDatetimeLocal(data.start_date || '')
    end_date.value = toDatetimeLocal(data.end_date || '')
    
    registration_open.value = data.registration_open ? data.registration_open.slice(0, 10) : ''
    registration_deadline.value = data.registration_deadline ? data.registration_deadline.slice(0, 10) : ''
    
    max_participants.value = data.max_participants || data.slot || ''
    registration_fee.value = data.registration_fee || '0'
    location.value = data.location || ''
    isOffline.value = data.location && data.location !== 'Online'
  }

  return {
    title,
    description,
    start_date,
    end_date,
    max_participants,
    registration_fee,
    registration_open,
    registration_deadline,
    location,
    isOffline,
    isFormValid,
    isSecondStepValid,
    getFormData,
    setFormData
  }
}
