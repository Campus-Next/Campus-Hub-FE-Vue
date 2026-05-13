import type { CategoryConfig } from '../types'

export const CATEGORY_IDS = {
  WEBINAR: '1',
  SEMINAR: '2',
  KULIAH_TAMU: '3',
  WORKSHOP: '4',
  SERTIFIKASI: '5'
} as const

export const CATEGORIES: Record<string, CategoryConfig> = {
  webinar: {
    id: CATEGORY_IDS.WEBINAR,
    name: 'Webinar',
    title: 'Jelajahi Webinar',
    route: '/webinar'
  },
  seminar: {
    id: CATEGORY_IDS.SEMINAR,
    name: 'Seminar',
    title: 'Jelajahi Seminar',
    route: '/seminar'
  },
  'kuliah-tamu': {
    id: CATEGORY_IDS.KULIAH_TAMU,
    name: 'Kuliah Tamu',
    title: 'Jelajahi Kuliah Tamu',
    route: '/kuliah-tamu'
  },
  workshop: {
    id: CATEGORY_IDS.WORKSHOP,
    name: 'Workshop',
    title: 'Jelajahi Workshop',
    route: '/workshop'
  },
  sertifikasi: {
    id: CATEGORY_IDS.SERTIFIKASI,
    name: 'Sertifikasi',
    title: 'Jelajahi Sertifikasi',
    route: '/sertifikasi'
  }
}

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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL
