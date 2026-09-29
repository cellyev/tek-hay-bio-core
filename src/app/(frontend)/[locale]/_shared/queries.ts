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

export async function getCollection(collection: 'posts' | 'activities' | 'services' | 'media' | 'gallery-media', locale: 'id' | 'en', query = {}): Promise<CMSRecord[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.find({
      collection: collection as 'posts' | 'activities' | 'services' | 'media' | 'gallery-media',
      locale,
      ...query
    })
    return data.docs as CMSRecord[]
  } catch (error) {
    console.error(`Error fetching collection ${collection}:`, error)
    return []
  }
}

export async function getBySlug(collection: 'posts' | 'activities' | 'services', slug: string, locale: 'id' | 'en'): Promise<CMSRecord | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.find({
      collection: collection as 'posts' | 'activities' | 'services',
      where: {
        slug: {
          equals: slug,
        },
      },
      locale,
      limit: 1,
    })
    return data.docs[0] as CMSRecord || null
  } catch (error) {
    console.error(`Error fetching ${collection} by slug ${slug}:`, error)
    return null
  }
}
