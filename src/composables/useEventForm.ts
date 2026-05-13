import { ref, computed } from 'vue'

export function useEventForm(initialData?: any) {
  const event_img = ref<File | string | undefined>(initialData?.event_img)
  const speaker_img = ref<File | string | undefined>(initialData?.speaker_img)
  const eventsPreview = ref<string | undefined>(initialData?.eventsPreview)
  const speakerPreview = ref<string | undefined>(initialData?.speakerPreview)
  const category = ref(initialData?.category || '')
  const title = ref(initialData?.title || '')
  const date = ref(initialData?.date || '')
  const start_time = ref(initialData?.start_time || '')
  const end_time = ref(initialData?.end_time || '')
  const desc = ref(initialData?.desc || '')
  const speaker = ref(initialData?.speaker || '')
  const role = ref(initialData?.role || '')
  const slot = ref(initialData?.slot || '')
  const location = ref(initialData?.location || '')
  const isOffline = ref(initialData?.isOffline || false)

  const categoryMap: Record<string, string> = {
    '1': 'Webinar',
    '2': 'Seminar',
    '3': 'Kuliah Tamu',
    '4': 'Workshop',
    '5': 'Sertifikasi'
  }

  const isFormValid = computed(() => 
    eventsPreview.value &&
    category.value &&
    title.value &&
    date.value &&
    start_time.value &&
    end_time.value &&
    end_time.value > start_time.value &&
    desc.value
  )

  const isSecondStepValid = computed(() => 
    speakerPreview.value && 
    speaker.value && 
    role.value && 
    slot.value && 
    (!isOffline.value || location.value)
  )

  const getCategoryName = (categoryValue: string) => categoryMap[categoryValue] || ''

  const handleDrop = (event: DragEvent, step: number) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer?.files[0]
    if (droppedFile) {
      if (step === 1) {
        event_img.value = droppedFile
        eventsPreview.value = URL.createObjectURL(droppedFile)
      } else {
        speaker_img.value = droppedFile
        speakerPreview.value = URL.createObjectURL(droppedFile)
      }
    }
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const getFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile) {
      event_img.value = selectedFile
      eventsPreview.value = URL.createObjectURL(selectedFile)
    }
  }

  const getSpeakerFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile) {
      speaker_img.value = selectedFile
      speakerPreview.value = URL.createObjectURL(selectedFile)
    }
  }

  const getFormData = () => {
    const formData = new FormData()
    formData.append('category', category.value)
    formData.append('title', title.value)
    formData.append('date', date.value)
    formData.append('start_time', start_time.value)
    formData.append('end_time', end_time.value)
    formData.append('desc', desc.value)
    formData.append('speaker', speaker.value)
    formData.append('role', role.value)
    formData.append('slot', slot.value)
    formData.append('location', location.value)
    formData.append('isOffline', String(isOffline.value))

    if (event_img.value && typeof event_img.value !== 'string') {
      formData.append('event_img', event_img.value)
    }
    if (speaker_img.value && typeof speaker_img.value !== 'string') {
      formData.append('speaker_img', speaker_img.value)
    }

    return formData
  }

  const setFormData = (data: any) => {
    category.value = data.category || ''
    title.value = data.title || ''
    date.value = data.date || ''
    start_time.value = data.start_time || ''
    end_time.value = data.end_time || ''
    desc.value = data.desc || ''
    isOffline.value = data.isOffline || false
    event_img.value = data.event_img || ''
    speaker_img.value = data.speaker_img || ''
    eventsPreview.value = data.eventsPreview || ''
    speakerPreview.value = data.speakerPreview || ''
    speaker.value = data.speaker || ''
    role.value = data.role || ''
    slot.value = data.slot || ''
    location.value = data.location || ''
  }

  return {
    event_img,
    speaker_img,
    eventsPreview,
    speakerPreview,
    category,
    title,
    date,
    start_time,
    end_time,
    desc,
    speaker,
    role,
    slot,
    location,
    isOffline,
    isFormValid,
    isSecondStepValid,
    getCategoryName,
    handleDrop,
    handleDragOver,
    getFile,
    getSpeakerFile,
    getFormData,
    setFormData
  }
}
