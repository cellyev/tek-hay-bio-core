/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getHomepageData(locale: 'id' | 'en') {
  const payload = await getPayload({ config: configPromise })
  
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', locale })
  const contactInfo = await payload.findGlobal({ slug: 'contact-information', locale })
  const history = await payload.findGlobal({ slug: 'history', locale })
  
  const servicesRes = await payload.find({
    collection: 'services',
    where: { status: { equals: 'published' } },
    sort: 'sortOrder',
    limit: 3,
    locale,
  })

  const activitiesRes = await payload.find({
    collection: 'activities',
    where: { status: { equals: 'published' } },
    sort: '-date',
    limit: 3,
    locale,
  })

  const postsRes = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 3,
    locale,
  })

  const mediaRes = await payload.find({
    collection: 'media',
    limit: 6,
    // Try to fetch images that might be good for a gallery preview
    where: { 
      or: [
        { category: { equals: 'building' } },
        { category: { equals: 'interior' } },
        { category: { equals: 'traditions' } }
      ]
    },
  })

  return {
    siteSettings,
    contactInfo,
    history,
    services: servicesRes.docs,
    activities: activitiesRes.docs,
    posts: postsRes.docs,
    media: mediaRes.docs,
  }
}
