export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at?: string
  updated_at?: string
  is_admin?: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface EventLink {
  id: number
  event_id: number
  title: string
  url: string
  created_at?: string
  updated_at?: string
}

export interface EventImage {
  id: number
  event_id: number
  path: string
  alt_text?: string | null
  is_primary?: boolean
}

export interface Event {
  id: number
  organizer_id: number
  category_id?: number | null
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
  category?: Category | null
  organizer?: User | null
  event_links?: EventLink[]
  images?: EventImage[]
}

export interface EventParticipant {
  id: number
  event_id: number
  user_id: number
  status: 'registered' | 'cancelled' | 'attended' | 'absent'
  unique_code?: string | null
  event?: Event
  user?: User
  created_at?: string
  updated_at?: string
}

export interface Cart {
  id: number
  user_id: number
  event_id: number
  quantity: number
  event?: Event
  created_at?: string
  updated_at?: string
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}
