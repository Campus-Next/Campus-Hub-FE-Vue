import defaultPoster from '../assets/image/Poster.svg'

export function resolveStorageUrl(path?: string | null): string {
  if (!path) return defaultPoster
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path
  }
  const storage = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage'
  return `${storage.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export function getEventImageUrl(event: any): string {
  if (event && event.images && event.images.length > 0) {
    return resolveStorageUrl(event.images[0].path)
  }
  return defaultPoster
}
