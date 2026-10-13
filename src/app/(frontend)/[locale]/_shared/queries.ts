import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { CMSRecord } from '@/types'

export async function getGlobal(slug: 'history' | 'site-settings' | 'contact-information', locale: 'id' | 'en'): Promise<CMSRecord | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.findGlobal({
      slug: slug as 'history' | 'site-settings' | 'contact-information',
      locale,
    })
    return data as CMSRecord
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return null
  }
}

export async function getCollection(collection: 'posts' | 'activities' | 'services' | 'media' | 'gallery-media' | 'albums', locale: 'id' | 'en', query = {}): Promise<{ docs: CMSRecord[], totalDocs: number, totalPages: number, page: number }> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.find({
      collection: collection as any,
      locale,
      depth: (query as any)?.depth ?? (collection === 'albums' ? 2 : 1),
      ...query
    })
    return {
      docs: data.docs as CMSRecord[],
      totalDocs: data.totalDocs || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error(`Error fetching collection ${collection}:`, error)
    return { docs: [], totalDocs: 0, totalPages: 1, page: 1 }
  }
}

export async function getBySlug(collection: 'posts' | 'activities' | 'services' | 'albums', slug: string, locale: 'id' | 'en'): Promise<CMSRecord | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.find({
      collection: collection as any,
      where: {
        slug: {
          equals: slug,
        },
      },
      locale,
      depth: collection === 'albums' ? 2 : 1,
      limit: 1,
    })
    return data.docs[0] as CMSRecord || null
  } catch (error) {
    console.error(`Error fetching ${collection} by slug ${slug}:`, error)
    return null
  }
}

export function getDetailRoutePrefix(
  collection: 'posts' | 'activities' | 'services' | 'albums',
  locale: 'id' | 'en'
): string {
  switch (collection) {
    case 'posts':
      return locale === 'id' ? '/id/berita' : '/en/news'
    case 'activities':
      return locale === 'id' ? '/id/kegiatan' : '/en/activities'
    case 'albums':
      return locale === 'id' ? '/id/galeri' : '/en/gallery'
    case 'services':
      return locale === 'id' ? '/id/layanan' : '/en/services'
    default:
      return `/${locale}`
  }
}

export interface SlugResolutionResult {
  doc: CMSRecord | null
  currentSlug: string | null
  alternateSlug: string | null
  needsRedirect: boolean
  redirectUrl: string | null
}

export async function getBySlugWithAlternates(
  collection: 'posts' | 'activities' | 'services' | 'albums',
  slug: string,
  locale: 'id' | 'en'
): Promise<SlugResolutionResult> {
  const otherLocale: 'id' | 'en' = locale === 'id' ? 'en' : 'id'

  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Search for document with requested slug in the requested locale
    const primary = await payload.find({
      collection: collection as any,
      where: {
        slug: { equals: slug },
      },
      locale,
      depth: collection === 'albums' ? 2 : 1,
      limit: 1,
    })

    if (primary.docs.length > 0) {
      const doc = primary.docs[0] as CMSRecord
      let alternateSlug: string | null = null

      try {
        const otherData = await payload.find({
          collection: collection as any,
          where: {
            id: { equals: doc.id },
          },
          locale: otherLocale,
          depth: 0,
          limit: 1,
        })
        if (otherData.docs[0]?.slug) {
          alternateSlug = String(otherData.docs[0].slug)
        }
      } catch {}

      if (!alternateSlug) {
        alternateSlug = String(doc.slug || slug)
      }

      return {
        doc,
        currentSlug: String(doc.slug || slug),
        alternateSlug,
        needsRedirect: false,
        redirectUrl: null,
      }
    }

    // 2. If not found in current locale, check if the slug provided belongs to the other locale!
    const fallback = await payload.find({
      collection: collection as any,
      where: {
        slug: { equals: slug },
      },
      locale: otherLocale,
      depth: 0,
      limit: 1,
    })

    if (fallback.docs.length > 0) {
      // Document exists! Find it in the requested locale
      const targetDocData = await payload.find({
        collection: collection as any,
        where: {
          id: { equals: fallback.docs[0].id },
        },
        locale,
        depth: collection === 'albums' ? 2 : 1,
        limit: 1,
      })

      if (targetDocData.docs.length > 0) {
        const doc = targetDocData.docs[0] as CMSRecord
        const canonicalSlug = String(doc.slug || fallback.docs[0].slug)
        const currentPrefix = getDetailRoutePrefix(collection, locale)
        const redirectUrl = `${currentPrefix}/${canonicalSlug}`

        return {
          doc,
          currentSlug: canonicalSlug,
          alternateSlug: String(fallback.docs[0].slug),
          needsRedirect: canonicalSlug !== slug,
          redirectUrl: canonicalSlug !== slug ? redirectUrl : null,
        }
      }
    }

    return {
      doc: null,
      currentSlug: null,
      alternateSlug: null,
      needsRedirect: false,
      redirectUrl: null,
    }
  } catch (error) {
    console.error(`Error in getBySlugWithAlternates for ${collection} slug ${slug}:`, error)
    return {
      doc: null,
      currentSlug: null,
      alternateSlug: null,
      needsRedirect: false,
      redirectUrl: null,
    }
  }
}

