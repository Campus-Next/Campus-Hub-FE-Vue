export interface User {
  fullname: string
  email: string
  nomor_telepon: string
  photo: string | null
  is_admin?: boolean
}

export interface Event {
  id: number
  organizer_id: number
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  max_participants: number
  registration_fee: string | number
  registration_open: string
  registration_deadline: string
  created_at?: string
  updated_at?: string
  status?: string
}

export interface EventsResponse {
  events: Event[]
  trending: number
  category: number
}

export type EventCategory = 'webinar' | 'seminar' | 'kuliah-tamu' | 'workshop' | 'sertifikasi'

export interface CategoryConfig {
  id: string
  name: string
  title: string
  route: string
}
