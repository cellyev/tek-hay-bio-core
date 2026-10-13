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
