import { MOCK_ENABLED, mockEvents, mockCategoryEvents, mockUser, mockAdminUser } from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper untuk delay mock response
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

export interface Event {
  id: number
  foto_event: string
  category_name: string
  accessibility: string
  judul: string
  deskripsi: string
  date: string
  foto_pembicara: string
  pembicara: string
  role: string
}

export interface EventsResponse {
  events: Event[]
  trending: number
  category: number
}

export const fetchEvents = async (category?: string): Promise<any> => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return category ? mockCategoryEvents : mockEvents
  }
  
  const endpoint = category ? `/events?category=${category}` : '/events'
  const response = await fetch(`${API_BASE_URL}${endpoint}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message)
  }

  return response.json()
}

export const fetchEvent = async (id: number) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return mockEvents.events.find(e => e.id === id) || mockEvents.events[0]
  }
  
  const response = await fetch(`${API_BASE_URL}/events/${id}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message)
  }

  return response.json()
}

export const login = async (credentials: { email: string; password: string }) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    const mockPayload = {
      id: 1,
      fullname: 'Test User',
      email: credentials.email,
      phone: '081234567890',
      is_admin: false,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }
    // Encode to base64url (JWT format)
    const base64UrlEncode = (str: string) => {
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = base64UrlEncode(JSON.stringify(mockPayload))
    const signature = 'mock-signature'
    const token = `${header}.${body}.${signature}`
    
    return {
      message: 'Login berhasil',
      access_token: token,
      token_type: 'Bearer'
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/login/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
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
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
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
  const response = await fetch(`${API_BASE_URL}/my-events/${eventId}/cancel`, {
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
  const response = await fetch(`${API_BASE_URL}/my-events/${eventId}/kode-unik`, {
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
    return { events: [] }
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
  const response = await fetch(`${API_BASE_URL}/my-events/${eventId}/status`, {
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

export const fetchUserProfile = async (token: string) => {
  if (MOCK_ENABLED) {
    await mockDelay()
    return token.includes('admin') ? mockAdminUser : mockUser
  }
  
  const response = await fetch(`${API_BASE_URL}/user`, {
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
      fullname: 'Admin User',
      email: credentials.email,
      phone: '081234567891',
      is_admin: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }
    // Encode to base64url (JWT format)
    const base64UrlEncode = (str: string) => {
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = base64UrlEncode(JSON.stringify(mockPayload))
    const signature = 'mock-signature'
    const token = `${header}.${body}.${signature}`
    
    return {
      message: 'Login admin berhasil',
      access_token: token,
      token_type: 'Bearer'
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/login/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error()
    ;(error as any).data = data.message
    throw error
  }

  return data
}

export const createEvent = async (eventData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
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

export const updateEvent = async (eventId: number, eventData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'POST',
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
  const response = await fetch(`${API_BASE_URL}/my-events/${eventId}/participants`, {
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
  const response = await fetch(`${API_BASE_URL}/my-events/${eventId}/check-in`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ kode: uniqueCode })
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
