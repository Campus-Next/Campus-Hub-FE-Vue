import { ref, computed } from 'vue'
import { resolveStorageUrl } from '../utils/helpers'

interface EventLinkForm {
  id?: number
  title: string
  url: string
}

const combineDateAndTime = (date: string, time: string) => {
  if (!date || !time) return ''
  return `${date} ${time}:00`
}

const toBackendDateTime = (value: string) => {
  if (!value) return ''
  const normalized = value.replace('T', ' ')
  return normalized.length === 16 ? `${normalized}:00` : normalized
}

const toDateTimeLocal = (value: string) => {
  if (!value) return ''
  const normalized = value.replace('T', ' ').slice(0, 16)
  const [date, time = '00:00'] = normalized.split(' ')
  return date ? `${date}T${time.slice(0, 5) || '00:00'}` : ''
}

const splitDateTime = (value: string) => {
  const localValue = toDateTimeLocal(value)
  if (!localValue) return { date: '', time: '' }
  const [date, time] = localValue.split('T')
  return { date: date || '', time: time || '' }
}

export function useEventForm(initialData?: any) {
  const title = ref(initialData?.title || '')
  const description = ref(initialData?.description || '')
  const category_id = ref<string | number>(initialData?.category_id || '')

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
  const eventLinks = ref<EventLinkForm[]>(initialData?.event_links || [])
  const removedLinkIds = ref<number[]>([])

  const eventStartDateTime = computed(() =>
    start_date_date.value && start_date_time.value ? `${start_date_date.value}T${start_date_time.value}` : '',
  )

  // --- Validation ---

  const isFormValid = computed(() => {
    const startOk = start_date_date.value && start_date_time.value
    const endOk   = end_date_date.value   && end_date_time.value
    const startTs = startOk ? `${start_date_date.value}T${start_date_time.value}` : ''
    const endTs   = endOk   ? `${end_date_date.value}T${end_date_time.value}`     : ''
    return !!(
      title.value &&
      description.value &&
      category_id.value &&
      startOk &&
      endOk &&
      endTs >= startTs
    )
  })

  const validateEventLink = (link: EventLinkForm) => {
    const title = link.title.trim()
    const url = link.url.trim()
    if (!title && !url) return ''
    if (!title || !url) return 'Judul dan URL harus diisi lengkap.'
    if (title.length > 255 || url.length > 255) return 'Judul dan URL maksimal 255 karakter.'
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'URL harus diawali http:// atau https://.'
      }
    } catch {
      return 'URL harus valid dan diawali http:// atau https://.'
    }
    return ''
  }

  const eventLinkErrors = computed(() => eventLinks.value.map(validateEventLink))

  const isLinksValid = computed(() => eventLinkErrors.value.every(error => !error))

  const isSecondStepValid = computed(() =>
    !!(
      max_participants.value &&
      registration_open.value &&
      registration_deadline.value &&
      (!isOffline.value || location.value) &&
      isLinksValid.value
    )
  )

  // Inline date constraint errors — shown before user can Publish
  const dateErrors = computed(() => {
    const errors: Record<string, string> = {}

    if (registration_open.value && registration_deadline.value) {
      if (registration_deadline.value < registration_open.value) {
        errors.registration_deadline = 'Tanggal tutup tidak boleh sebelum tanggal buka pendaftaran.'
      }
    }

    if (registration_deadline.value && eventStartDateTime.value) {
      if (registration_deadline.value > eventStartDateTime.value) {
        errors.registration_deadline =
          `Pendaftaran harus tutup paling lambat saat acara dimulai (${eventStartDateTime.value}).`
      }
    }

    return errors
  })

  // True only when step 2 is filled AND all date constraints pass
  const isFormComplete = computed(() => isSecondStepValid.value && Object.keys(dateErrors.value).length === 0)


  // --- FormData builder ---

  const getFormData = () => {
    const formData = new FormData()

    formData.append('title', title.value)
    formData.append('description', description.value)
    formData.append('category_id', String(category_id.value))

    formData.append('start_date', combineDateAndTime(start_date_date.value, start_date_time.value))
    formData.append('end_date',   combineDateAndTime(end_date_date.value,   end_date_time.value))
    formData.append('registration_open',     toBackendDateTime(registration_open.value))
    formData.append('registration_deadline', toBackendDateTime(registration_deadline.value))
    formData.append('max_participants', String(max_participants.value))
    formData.append('location', isOffline.value ? location.value : 'Online')

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    return formData
  }

  const getCleanEventLinks = () =>
    eventLinks.value
      .map(link => ({
        ...link,
        title: link.title.trim(),
        url: link.url.trim(),
      }))
      .filter(link => link.title && link.url)

  const cleanupImagePreview = () => {
    if (imagePreviewUrl.value?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl.value)
    }
  }

  const clearImage = () => {
    cleanupImagePreview()
    imageFile.value = null
    imagePreviewUrl.value = null
  }

  const handleImageSelect = (file: File) => {
    cleanupImagePreview()
    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
  }

  const addEventLink = () => {
    eventLinks.value.push({ title: '', url: '' })
  }

  const removeEventLink = (index: number) => {
    const link = eventLinks.value[index]
    if (link?.id) removedLinkIds.value.push(link.id)
    eventLinks.value.splice(index, 1)
  }

  // --- Populate from API response ---

  const setFormData = (data: any) => {
    title.value       = data.title || ''
    description.value = data.description || data.desc || ''
    category_id.value = data.category_id || ''

    const start = splitDateTime(data.start_date || '')
    const end   = splitDateTime(data.end_date   || '')

    start_date_date.value = start.date
    start_date_time.value = start.time
    end_date_date.value   = end.date
    end_date_time.value   = end.time

    registration_open.value     = toDateTimeLocal(data.registration_open || '')
    registration_deadline.value = toDateTimeLocal(data.registration_deadline || '')

    max_participants.value = data.max_participants || data.slot || ''
    location.value = data.location || ''
    isOffline.value = data.location && data.location !== 'Online'
    imagePreviewUrl.value = resolveStorageUrl(data.image_url || data.image?.path || '')
    eventLinks.value = Array.isArray(data.event_links) ? data.event_links : []
  }

  return {
    title,
    description,
    category_id,
    imagePreviewUrl,
    start_date_date,
    start_date_time,
    end_date_date,
    end_date_time,
    max_participants,
    registration_open,
    registration_deadline,
    location,
    isOffline,
    isFormValid,
    isSecondStepValid,
    isFormComplete,
    isLinksValid,
    removedLinkIds,
    eventStartDateTime,
    dateErrors,
    getFormData,
    getCleanEventLinks,
    setFormData,
    handleImageSelect,
    clearImage,
    cleanupImagePreview,
    addEventLink,
    removeEventLink,
  }
}
