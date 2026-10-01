/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function saveNewsAction(id: string | null, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    if (id) {
      await payload.update({
        collection: 'posts',
        id,
        data,
        user,
        overrideAccess: false,
      })
    } else {
      await payload.create({
        collection: 'posts',
        data,
        user,
        overrideAccess: false,
      })
    }
    
    revalidatePath('/admin/berita')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteNewsAction(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    await payload.delete({
      collection: 'posts',
      id,
      user,
      overrideAccess: false,
    })
    
    revalidatePath('/admin/berita')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
