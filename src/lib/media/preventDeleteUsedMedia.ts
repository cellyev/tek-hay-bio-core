import { CollectionBeforeDeleteHook } from 'payload'
import { getMediaUsage } from './getMediaUsage'
import { APIError } from 'payload'

export const preventDeleteUsedMedia = (collectionSlug: string): CollectionBeforeDeleteHook => {
  return async ({ req, id }) => {
    const usage = await getMediaUsage(req.payload, collectionSlug, id)
    
    if (usage.used) {
      const referenceStrings = usage.references.map(r => `- ${r.type}: ${r.title}`).join('\n')
      throw new APIError(
        `Gambar tidak dapat dihapus.\n\nGambar ini masih digunakan oleh:\n${referenceStrings}\n\nHapus atau ganti gambar pada konten tersebut terlebih dahulu.`,
        400,
        null,
        true // isPublic
      )
    }
  }
}
