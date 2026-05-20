import { MOCK_ENABLED, mockEvents, mockCategoryEvents, mockUser, mockAdminUser } from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Helper untuk delay mock response
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

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

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const fetchEvents = async (category?: string): Promise<ApiResponse<Event[]>> => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return { success: true, message: 'Mock', data: (category ? mockCategoryEvents : mockEvents).events as any }
  }
  
  // The new API doesn't seem to support category filtering via query param in the docs,
  // but we can pass it if it's supported, or just fetch all.
  const endpoint = category ? `/events?category=${category}` : '/events'
  const response = await fetch(`${API_BASE_URL}${endpoint}`)

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error fetching events')
  }

  return data
}

export const fetchEvent = async (id: number): Promise<Event> => {
  if (MOCK_ENABLED) {
    await mockDelay()
    const found = mockEvents.events.find(e => e.id === id) || mockEvents.events[0]
    return {
      ...found,
      organizer_id: 1,
      title: found.title,
      description: found.description,
      location: found.location,
      start_date: found.date,
      end_date: found.date,
      max_participants: 100,
      registration_fee: 0,
      registration_open: found.date,
      registration_deadline: found.date
    } as any
  }
  
  const response = await fetch(`${API_BASE_URL}/events/${id}`)

  const json = await response.json()
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Event not found')
  }

  return json.data
}

export const fetchCategories = async (): Promise<ApiResponse<Event[]>> => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return { success: true, message: 'Mock', data: mockEvents.events as any }
  }
  
  const response = await fetch(`${API_BASE_URL}/categories`)

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error fetching categories')
  }

  return data
}

export const login = async (credentials: { email: string; password: string }) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    const mockPayload = {
      id: 1,
      name: 'Test User',
      email: credentials.email,
      is_admin: false,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }
    const base64UrlEncode = (str: string) => {
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = base64UrlEncode(JSON.stringify(mockPayload))
    const token = `${header}.${body}.mock-signature`
    
    return { message: 'Login berhasil', access_token: token, token_type: 'Bearer' }
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message || data.error
    throw error
  }

  return data
}

export const register = async (userData: any) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return { message: 'Registrasi berhasil' }
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const registerEventWithToken = async (eventId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const cancelRegistration = async (eventId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/enrol`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const deleteAccount = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }
  return data
}

export const fetchUniqueCode = async (eventId: number, token: string) => {
  // Assuming there is an endpoint for this, though not defined in markdown, let's keep it but it might fail
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/links`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const updatePassword = async (newPassword: string, confirmation: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ password: newPassword, confirmation: confirmation })
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const fetchMyEvents = async (token: string) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return { data: [] }
  }
  
  const response = await fetch(`${API_BASE_URL}/my-events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    ;(error as any).status = response.status
    throw error
  }

  return data
}

export const fetchEventStatus = async (eventId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  // Determine user status from participants list, since we don't have user_id, 
  // wait we just return data for now and let the component handle it or we assume it's just one object if there's an endpoint for me
  return data
}

export const fetchUserProfile = async (token: string) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return token.includes('admin') ? mockAdminUser : mockUser
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const updateUserProfile = async (userData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: userData
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const loginAdmin = async (credentials: { email: string; password: string }) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    const mockPayload = {
      id: 2,
      name: 'Admin User',
      email: credentials.email,
      is_admin: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }
    const base64UrlEncode = (str: string) => {
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = base64UrlEncode(JSON.stringify(mockPayload))
    const token = `${header}.${body}.mock-signature`
    
    return { message: 'Login admin berhasil', access_token: token, token_type: 'Bearer' }
  }
  
  // New API just uses /auth/login for everyone
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message || data.error
    throw error
  }

  return data
}

export const createEvent = async (eventData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Do NOT set Content-Type for FormData, browser sets it automatically with boundary
    },
    body: eventData
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const updateEvent = async (eventId: number, eventData: FormData, token: string) => {
  // According to Laravel REST, updating with FormData usually requires _method=PATCH inside body or query
  eventData.append('_method', 'PATCH')
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'POST', // We use POST but fake it with _method=PATCH
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: eventData
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const fetchEventParticipants = async (eventId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message)
  }

  return response.json()
}

export const checkInParticipant = async (eventId: number, uniqueCode: string, token: string) => {
  // Using PATCH on the participant endpoint if we know their ID, but uniqueCode might be another logic
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${uniqueCode}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'attended' })
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const fetchEventDetails = async (eventId: number) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message)
  }

  return response.json()
}

export const logout = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const deleteEvent = async (eventId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}
