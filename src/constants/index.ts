export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  TOKEN_TYPE: 'token_type',
  TOKEN_EXPIRES_AT: 'token_expires_at',
  ROLES: 'roles',
  MENU_OPEN: 'isMenuOpen'
} as const

export const EVENT_STATUS = {
  REGISTERED: 'registered',
  ATTENDED: 'attended',
  ABSENT: 'absent',
  CANCELLED: 'cancelled'
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL
