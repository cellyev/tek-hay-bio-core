'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function updateMediaAction(id: string, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    await payload.update({
      collection: 'media',
      id,
      data,
      user,
      overrideAccess: false,
    })
    
    revalidatePath('/admin/galeri')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
