/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getMediaUsage } from '@/lib/media/getMediaUsage'

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

export async function saveAlbumAction(id: string | null, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    // Validasi dan normalisasi Judul dwibahasa (bidirectional fallback)
    const rawTitleId = typeof data.title === 'string' ? data.title.trim() : (data.title?.id?.trim?.() ?? '')
    const rawTitleEn = typeof data.title === 'string' ? data.title.trim() : (data.title?.en?.trim?.() ?? '')

    if (!rawTitleId && !rawTitleEn) {
      return { success: false, error: 'Judul album wajib diisi.' }
    }

    // Pastikan kedua locale memiliki nilai string valid agar Payload tidak menolak required: true
    data.title = {
      id: rawTitleId || rawTitleEn,
      en: rawTitleEn || rawTitleId,
    }

    // Normalisasi slug
    const rawSlugId = typeof data.slug === 'string' ? data.slug.trim() : (data.slug?.id?.trim?.() ?? '')
    const rawSlugEn = typeof data.slug === 'string' ? data.slug.trim() : (data.slug?.en?.trim?.() ?? '')
    if (rawSlugId || rawSlugEn) {
      data.slug = {
        id: rawSlugId || rawSlugEn,
        en: rawSlugEn || rawSlugId,
      }
    }

    // Validasi Tanggal
    if (data.eventDate && data.eventEndDate) {
      const start = new Date(data.eventDate)
      const end = new Date(data.eventEndDate)
      if (end < start) {
        return { success: false, error: 'Tanggal selesai acara tidak boleh lebih awal daripada tanggal mulai.' }
      }
    }

    // Format mediaItems IDs dan saring item yang tidak memiliki media
    if (Array.isArray(data.mediaItems)) {
      data.mediaItems = data.mediaItems
        .map((item: any, index: number) => ({
          media: typeof item.media === 'object' && item.media?.id ? item.media.id : item.media,
          caption: item.caption,
          sortOrder: item.sortOrder ?? index,
        }))
        .filter((item: any) => Boolean(item.media))

      // Jika judul media belum diisi atau default, perbarui dengan Judul Album
      const albumTitleToUse = rawTitleId || rawTitleEn
      if (albumTitleToUse) {
        for (const item of data.mediaItems) {
          if (item.media && typeof item.media === 'string') {
            try {
              const mediaDoc = await payload.findByID({
                collection: 'gallery-media',
                id: item.media,
              })
              if (
                mediaDoc &&
                (!mediaDoc.title ||
                  mediaDoc.title === 'Tanpa Judul' ||
                  mediaDoc.title === mediaDoc.filename)
              ) {
                await payload.update({
                  collection: 'gallery-media',
                  id: item.media,
                  data: {
                    title: albumTitleToUse,
                    alt: mediaDoc.alt || albumTitleToUse,
                  },
                })
              }
            } catch {
              // Abaikan error pada sinkronisasi judul per berkas
            }
          }
        }
      }
    }

    // Format coverImage ID
    if (data.coverImage && typeof data.coverImage === 'object' && data.coverImage.id) {
      data.coverImage = data.coverImage.id
    } else if (!data.coverImage) {
      data.coverImage = null
    }

    let albumId = id

    if (id) {
      await payload.update({
        collection: 'albums',
        id,
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      await payload.update({
        collection: 'albums',
        id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    } else {
      const created = await payload.create({
        collection: 'albums',
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      albumId = created.id as string
      await payload.update({
        collection: 'albums',
        id: created.id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    }

    revalidatePath('/admin/galeri')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    revalidatePath('/[locale]/galeri/[slug]', 'page')
    revalidatePath('/[locale]/gallery/[slug]', 'page')

    return { success: true, id: albumId }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan album.' }
  }
}

export async function deleteAlbumAction(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    // Penghapusan album HANYA menghapus dokumen album itu sendiri, TIDAK menghapus file media fisik!
    await payload.delete({
      collection: 'albums',
      id,
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/galeri')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteManyAlbumAction(ids: string[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    for (const id of ids) {
      await payload.delete({
        collection: 'albums',
        id,
        user,
        overrideAccess: false,
      })
    }

    revalidatePath('/admin/galeri')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addMediaToAlbumAction(albumId: string, mediaIds: string[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    const album = await payload.findByID({
      collection: 'albums',
      id: albumId,
      locale: 'all',
    })

    if (!album) throw new Error('Album tidak ditemukan.')

    const existingItems = Array.isArray(album.mediaItems) ? [...album.mediaItems] : []
    const existingMediaIds = new Set(
      existingItems.map((item: any) => (typeof item.media === 'object' ? item.media?.id : item.media))
    )

    const newItems = mediaIds
      .filter((mId) => !existingMediaIds.has(mId))
      .map((mId, idx) => ({
        media: mId,
        sortOrder: existingItems.length + idx,
      }))

    const updatedMediaItems = [...existingItems, ...newItems]

    await payload.update({
      collection: 'albums',
      id: albumId,
      data: {
        mediaItems: updatedMediaItems,
      },
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/galeri')
    revalidatePath(`/admin/galeri/${albumId}`)
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function removeMediaFromAlbumAction(albumId: string, mediaId: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak: Anda harus masuk sebagai pengurus.')

    const album = await payload.findByID({
      collection: 'albums',
      id: albumId,
      locale: 'all',
    })

    if (!album) throw new Error('Album tidak ditemukan.')

    // Mengeluarkan media dari daftar mediaItems tanpa menghapus file fisik di gallery-media
    const updatedMediaItems = (album.mediaItems || []).filter((item: any) => {
      const itemMediaId = typeof item.media === 'object' ? item.media?.id : item.media
      return itemMediaId !== mediaId
    })

    await payload.update({
      collection: 'albums',
      id: albumId,
      data: {
        mediaItems: updatedMediaItems,
      },
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/galeri')
    revalidatePath(`/admin/galeri/${albumId}`)
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateMediaAction(id: string, collection: string, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak.')

    await payload.update({
      collection: collection as any,
      id,
      data,
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/galeri')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMediaAction(id: string, collection: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Akses ditolak.')

    // Periksa apakah media sedang digunakan oleh album atau fitur lain
    const usage = await getMediaUsage(payload, collection, id)
    if (usage.used) {
      const refs = usage.references.map((r) => `- ${r.type}: ${r.title}`).join('\n')
      return {
        success: false,
        error: `File tidak dapat dihapus permanen karena masih digunakan oleh:\n${refs}\n\nKeluarkan file dari album atau konten tersebut terlebih dahulu.`,
      }
    }

    await payload.delete({
      collection: collection as any,
      id,
      user,
      overrideAccess: false,
    })

    revalidatePath('/admin/galeri')
    revalidatePath('/id/galeri', 'page')
    revalidatePath('/en/gallery', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
