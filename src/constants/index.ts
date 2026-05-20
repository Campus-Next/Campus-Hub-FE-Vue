export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  TOKEN_TYPE: 'token_type',
  MENU_OPEN: 'isMenuOpen'
} as const

export const EVENT_STATUS = {
  REGISTERED: 'registered',
  CANCELLED: 'cancelled',
  ATTENDED: 'attended',
  ABSENT: 'absent'
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL
