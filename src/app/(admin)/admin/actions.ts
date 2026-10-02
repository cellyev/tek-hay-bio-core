/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function saveGlobalAction(slug: 'history' | 'site-settings' | 'contact-information' | 'home-page', data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    // Enforce role checks matching Payload config
    if ((slug === 'site-settings' || slug === 'contact-information') && user.role !== 'super_admin') {
      throw new Error('Hanya Super Admin yang dapat mengubah pengaturan ini.')
    }
    
    if (slug === 'home-page' && user.role !== 'admin' && user.role !== 'super_admin') {
      throw new Error('Hanya Admin yang dapat mengubah halaman beranda.')
    }

    await payload.updateGlobal({
      slug,
      data,
      user,
      overrideAccess: false,
    })
    
        revalidatePath(`/admin/${slug}`)
    revalidatePath('/', 'layout') // Global info changes affect the whole layout (navbar/footer/history)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
