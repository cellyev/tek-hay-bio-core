/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function saveGlobalAction(slug: 'history' | 'site-settings' | 'contact-information', data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    // Only super_admin can edit site-settings or contact-information
    if (slug !== 'history' && user.role !== 'super_admin') {
      throw new Error('Hanya Super Admin yang dapat mengubah pengaturan ini.')
    }

    await payload.updateGlobal({
      slug,
      data,
      user,
      overrideAccess: false,
    })
    
    revalidatePath(`/admin/${slug}`)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
