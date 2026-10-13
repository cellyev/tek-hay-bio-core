/* eslint-disable @typescript-eslint/no-explicit-any */
export type AlbumCategory =
  | 'ritual'
  | 'ancestral-worship'
  | 'deity-festival'
  | 'cultural-celebration'
  | 'social-activity'
  | 'other'

export const ALBUM_CATEGORIES: {
  value: AlbumCategory
  label: { id: string; en: string }
}[] = [
  { value: 'ritual', label: { id: 'Ritual Keagamaan', en: 'Religious Ritual' } },
  { value: 'ancestral-worship', label: { id: 'Sembahyang Leluhur', en: 'Ancestral Worship' } },
  { value: 'deity-festival', label: { id: 'Hari Kebesaran Dewa', en: 'Deity Festival' } },
  { value: 'cultural-celebration', label: { id: 'Perayaan Budaya', en: 'Cultural Celebration' } },
  { value: 'social-activity', label: { id: 'Kegiatan Sosial', en: 'Social Activity' } },
  { value: 'other', label: { id: 'Dokumentasi Lainnya', en: 'Other Documentation' } },
]

export function getAlbumCategoryLabel(category?: string | null, locale: 'id' | 'en' = 'id'): string {
  const match = ALBUM_CATEGORIES.find((c) => c.value === category)
  return match ? match.label[locale] : (locale === 'id' ? 'Dokumentasi Acara' : 'Event Documentation')
}

export function isMediaVideo(media: any): boolean {
  if (!media) return false
  if (media.mediaType === 'video') return true
  const mime = media.mimeType || media.mimetype || ''
  if (typeof mime === 'string' && mime.startsWith('video/')) return true
  const filename = media.filename || media.url || ''
  if (typeof filename === 'string') {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['mp4', 'webm', 'mov', 'ogg', 'mkv'].includes(ext || '')) return true
  }
  return false
}

export function countAlbumMedia(mediaItems?: any[]): {
  photosCount: number
  videosCount: number
  total: number
} {
  if (!Array.isArray(mediaItems)) {
    return { photosCount: 0, videosCount: 0, total: 0 }
  }

  let photosCount = 0
  let videosCount = 0

  for (const item of mediaItems) {
    const mediaDoc = item.media || item
    if (isMediaVideo(mediaDoc)) {
      videosCount++
    } else {
      photosCount++
    }
  }

  return {
    photosCount,
    videosCount,
    total: mediaItems.length,
  }
}

export function formatEventDateRange(
  startDateStr?: string | null,
  endDateStr?: string | null,
  locale: 'id' | 'en' = 'id'
): string | null {
  if (!startDateStr) return null

  const startDate = new Date(startDateStr)
  if (isNaN(startDate.getTime())) return null

  const startFormatted = startDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (!endDateStr) return startFormatted

  const endDate = new Date(endDateStr)
  if (isNaN(endDate.getTime())) return startFormatted

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  if (isSameDay) return startFormatted

  const isSameMonthAndYear =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()

  if (isSameMonthAndYear) {
    if (locale === 'id') {
      const monthYear = startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      return `${startDate.getDate()} – ${endDate.getDate()} ${monthYear}`
    } else {
      const month = startDate.toLocaleDateString('en-US', { month: 'short' })
      return `${month} ${startDate.getDate()} – ${endDate.getDate()}, ${startDate.getFullYear()}`
    }
  }

  const endFormatted = endDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `${startFormatted} – ${endFormatted}`
}
