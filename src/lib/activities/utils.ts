/* eslint-disable @typescript-eslint/no-explicit-any */
export type ActivityCategory =
  | 'ritual'
  | 'ancestral-worship'
  | 'deity-festival'
  | 'cultural-celebration'
  | 'social-activity'

export type ActivityRecurrenceType =
  | 'annual-lunar'
  | 'annual-gregorian'
  | 'periodic'
  | 'one-time'
  | 'incidental'

export type ActivityScheduleStatus =
  | 'scheduled'
  | 'tentative'
  | 'rescheduled'
  | 'unscheduled'

export type ActivityLunarRuleType =
  | 'exact_date'
  | 'first_half'
  | 'second_half'
  | 'custom_period'
  | 'none'

export type ActivityLocationType = 'internal' | 'external' | 'hybrid'

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: { id: string; en: string } }[] = [
  { value: 'ritual', label: { id: 'Ritual Keagamaan', en: 'Religious Ritual' } },
  { value: 'ancestral-worship', label: { id: 'Sembahyang Leluhur', en: 'Ancestral Worship' } },
  { value: 'deity-festival', label: { id: 'Hari Kebesaran Dewa', en: 'Deity Festival' } },
  { value: 'cultural-celebration', label: { id: 'Perayaan Budaya', en: 'Cultural Celebration' } },
  { value: 'social-activity', label: { id: 'Kegiatan Sosial', en: 'Social Activity' } },
]

export const ACTIVITY_RECURRENCE_TYPES: { value: ActivityRecurrenceType; label: { id: string; en: string } }[] = [
  { value: 'annual-lunar', label: { id: 'Tahunan (Kalender Imlek)', en: 'Annual (Lunar Calendar)' } },
  { value: 'annual-gregorian', label: { id: 'Tahunan (Kalender Masehi)', en: 'Annual (Gregorian Calendar)' } },
  { value: 'periodic', label: { id: 'Periode Tertentu', en: 'Periodic Rule' } },
  { value: 'one-time', label: { id: 'Satu Kali Pelaksanaan', en: 'One-Time Event' } },
  { value: 'incidental', label: { id: 'Insidental / Kondisional', en: 'Incidental / Conditional' } },
]

export const ACTIVITY_SCHEDULE_STATUSES: {
  value: ActivityScheduleStatus
  label: { id: string; en: string }
  badgeClass: string
}[] = [
  {
    value: 'scheduled',
    label: { id: 'Jadwal Ditetapkan', en: 'Scheduled' },
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    value: 'tentative',
    label: { id: 'Perkiraan / Menunggu Konfirmasi', en: 'Tentative / Pending' },
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    value: 'rescheduled',
    label: { id: 'Jadwal Diubah', en: 'Rescheduled' },
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    value: 'unscheduled',
    label: { id: 'Belum Ditentukan', en: 'Unscheduled' },
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  },
]

export const ACTIVITY_LUNAR_RULES: { value: ActivityLunarRuleType; label: { id: string; en: string } }[] = [
  { value: 'exact_date', label: { id: 'Tanggal Tetap Imlek', en: 'Exact Lunar Date' } },
  { value: 'first_half', label: { id: 'Paruh Pertama Bulan Imlek (Tgl 1–15)', en: 'First Half of Lunar Month (Days 1–15)' } },
  { value: 'second_half', label: { id: 'Paruh Kedua Bulan Imlek (Tgl 16–30)', en: 'Second Half of Lunar Month (Days 16–30)' } },
  { value: 'custom_period', label: { id: 'Aturan Periode Khusus / Rentang', en: 'Custom Period Rule' } },
  { value: 'none', label: { id: 'Tidak Menggunakan Kalender Imlek', en: 'None (Gregorian Only)' } },
]

export const ACTIVITY_LOCATION_TYPES: { value: ActivityLocationType; label: { id: string; en: string } }[] = [
  { value: 'internal', label: { id: 'Klenteng Tek Hay Bio (Internal)', en: 'Tek Hay Bio Temple (Internal)' } },
  { value: 'external', label: { id: 'Lokasi Lain / Eksternal', en: 'External Location' } },
  { value: 'hybrid', label: { id: 'Klenteng Tek Hay Bio & Lokasi Eksternal', en: 'Internal & External Location' } },
]

export function getActivityCategoryLabel(category?: string | null, locale: 'id' | 'en' = 'id'): string {
  const match = ACTIVITY_CATEGORIES.find((c) => c.value === category)
  if (match) return match.label[locale]
  // Fallbacks for legacy values if any
  if (category === 'cultural') return locale === 'id' ? 'Perayaan Budaya' : 'Cultural Celebration'
  if (category === 'social') return locale === 'id' ? 'Kegiatan Sosial' : 'Social Activity'
  return locale === 'id' ? 'Ritual Keagamaan' : 'Religious Ritual'
}

export function getActivityRecurrenceLabel(type?: string | null, locale: 'id' | 'en' = 'id'): string {
  const match = ACTIVITY_RECURRENCE_TYPES.find((r) => r.value === type)
  return match ? match.label[locale] : (locale === 'id' ? 'Tahunan (Imlek)' : 'Annual (Lunar)')
}

export function getActivityScheduleStatus(status?: string | null, locale: 'id' | 'en' = 'id') {
  const match = ACTIVITY_SCHEDULE_STATUSES.find((s) => s.value === status)
  return match || {
    value: 'scheduled' as ActivityScheduleStatus,
    label: { id: 'Jadwal Ditetapkan', en: 'Scheduled' },
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
}

export function formatGregorianDateRange(
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

export function formatLunarDate(activity: any, locale: 'id' | 'en' = 'id'): string | null {
  const ruleType = activity.lunarRuleType || (activity.lunarDay || activity.lunarMonth ? 'exact_date' : 'none')

  if (ruleType === 'none') return null

  if (ruleType === 'exact_date') {
    if (!activity.lunarMonth && !activity.lunarDay) return null
    const day = activity.lunarDay ? (locale === 'id' ? `Tgl ${activity.lunarDay}` : `Day ${activity.lunarDay}`) : ''
    const leap = activity.isLeapMonth ? (locale === 'id' ? ' (Kabisat)' : ' (Leap)') : ''
    const month = activity.lunarMonth
      ? locale === 'id'
        ? `Bulan ${activity.lunarMonth}${leap} Imlek`
        : `Month ${activity.lunarMonth}${leap} Lunar`
      : 'Imlek'
    return [day, month].filter(Boolean).join(' ')
  }

  if (ruleType === 'first_half') {
    const month = activity.lunarMonth ? ` ${activity.lunarMonth}` : ''
    return locale === 'id'
      ? `Paruh Pertama Bulan${month} Imlek (Tgl 1–15)`
      : `First Half of Month${month} Lunar (Days 1–15)`
  }

  if (ruleType === 'second_half') {
    const month = activity.lunarMonth ? ` ${activity.lunarMonth}` : ''
    return locale === 'id'
      ? `Paruh Kedua Bulan${month} Imlek (Tgl 16–30)`
      : `Second Half of Month${month} Lunar (Days 16–30)`
  }

  if (ruleType === 'custom_period' || activity.lunarPeriodDescription) {
    if (activity.lunarPeriodDescription) {
      if (typeof activity.lunarPeriodDescription === 'string') return activity.lunarPeriodDescription
      return activity.lunarPeriodDescription[locale] || activity.lunarPeriodDescription.id || null
    }
    return locale === 'id' ? 'Periode Tertentu Berdasarkan Kalender Imlek' : 'Specific Period (Lunar)'
  }

  return null
}
