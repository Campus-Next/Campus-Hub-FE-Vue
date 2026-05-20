import type {
  ApiEnvelope,
  Cart,
  Category,
  Event,
  EventLink,
  EventParticipant,
  User,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface ApiError extends Error {
  data?: any
  status?: number
}

const buildHeaders = (token?: string, json = false): HeadersInit => {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: { unwrap?: boolean } = { unwrap: true },
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)
  let body: any = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    let errMsg = body?.message || response.statusText
    if (body?.errors && typeof body.errors === 'object') {
      const errorList = Object.values(body.errors).flat()
      if (errorList.length > 0) {
        errMsg = errorList.join(', ')
      }
    }
    const err: ApiError = new Error(errMsg)
    err.data = errMsg
    err.status = response.status
    throw err
  }

  if (options.unwrap && body && typeof body === 'object' && 'data' in body) {
    return body.data as T
  }
  return body as T
}

// ===== Auth =====

export const login = (credentials: { email: string; password: string; remember?: boolean }) =>
  request<{ access_token: string; token_type: string; expires_in: number; user: User; roles: string[] }>(
    '/auth/login',
    {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(credentials),
    },
    { unwrap: false },
  )

export const register = (payload: { name: string; email: string; password: string; password_confirmation: string }) =>
  request<{ message: string }>(
    '/auth/register',
    {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(payload),
    },
    { unwrap: false },
  )

export const logout = (token: string) =>
  request<{ message: string }>(
    '/auth/logout',
    {
      method: 'POST',
      headers: buildHeaders(token),
    },
    { unwrap: false },
  )

export const fetchUserProfile = (token: string) =>
  request<User>('/auth/me', { method: 'GET', headers: buildHeaders(token) })

export const updateUserProfile = (payload: { name?: string; email?: string }, token: string) =>
  request<User>('/auth/me', {
    method: 'PATCH',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  })

export const updatePassword = (
  payload: { current_password: string; password: string; password_confirmation: string },
  token: string,
) =>
  request<{ message: string }>(
    '/auth/password',
    {
      method: 'PATCH',
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload),
    },
    { unwrap: false },
  )

export const deleteAccount = (token: string) =>
  request<{ message: string }>(
    '/auth/me',
    {
      method: 'DELETE',
      headers: buildHeaders(token),
    },
    { unwrap: false },
  )

// ===== Categories =====

export const fetchCategories = () =>
  request<Category[]>('/categories', { method: 'GET' })

// ===== Events =====

export interface EventListQuery {
  category?: string
  category_id?: number
}

export const fetchEvents = (query: EventListQuery = {}) => {
  const params = new URLSearchParams()
  if (query.category) params.set('category', query.category)
  if (query.category_id) params.set('category_id', String(query.category_id))
  const qs = params.toString()
  return request<Event[]>(`/events${qs ? `?${qs}` : ''}`, { method: 'GET' })
}

export const fetchEvent = (id: number | string) =>
  request<Event>(`/events/${id}`, { method: 'GET' })

export const createEvent = (eventData: FormData, token: string) =>
  request<Event>('/events', {
    method: 'POST',
    headers: buildHeaders(token),
    body: eventData,
  })

export const updateEvent = (eventId: number | string, eventData: FormData, token: string) => {
  eventData.append('_method', 'PATCH')
  return request<Event>(`/events/${eventId}`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: eventData,
  })
}

export const deleteEvent = (eventId: number | string, token: string) =>
  request<{ message: string }>(
    `/events/${eventId}`,
    { method: 'DELETE', headers: buildHeaders(token) },
    { unwrap: false },
  )

export const fetchMyOrganizedEvents = (token: string) =>
  request<Event[]>('/events/me/organized', { method: 'GET', headers: buildHeaders(token) })

// ===== Event participation =====

export const enrollEvent = (eventId: number | string, token: string) =>
  request<EventParticipant>(`/events/${eventId}/enroll`, {
    method: 'POST',
    headers: buildHeaders(token),
  })

export const cancelRegistration = (eventId: number | string, token: string) =>
  request<{ message: string }>(
    `/events/${eventId}/enroll`,
    {
      method: 'DELETE',
      headers: buildHeaders(token),
    },
    { unwrap: false },
  )

export const fetchMyEvents = (token: string) =>
  request<EventParticipant[]>('/my-events', { method: 'GET', headers: buildHeaders(token) })

export const fetchUniqueCode = (eventId: number | string, token: string) =>
  request<{ unique_code: string | null; status: string }>(`/events/${eventId}/my-code`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

export const fetchEventParticipants = (eventId: number | string, token: string) =>
  request<EventParticipant[]>(`/events/${eventId}/participants`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

export const checkInParticipant = (eventId: number | string, code: string, token: string) =>
  request<EventParticipant & { name?: string; message?: string }>(`/events/${eventId}/check-in`, {
    method: 'POST',
    headers: buildHeaders(token, true),
    body: JSON.stringify({ code }),
  })

// ===== Event links =====

export const fetchEventLinks = (eventId: number | string, token?: string) =>
  request<EventLink[]>(`/events/${eventId}/links`, { method: 'GET', headers: buildHeaders(token) })

export const createEventLink = (
  eventId: number | string,
  payload: { title: string; url: string },
  token: string,
) =>
  request<EventLink>(`/events/${eventId}/links`, {
    method: 'POST',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  })

export const updateEventLink = (
  eventId: number | string,
  linkId: number | string,
  payload: { title?: string; url?: string },
  token: string,
) =>
  request<EventLink>(`/events/${eventId}/links/${linkId}`, {
    method: 'PATCH',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  })

export const deleteEventLink = (eventId: number | string, linkId: number | string, token: string) =>
  request<{ message: string }>(
    `/events/${eventId}/links/${linkId}`,
    { method: 'DELETE', headers: buildHeaders(token) },
    { unwrap: false },
  )

// ===== Cart =====

export const fetchCart = (token: string) =>
  request<Cart[]>('/carts', { method: 'GET', headers: buildHeaders(token) })

export const addToCart = (
  payload: { event_id: number; quantity?: number },
  token: string,
) =>
  request<Cart>('/carts', {
    method: 'POST',
    headers: buildHeaders(token, true),
    body: JSON.stringify({ quantity: 1, ...payload }),
  })

export const updateCartItem = (
  cartId: number | string,
  payload: { quantity: number },
  token: string,
) =>
  request<Cart>(`/carts/${cartId}`, {
    method: 'PATCH',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  })

export const removeCartItem = (cartId: number | string, token: string) =>
  request<{ message: string }>(
    `/carts/${cartId}`,
    { method: 'DELETE', headers: buildHeaders(token) },
    { unwrap: false },
  )

export const checkoutCart = (token: string) =>
  request<EventParticipant[]>('/carts/checkout', {
    method: 'POST',
    headers: buildHeaders(token),
  })

// ===== Backwards-compatibility shim =====

export const registerEventWithToken = enrollEvent
export const fetchEventDetails = fetchEvent
export const fetchEventStatus = async (eventId: number | string, token: string) => {
  const code = await fetchUniqueCode(eventId, token)
  return { status: code.status }
}

export type { ApiEnvelope }
