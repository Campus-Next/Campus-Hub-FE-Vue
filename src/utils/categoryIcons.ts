const CATEGORY_ICONS: Record<string, string> = {
  seminar: 'ri-presentation-line',
  workshop: 'ri-tools-line',
  competition: 'ri-trophy-line',
  webinar: 'ri-live-line',
  career: 'ri-briefcase-line',
  sport: 'ri-basketball-line',
  art: 'ri-palette-line',
  volunteer: 'ri-hand-heart-line',
}

export const getCategoryIcon = (name?: string | null) =>
  CATEGORY_ICONS[(name ?? '').trim().toLowerCase()] ?? 'ri-apps-2-line'
