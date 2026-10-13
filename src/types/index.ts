/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type CMSRecord = Record<string, unknown> & {
  id?: string | number
  title?: string | null
  [key: string]: unknown
}

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

export interface ActivityItem extends CMSRecord {
  id: string
  title: string
  slug: string
  category?: ActivityCategory
  recurrenceType?: ActivityRecurrenceType
  scheduleStatus?: ActivityScheduleStatus
  status?: 'draft' | 'published'
  shortDescription?: string
  description?: any
  featuredImage?: any
  // Gregorian dates
  date?: string | null
  endDate?: string | null
  year?: number | null
  scheduleNote?: string | null
  rescheduledNote?: string | null
  // Lunar dates
  lunarDay?: number | null
  lunarMonth?: number | null
  isLeapMonth?: boolean
  lunarRuleType?: ActivityLunarRuleType
  lunarPeriodDescription?: string | null
  // Deity
  relatedDeity?: string | null
  deityRole?: string | null
  // Meaning & Sequence
  ritualMeaning?: string | null
  traditionExplanation?: string | null
  eventSequence?: string | null
  managementNotes?: string | null
  // Location
  locationType?: ActivityLocationType
  location?: string | null
  locationAddress?: string | null
  locationRelationship?: string | null
  // Participation
  participationDescription?: string | null
  candleDonationInfo?: string | null
  lanternDonationInfo?: string | null
  requiredEquipment?: string | null
  participationInstructions?: string | null
  contactInfo?: string | null
  // Timestamps
  createdAt?: string
  updatedAt?: string
}

export type AlbumCategory =
  | 'ritual'
  | 'ancestral-worship'
  | 'deity-festival'
  | 'cultural-celebration'
  | 'social-activity'
  | 'other'

export interface AlbumMediaItem {
  id?: string
  media: any // GalleryMedia doc or ID
  caption?: string | null
  sortOrder?: number | null
}

export interface AlbumItem extends CMSRecord {
  id: string
  title: string
  slug: string
  category?: AlbumCategory
  description?: string | null
  eventDate?: string | null
  eventEndDate?: string | null
  coverImage?: any
  status?: 'draft' | 'published'
  featured?: boolean
  mediaItems?: AlbumMediaItem[]
  createdAt?: string
  updatedAt?: string
}
