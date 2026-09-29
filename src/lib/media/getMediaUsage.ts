import { BasePayload } from 'payload'

export interface MediaUsage {
  used: boolean
  references: {
    type: string
    id: string
    title: string
  }[]
}

export async function getMediaUsage(
  payload: BasePayload,
  mediaCollection: string,
  mediaId: string | number
): Promise<MediaUsage> {
  const references: MediaUsage['references'] = []

  if (mediaCollection === 'news-media') {
    const posts = await payload.find({
      collection: 'posts',
      where: {
        or: [
          { featuredImage: { equals: mediaId } },
          // For rich text, we have to check the JSON string.
          // Wait! Lexical rich text stores JSON in the DB. We might need a regex or contains query on 'content' field?
          // Since Payload stores Lexical data as a JSON object, we can query it using like or contains.
          // Or we can just query ALL posts and check them, but for performance, we should do:
          // { 'content': { contains: `\"id\":\"${mediaId}\"` } } ?
          // In Payload, querying inside JSON might be tricky if it's stored as JSON block. 
          // Let's use `contains: mediaId` as a broad stroke on 'content', or we can query all posts and parse.
          // Wait, 'content' is localized! We should query across locales? `locale: 'all'`
        ],
      },
      locale: 'all',
      limit: 100,
    })

    // To be safe and precise with Rich Text:
    const allPosts = await payload.find({
      collection: 'posts',
      limit: 1000,
      locale: 'all',
    })

    for (const post of allPosts.docs) {
      let isUsed = false
      if (post.featuredImage === mediaId || (post.featuredImage as any)?.id === mediaId) {
        isUsed = true
      }
      
      
      
      // Check Rich Text for all locales
      if (!isUsed && post.content) {
        // If content is an object (lexical state), stringify it
        const contentStr = JSON.stringify(post.content)
        if (contentStr.includes(`"relationTo":"news-media","value":"${mediaId}"`) || 
            contentStr.includes(`"relationTo":"media","value":"${mediaId}"`)) {
          isUsed = true
        }
      }

      if (isUsed) {
        references.push({
          type: 'Berita',
          id: post.id as string,
          title: (typeof post.title === 'string' ? post.title : (post.title as any)?.id || (post.title as any)?.en || 'Tanpa Judul'),
        })
      }
    }
  }

  if (mediaCollection === 'service-media') {
    const services = await payload.find({
      collection: 'services',
      limit: 1000,
      locale: 'all',
    })
    for (const s of services.docs) {
      let isUsed = false
      if (s.image === mediaId || (s.image as any)?.id === mediaId) isUsed = true
      
      

      if (isUsed) {
        references.push({
          type: 'Layanan',
          id: s.id as string,
          title: (typeof s.title === 'string' ? s.title : (s.title as any)?.id || (s.title as any)?.en || 'Tanpa Judul'),
        })
      }
    }
  }

  if (mediaCollection === 'activity-media') {
    const activities = await payload.find({
      collection: 'activities',
      limit: 1000,
      locale: 'all',
    })
    for (const a of activities.docs) {
      let isUsed = false
      if (a.featuredImage === mediaId || (a.featuredImage as any)?.id === mediaId) isUsed = true
      
      

      if (isUsed) {
        references.push({
          type: 'Kegiatan',
          id: a.id as string,
          title: (typeof a.title === 'string' ? a.title : (a.title as any)?.id || (a.title as any)?.en || 'Tanpa Judul'),
        })
      }
    }
  }

  if (mediaCollection === 'history-media') {
    const history = await payload.findGlobal({ slug: 'history', locale: 'all' })
    if (history?.timeline && Array.isArray(history.timeline)) {
      let isUsed = false
      for (const item of history.timeline) {
        if (item.image === mediaId || (item.image as any)?.id === mediaId) {
          isUsed = true
          break
        }
      }
      if (isUsed) {
        references.push({
          type: 'Sejarah',
          id: 'history-global',
          title: 'Linimasa Sejarah',
        })
      }
    }
  }

  if (mediaCollection === 'site-media') {
    const siteSettings = await payload.findGlobal({ slug: 'site-settings', locale: 'all' })
    let isUsed = false
    if (siteSettings?.logo === mediaId || (siteSettings?.logo as any)?.id === mediaId) isUsed = true
    if (siteSettings?.favicon === mediaId || (siteSettings?.favicon as any)?.id === mediaId) isUsed = true
    if (siteSettings?.defaultSocialImage === mediaId || (siteSettings?.defaultSocialImage as any)?.id === mediaId) isUsed = true
    
    if (isUsed) {
      references.push({
        type: 'Site Settings',
        id: 'site-settings-global',
        title: 'Pengaturan Situs',
      })
    }
  }

  // Deduplicate references just in case (e.g. found in both locales for same post)
  const uniqueRefs = references.filter((ref, index, self) =>
    index === self.findIndex((t) => (
      t.id === ref.id && t.type === ref.type
    ))
  )

  return {
    used: uniqueRefs.length > 0,
    references: uniqueRefs,
  }
}
