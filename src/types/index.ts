export interface User {
  fullname: string
  email: string
  nomor_telepon: string
  photo: string | null
  is_admin?: boolean
}

export interface Event {
  id: number
  foto_event: string
  category_name: string
  accessibility: string
  judul: string
  deskripsi: string
  date: string
  start_time: string
  end_time: string
  tempat: string
  available_slot: number
  foto_pembicara: string
  pembicara: string
  role: string
  join_date?: string
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
