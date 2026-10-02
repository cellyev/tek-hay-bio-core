/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { WebsiteInfoForm } from '@/components/admin/WebsiteInfoForm'

export const dynamic = 'force-dynamic'

export default async function WebsiteInfoAdminPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')
  
  // Enforce super_admin in UI as well for accessing this page
  if (user.role !== 'super_admin') {
    return (
      <div className="p-8 text-center text-red-600">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </div>
    )
  }

  const contactData = await payload.findGlobal({ slug: 'contact-information', locale: 'all' })
  const siteData = await payload.findGlobal({ slug: 'site-settings', locale: 'all' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Informasi Website</h1>
        <p className="text-sm text-slate-500">Kelola identitas dan kontak Klenteng.</p>
      </div>

      <WebsiteInfoForm contactData={contactData} siteData={siteData} />
    </div>
  )
}
