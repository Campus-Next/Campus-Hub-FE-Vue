import type {
  Cart,
  Category,
  CheckoutResult,
  Event,
  EventLink,
  EventParticipant,
  ParticipantStatus,
  User,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface ApiError extends Error {
  data?: any
  status?: number
  body?: any
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
    err.body = body
    throw err
  }

  if (options.unwrap && body && typeof body === 'object' && 'data' in body) {
    return body.data as T
  }
  return body as T
}

// ===== Auth =====

export const login = (credentials: { email: string; password: string }) =>
  request<{ access_token: string; token_type: string; expires_in: number; user: User; roles: string[] }>(
    '/auth/login',
    {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(credentials),
    },
    { unwrap: false },
  )

export const register = (payload: { name: string; email: string; password: string }) =>
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
  search?: string
  sort?: string
  page?: number
  per_page?: number
}

export interface ListQuery extends EventListQuery {
  status?: string
  scope?: string
}

export interface ListMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  counts?: Record<string, number>
}

export interface Paginated<T> {
  items: T[]
  meta: ListMeta | null
}

const buildListParams = (query: ListQuery): string => {
  const params = new URLSearchParams()
  if (query.scope) params.set('scope', query.scope)
  if (query.category) params.set('category', query.category)
  if (query.category_id) params.set('category_id', String(query.category_id))
  if (query.search) params.set('search', query.search)
  if (query.sort) params.set('sort', query.sort)
  if (query.status && query.status.toLowerCase() !== 'all') params.set('status', query.status.toLowerCase())
  if (query.page) params.set('page', String(query.page))
  if (query.per_page) params.set('per_page', String(query.per_page))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

// Listing requests opt into server-side pagination by sending page/per_page;
// the backend then returns { data: [...], meta: {...} }. Returns both.
async function requestList<T>(path: string, init: RequestInit): Promise<Paginated<T>> {
  const body = await request<any>(path, init, { unwrap: false })
  const items = Array.isArray(body?.data) ? (body.data as T[]) : []
  const meta = body && typeof body === 'object' && body.meta ? (body.meta as ListMeta) : null
  return { items, meta }
}

export const fetchEvents = (query: EventListQuery = {}) => {
  const params = new URLSearchParams()
  if (query.category) params.set('category', query.category)
  if (query.category_id) params.set('category_id', String(query.category_id))
  const qs = params.toString()
  return request<Event[]>(`/events${qs ? `?${qs}` : ''}`, { method: 'GET' })
}

export const fetchEventsPage = (query: ListQuery = {}) =>
  requestList<Event>(`/events${buildListParams(query)}`, { method: 'GET' })

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
  request<Event[]>('/my-events?scope=organized', { method: 'GET', headers: buildHeaders(token) })

export const fetchMyOrganizedEventsPage = (token: string, query: ListQuery = {}) =>
  requestList<Event>(`/my-events${buildListParams({ ...query, scope: 'organized' })}`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

// ===== Event participation =====

export const enrollEvent = (eventId: number | string, token: string) =>
  request<EventParticipant>(`/events/${eventId}/enroll`, {
    method: 'POST',
    headers: buildHeaders(token),
  })

export const cancelRegistration = (eventId: number | string, token: string) =>
  request<EventParticipant>(
    `/events/${eventId}/enroll`,
    {
      method: 'DELETE',
      headers: buildHeaders(token),
    },
  )

export const fetchMyRegisteredEvents = (token: string) =>
  request<EventParticipant[]>('/my-events?scope=registered', { method: 'GET', headers: buildHeaders(token) })

export const fetchMyRegisteredEventsPage = (token: string, query: ListQuery = {}) =>
  requestList<EventParticipant>(`/my-events${buildListParams({ ...query, scope: 'registered' })}`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

export const fetchUniqueCode = (eventId: number | string, token: string) =>
  request<{ unique_code: string | null; status: ParticipantStatus }>(`/events/${eventId}/my-code`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

export const fetchEventParticipants = (eventId: number | string, token: string) =>
  request<EventParticipant[]>(`/events/${eventId}/participants`, {
    method: 'GET',
    headers: buildHeaders(token),
  })

export const fetchEventParticipantsPage = (
  eventId: number | string,
  token: string,
  query: ListQuery = {},
) =>
  requestList<EventParticipant>(`/events/${eventId}/participants${buildListParams(query)}`, {
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
  payload: { event_id: number },
  token: string,
) =>
  request<Cart>('/carts', {
    method: 'POST',
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
  request<CheckoutResult>('/carts/checkout', {
    method: 'POST',
    headers: buildHeaders(token),
  })
