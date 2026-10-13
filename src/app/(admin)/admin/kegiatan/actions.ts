/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

const VALID_CATEGORIES = [
  'ritual',
  'ancestral-worship',
  'deity-festival',
  'cultural-celebration',
  'social-activity',
]

const VALID_RECURRENCE_TYPES = [
  'annual-lunar',
  'annual-gregorian',
  'periodic',
  'one-time',
  'incidental',
]

const VALID_SCHEDULE_STATUSES = [
  'scheduled',
  'tentative',
  'rescheduled',
  'unscheduled',
]

const extractLocaleData = (data: any, locale: 'id' | 'en'): any => {
  if (!data || typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map((item) => extractLocaleData(item, locale))

  if (data.hasOwnProperty('id') && data.hasOwnProperty('en') && Object.keys(data).length === 2) {
    return data[locale]
  }

  const result: any = {}
  for (const key in data) {
    result[key] = extractLocaleData(data[key], locale)
  }
  return result
}

export async function saveActivityAction(id: string | null, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    // Validasi dan normalisasi Judul dwibahasa (bidirectional fallback)
    const rawTitleId = typeof data.title === 'string' ? data.title.trim() : (data.title?.id?.trim?.() ?? '')
    const rawTitleEn = typeof data.title === 'string' ? data.title.trim() : (data.title?.en?.trim?.() ?? '')

    if (!rawTitleId && !rawTitleEn) {
      return { success: false, error: 'Judul kegiatan wajib diisi.' }
    }

    data.title = {
      id: rawTitleId || rawTitleEn,
      en: rawTitleEn || rawTitleId,
    }

    // Validasi Kategori
    if (data.category && !VALID_CATEGORIES.includes(data.category)) {
      return { success: false, error: 'Kategori kegiatan tidak valid.' }
    }

    // Validasi Pola Pengulangan
    if (data.recurrenceType && !VALID_RECURRENCE_TYPES.includes(data.recurrenceType)) {
      return { success: false, error: 'Pola pengulangan tidak valid.' }
    }

    // Validasi Status Jadwal
    if (data.scheduleStatus && !VALID_SCHEDULE_STATUSES.includes(data.scheduleStatus)) {
      return { success: false, error: 'Status jadwal tidak valid.' }
    }

    // Validasi Tanggal Masehi
    if (data.date && data.endDate) {
      const start = new Date(data.date)
      const end = new Date(data.endDate)
      if (isNaN(start.getTime())) {
        return { success: false, error: 'Format tanggal mulai tidak valid.' }
      }
      if (isNaN(end.getTime())) {
        return { success: false, error: 'Format tanggal selesai tidak valid.' }
      }
      if (end < start) {
        return { success: false, error: 'Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.' }
      }
    }

    // Validasi Kalender Imlek
    if (data.lunarMonth !== undefined && data.lunarMonth !== null && data.lunarMonth !== '') {
      const m = Number(data.lunarMonth)
      if (isNaN(m) || m < 1 || m > 12) {
        return { success: false, error: 'Bulan Imlek harus berupa angka antara 1 dan 12.' }
      }
      data.lunarMonth = m
    } else {
      data.lunarMonth = null
    }

    if (data.lunarDay !== undefined && data.lunarDay !== null && data.lunarDay !== '') {
      const d = Number(data.lunarDay)
      if (isNaN(d) || d < 1 || d > 30) {
        return { success: false, error: 'Tanggal Imlek harus berupa angka antara 1 dan 30.' }
      }
      data.lunarDay = d
    } else {
      data.lunarDay = null
    }

    if (data.year !== undefined && data.year !== null && data.year !== '') {
      const y = Number(data.year)
      data.year = isNaN(y) ? null : y
    } else {
      data.year = null
    }

    if (id) {
      await payload.update({
        collection: 'activities',
        id,
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      await payload.update({
        collection: 'activities',
        id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    } else {
      const created = await payload.create({
        collection: 'activities',
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      await payload.update({
        collection: 'activities',
        id: created.id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    }

    revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Terjadi kesalahan sistem saat menyimpan kegiatan.' }
  }
}

export async function deleteActivityAction(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    await payload.delete({
      collection: 'activities',
      id,
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteManyActivityAction(ids: string[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    for (const id of ids) {
      await payload.delete({
        collection: 'activities',
        id,
        user,
        overrideAccess: false,
      })
    }

    revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
