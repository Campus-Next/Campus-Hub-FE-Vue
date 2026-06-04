interface UploadErrorLike {
  body?: {
    message?: string
    detail?: string
    quarantine_path?: string
  } | null
  data?: unknown
  message?: string
  status?: number
}

const asText = (value: unknown) => typeof value === 'string' ? value : ''

export function formatEventUploadError(error: UploadErrorLike): string {
  const message = error.body?.message || asText(error.data) || error.message || ''
  const detail = error.body?.detail || ''

  if (message === 'Malware detected' || detail.includes(' FOUND')) {
    return [
      'Upload ditolak oleh ClamAV.',
      'File terdeteksi malware, tidak disimpan ke server, dan sudah dicatat untuk PoC quarantine.',
      'Silakan pilih file lain yang bersih.',
    ].join(' ')
  }

  if (message === 'ClamAV scanner unavailable' || error.status === 503) {
    return [
      'Upload belum bisa diproses karena scanner ClamAV tidak tersedia.',
      'File tidak disimpan ke server. Pastikan clamd aktif, lalu coba upload lagi.',
    ].join(' ')
  }

  return asText(error.data) || 'Upload gagal diproses. Silakan coba lagi.'
}
