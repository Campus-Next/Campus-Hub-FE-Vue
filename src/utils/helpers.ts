import { CATEGORIES } from '../constants'

export function getCategoryRoute(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Seminar': CATEGORIES.seminar.route,
    'Webinar': CATEGORIES.webinar.route,
    'Kuliah Tamu': CATEGORIES['kuliah-tamu'].route,
    'Sertifikasi': CATEGORIES.sertifikasi.route,
    'Workshop': CATEGORIES.workshop.route
  }

  return categoryMap[categoryName] || '/'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  return timeString
}
