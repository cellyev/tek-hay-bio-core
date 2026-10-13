/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lunar, Solar } from 'lunar-typescript'
import {
  ActivityCategory,
  ActivityRecurrenceType,
  ActivityScheduleStatus,
  formatGregorianDateRange,
  formatLunarDate,
  getActivityCategoryLabel,
  getActivityScheduleStatus,
} from './utils'

export interface ActivityOccurrence {
  activity: any
  id: string
  slug: string
  title: string
  category: ActivityCategory
  recurrenceType: ActivityRecurrenceType
  scheduleStatus: ActivityScheduleStatus
  // Resolved Gregorian date for target year
  startDateStr: string | null // 'YYYY-MM-DD'
  endDateStr: string | null // 'YYYY-MM-DD'
  month: number | null // 1 - 12
  day: number | null // 1 - 31
  isMultiDay: boolean
  isEstimated: boolean
  hasConfirmedDate: boolean
  // Formatted labels
  gregorianDateLabel: string | null
  lunarDateLabel: string | null
  scheduleStatusLabel: { id: string; en: string }
  scheduleStatusBadgeClass: string
  categoryLabel: string
  locationLabel: string
  locationType: string
  shortDescription: string
  deity: string | null
  featuredImage: any
}

export interface CalendarDayCell {
  dateStr: string // 'YYYY-MM-DD'
  year: number
  month: number
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  lunarText: string // e.g. "初一" or "15"
  lunarMonthDay: string // e.g. "1/15"
  occurrences: ActivityOccurrence[]
}

/**
 * Format a Date object to YYYY-MM-DD string in local/UTC safe manner
 */
export function formatToYmd(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parses YYYY-MM-DD to a UTC Date object
 */
export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/**
 * Add days to YYYY-MM-DD string
 */
export function addDaysToYmd(ymd: string, days: number): string {
  const date = parseYmd(ymd)
  date.setUTCDate(date.getUTCDate() + days)
  return formatToYmd(date)
}

/**
 * Converts a Lunar Date to Solar Date in a given Gregorian target year.
 * Handles leap months and months with 29 vs 30 days safely.
 */
export function resolveLunarToSolarDatesInYear(
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean,
  targetYear: number
): string[] {
  const results: string[] = []
  // Chinese lunar year targetYear - 1, targetYear, targetYear + 1 could fall in targetYear
  for (const y of [targetYear - 1, targetYear, targetYear + 1]) {
    let lunarObj: Lunar | null = null

    // 1. Try exact leap/non-leap month and day
    try {
      const m = isLeapMonth ? -lunarMonth : lunarMonth
      lunarObj = Lunar.fromYmd(y, m, lunarDay)
    } catch {
      // Fallback 1: if leap month doesn't exist in year y, try non-leap month
      if (isLeapMonth) {
        try {
          lunarObj = Lunar.fromYmd(y, lunarMonth, lunarDay)
        } catch {}
      }
      // Fallback 2: if day 30 doesn't exist in 29-day month
      if (!lunarObj && lunarDay === 30) {
        try {
          const m = isLeapMonth ? -lunarMonth : lunarMonth
          lunarObj = Lunar.fromYmd(y, m, 29)
        } catch {
          try {
            lunarObj = Lunar.fromYmd(y, lunarMonth, 29)
          } catch {}
        }
      }
    }

    if (lunarObj) {
      const solar = lunarObj.getSolar()
      if (solar.getYear() === targetYear) {
        results.push(solar.toYmd())
      }
    }
  }

  return results
}

/**
 * Resolves all activities into occurrences for a specific target year.
 * Distinguishes between scheduled events (with exact date in target year)
 * and unscheduled / conditional / period-based events.
 */
export function resolveActivityOccurrences(
  activities: any[],
  targetYear: number,
  locale: 'id' | 'en' = 'id'
): { scheduled: ActivityOccurrence[]; unscheduled: ActivityOccurrence[] } {
  const scheduled: ActivityOccurrence[] = []
  const unscheduled: ActivityOccurrence[] = []

  for (const activity of activities) {
    if (activity.status && activity.status !== 'published') {
      continue
    }

    const id = String(activity.id || '')
    const slug = activity.slug || ''
    const title =
      typeof activity.title === 'string'
        ? activity.title
        : activity.title?.[locale] || activity.title?.id || ''
    const category: ActivityCategory = activity.category || 'ritual'
    const recurrenceType: ActivityRecurrenceType = activity.recurrenceType || 'annual-lunar'
    const scheduleStatus: ActivityScheduleStatus = activity.scheduleStatus || 'scheduled'
    const scheduleStatusObj = getActivityScheduleStatus(scheduleStatus, locale)
    const categoryLabel = getActivityCategoryLabel(category, locale)
    const lunarDateLabel = formatLunarDate(activity, locale)

    let locationLabel =
      activity.locationType === 'external'
        ? locale === 'id'
          ? 'Lokasi Eksternal'
          : 'External Location'
        : activity.locationType === 'hybrid'
          ? locale === 'id'
            ? 'Klenteng & Eksternal'
            : 'Internal & External'
          : 'Klenteng Tek Hay Bio'

    if (activity.locationCustom) {
      const customLoc =
        typeof activity.locationCustom === 'string'
          ? activity.locationCustom
          : activity.locationCustom[locale] || activity.locationCustom.id
      if (customLoc) locationLabel = customLoc
    }

    const shortDescription =
      typeof activity.shortDescription === 'string'
        ? activity.shortDescription
        : activity.shortDescription?.[locale] || activity.shortDescription?.id || ''

    const deity =
      typeof activity.deity === 'string'
        ? activity.deity
        : activity.deity?.[locale] || activity.deity?.id || null

    const featuredImage = activity.featuredImage || null

    // Determine duration in days if DB has both date & endDate
    let durationDays = 0
    if (activity.date && activity.endDate) {
      const d1 = new Date(activity.date).getTime()
      const d2 = new Date(activity.endDate).getTime()
      if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
        durationDays = Math.round((d2 - d1) / 86400000)
      }
    }

    // Check if activity has explicit DB date
    const dbDate = activity.date ? new Date(activity.date) : null
    const hasValidDbDate = dbDate !== null && !isNaN(dbDate.getTime())
    const dbDateYear = hasValidDbDate ? dbDate.getUTCFullYear() : null

    // Helper to create occurrence
    const createOccurrence = (
      startDateStr: string | null,
      endDateStr: string | null,
      isEstimated: boolean,
      hasConfirmedDate: boolean
    ): ActivityOccurrence => {
      let month: number | null = null
      let day: number | null = null
      let isMultiDay = false

      if (startDateStr) {
        month = parseInt(startDateStr.slice(5, 7), 10)
        day = parseInt(startDateStr.slice(8, 10), 10)
        if (endDateStr && endDateStr !== startDateStr) {
          isMultiDay = true
        }
      }

      const gregorianDateLabel = startDateStr
        ? formatGregorianDateRange(startDateStr, endDateStr, locale)
        : locale === 'id'
          ? 'Tanggal Belum Ditentukan'
          : 'Date to be Announced'

      return {
        activity,
        id,
        slug,
        title,
        category,
        recurrenceType,
        scheduleStatus,
        startDateStr,
        endDateStr,
        month,
        day,
        isMultiDay,
        isEstimated,
        hasConfirmedDate,
        gregorianDateLabel,
        lunarDateLabel,
        scheduleStatusLabel: scheduleStatusObj.label,
        scheduleStatusBadgeClass: scheduleStatusObj.badgeClass,
        categoryLabel,
        locationLabel,
        locationType: activity.locationType || 'internal',
        shortDescription,
        deity,
        featuredImage,
      }
    }

    // Date Resolution Logic:
    // 1. Confirmed official date matching targetYear
    if (hasValidDbDate && dbDateYear === targetYear) {
      const startDateStr = formatToYmd(dbDate!)
      let endDateStr: string | null = null
      if (activity.endDate) {
        const eDate = new Date(activity.endDate)
        if (!isNaN(eDate.getTime())) {
          endDateStr = formatToYmd(eDate)
        }
      }
      scheduled.push(
        createOccurrence(
          startDateStr,
          endDateStr,
          scheduleStatus === 'tentative',
          true
        )
      )
      continue
    }

    // 2. Annual Lunar recurrence without confirmed targetYear date
    if (recurrenceType === 'annual-lunar') {
      const isExactLunar =
        (activity.lunarRuleType === 'exact_date' || !activity.lunarRuleType) &&
        activity.lunarDay &&
        activity.lunarMonth

      if (isExactLunar) {
        const solarDates = resolveLunarToSolarDatesInYear(
          activity.lunarMonth,
          activity.lunarDay,
          !!activity.isLeapMonth,
          targetYear
        )

        if (solarDates.length > 0) {
          for (const sDate of solarDates) {
            const endDateStr = durationDays > 0 ? addDaysToYmd(sDate, durationDays) : null
            scheduled.push(createOccurrence(sDate, endDateStr, true, false))
          }
          continue
        }
      }

      // If lunar rule is first_half, second_half, custom_period, or lunar date not specified
      unscheduled.push(createOccurrence(null, null, false, false))
      continue
    }

    // 3. Annual Gregorian recurrence
    if (recurrenceType === 'annual-gregorian' && hasValidDbDate) {
      const m = dbDate!.getUTCMonth() + 1
      let d = dbDate!.getUTCDate()
      // Leap year Feb 29 check
      if (m === 2 && d === 29) {
        const isTargetLeap = (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0
        if (!isTargetLeap) d = 28
      }
      const startDateStr = `${targetYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const endDateStr = durationDays > 0 ? addDaysToYmd(startDateStr, durationDays) : null

      scheduled.push(
        createOccurrence(
          startDateStr,
          endDateStr,
          scheduleStatus === 'tentative',
          false
        )
      )
      continue
    }

    // 4. One-time event
    if (recurrenceType === 'one-time') {
      // If dbDate is for another year, it doesn't happen in targetYear. Skip.
      // If it has no date at all:
      if (!hasValidDbDate) {
        unscheduled.push(createOccurrence(null, null, false, false))
      }
      continue
    }

    // 5. Periodic, incidental, or unscheduled
    unscheduled.push(createOccurrence(null, null, false, false))
  }

  // Sort scheduled events chronologically by startDateStr
  scheduled.sort((a, b) => {
    if (!a.startDateStr || !b.startDateStr) return 0
    return a.startDateStr.localeCompare(b.startDateStr)
  })

  return { scheduled, unscheduled }
}

/**
 * Group scheduled occurrences into 12 months (1-indexed, Jan = 1, Dec = 12)
 */
export function groupOccurrencesByMonth(
  occurrences: ActivityOccurrence[]
): Record<number, ActivityOccurrence[]> {
  const grouped: Record<number, ActivityOccurrence[]> = {}
  for (let m = 1; m <= 12; m++) {
    grouped[m] = []
  }
  for (const occ of occurrences) {
    if (occ.month && occ.month >= 1 && occ.month <= 12) {
      grouped[occ.month].push(occ)
    }
  }
  return grouped
}

/**
 * Generates the monthly calendar grid for a specific year and month.
 * Sunday-first (0 = Sunday .. 6 = Saturday).
 */
export function generateMonthGrid(
  year: number,
  month: number, // 1 - 12
  scheduledOccurrences: ActivityOccurrence[]
): {
  cells: CalendarDayCell[]
  monthNameId: string
  monthNameEn: string
} {
  const MONTH_NAMES = [
    { id: 'Januari', en: 'January' },
    { id: 'Februari', en: 'February' },
    { id: 'Maret', en: 'March' },
    { id: 'April', en: 'April' },
    { id: 'Mei', en: 'May' },
    { id: 'Juni', en: 'June' },
    { id: 'Juli', en: 'July' },
    { id: 'Agustus', en: 'August' },
    { id: 'September', en: 'September' },
    { id: 'Oktober', en: 'October' },
    { id: 'November', en: 'November' },
    { id: 'Desember', en: 'December' },
  ]

  const todayStr = formatToYmd(new Date())

  // Days in month
  const daysInCurrentMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  // First day of current month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()

  // Days in previous month
  const prevMonthDate = new Date(Date.UTC(year, month - 1, 0))
  const daysInPrevMonth = prevMonthDate.getUTCDate()
  const prevYear = prevMonthDate.getUTCFullYear()
  const prevMonth = prevMonthDate.getUTCMonth() + 1

  const cells: CalendarDayCell[] = []

  // 1. Previous month padding cells
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    let lunarText = ''
    let lunarMonthDay = ''
    try {
      const solar = Solar.fromYmd(prevYear, prevMonth, day)
      const lunar = solar.getLunar()
      lunarText = lunar.getDayInChinese()
      lunarMonthDay = `${lunar.getMonth()}/${lunar.getDay()}`
    } catch {}

    const dayOccurrences = scheduledOccurrences.filter((occ) => {
      if (!occ.startDateStr) return false
      const end = occ.endDateStr || occ.startDateStr
      return occ.startDateStr <= dateStr && dateStr <= end
    })

    cells.push({
      dateStr,
      year: prevYear,
      month: prevMonth,
      day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      lunarText,
      lunarMonthDay,
      occurrences: dayOccurrences,
    })
  }

  // 2. Current month cells
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    let lunarText = ''
    let lunarMonthDay = ''
    try {
      const solar = Solar.fromYmd(year, month, day)
      const lunar = solar.getLunar()
      lunarText = lunar.getDayInChinese()
      lunarMonthDay = `${lunar.getMonth()}/${lunar.getDay()}`
    } catch {}

    const dayOccurrences = scheduledOccurrences.filter((occ) => {
      if (!occ.startDateStr) return false
      const end = occ.endDateStr || occ.startDateStr
      return occ.startDateStr <= dateStr && dateStr <= end
    })

    cells.push({
      dateStr,
      year,
      month,
      day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      lunarText,
      lunarMonthDay,
      occurrences: dayOccurrences,
    })
  }

  // 3. Next month padding cells to complete rows (up to 35 or 42 cells)
  const remainingCells = (7 - (cells.length % 7)) % 7
  const nextMonthDate = new Date(Date.UTC(year, month, 1))
  const nextYear = nextMonthDate.getUTCFullYear()
  const nextMonth = nextMonthDate.getUTCMonth() + 1

  for (let day = 1; day <= remainingCells; day++) {
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    let lunarText = ''
    let lunarMonthDay = ''
    try {
      const solar = Solar.fromYmd(nextYear, nextMonth, day)
      const lunar = solar.getLunar()
      lunarText = lunar.getDayInChinese()
      lunarMonthDay = `${lunar.getMonth()}/${lunar.getDay()}`
    } catch {}

    const dayOccurrences = scheduledOccurrences.filter((occ) => {
      if (!occ.startDateStr) return false
      const end = occ.endDateStr || occ.startDateStr
      return occ.startDateStr <= dateStr && dateStr <= end
    })

    cells.push({
      dateStr,
      year: nextYear,
      month: nextMonth,
      day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      lunarText,
      lunarMonthDay,
      occurrences: dayOccurrences,
    })
  }

  return {
    cells,
    monthNameId: MONTH_NAMES[month - 1].id,
    monthNameEn: MONTH_NAMES[month - 1].en,
  }
}
