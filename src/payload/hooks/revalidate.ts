import { GlobalAfterChangeHook, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateGlobal = (): GlobalAfterChangeHook => {
  return ({ doc, req }) => {
    // Revalidate the frontend home page layouts
    revalidatePath('/', 'layout')
    
    // Also revalidate specific language paths just in case
    revalidatePath('/id')
    revalidatePath('/en')
    
    return doc
  }
}

export const revalidateCollection = (collectionName: string): CollectionAfterChangeHook & CollectionAfterDeleteHook => {
  return ({ doc, req }) => {
    revalidatePath('/', 'layout')
    revalidatePath('/id')
    revalidatePath('/en')
    
    // Revalidate specific collection paths if needed
    if (collectionName === 'posts') {
      revalidatePath('/id/berita', 'page')
      revalidatePath('/en/news', 'page')
      if (doc.slug) {
        revalidatePath(`/id/berita/${doc.slug}`, 'page')
        revalidatePath(`/en/news/${doc.slug}`, 'page')
      }
    }
    
    if (collectionName === 'services') {
      revalidatePath('/id/layanan', 'page')
      revalidatePath('/en/services', 'page')
      if (doc.slug) {
        revalidatePath(`/id/layanan/${doc.slug}`, 'page')
        revalidatePath(`/en/services/${doc.slug}`, 'page')
      }
    }
    
    if (collectionName === 'activities') {
      revalidatePath('/id/kegiatan', 'page')
      revalidatePath('/en/activities', 'page')
      if (doc.slug) {
        revalidatePath(`/id/kegiatan/${doc.slug}`, 'page')
        revalidatePath(`/en/activities/${doc.slug}`, 'page')
      }
    }
    
    if (collectionName === 'gallery') {
      revalidatePath('/id/galeri', 'page')
      revalidatePath('/en/gallery', 'page')
    }
    
    return doc
  }
}
