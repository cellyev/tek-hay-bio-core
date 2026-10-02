/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'








const extractLocaleData = (data: any, locale: 'id' | 'en'): any => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => extractLocaleData(item, locale));
  
  if (data.hasOwnProperty('id') && data.hasOwnProperty('en') && Object.keys(data).length === 2) {
    return data[locale];
  }
  
  const result: any = {};
  for (const key in data) {
    result[key] = extractLocaleData(data[key], locale);
  }
  return result;
}

export async function saveActivityAction(id: string | null, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    if (id) {
      await payload.update({
        collection: 'activities',
        id,
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      await payload.update({
        collection: 'activities',
        id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    } else {
      const created = await payload.create({
        collection: 'activities',
        data: extractLocaleData(data, 'id'),
        user,
        locale: 'id',
        overrideAccess: false,
      })
      await payload.update({
        collection: 'activities',
        id: created.id,
        data: extractLocaleData(data, 'en'),
        user,
        locale: 'en',
        overrideAccess: false,
      })
    }
    
        revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteActivityAction(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    await payload.delete({
      collection: 'activities',
      id,
      user,
      overrideAccess: false,
    })
    
        revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
export async function deleteManyActivityAction(ids: string[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    for (const id of ids) {
      await payload.delete({
        collection: 'activities',
        id,
        user,
        overrideAccess: false,
      })
    }
    
    revalidatePath('/admin/kegiatan')
    revalidatePath('/id')
    revalidatePath('/en')
    revalidatePath('/id/kegiatan', 'page')
    revalidatePath('/en/activities', 'page')
    revalidatePath('/[locale]/kegiatan/[slug]', 'page')
    revalidatePath('/[locale]/activities/[slug]', 'page')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
