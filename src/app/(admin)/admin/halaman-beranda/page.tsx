import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { HomePageForm } from '@/components/admin/HomePageForm'

export const dynamic = 'force-dynamic'

export default async function HalamanBerandaAdminPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')
  
  if (user.role !== 'super_admin' && user.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-600">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </div>
    )
  }

  const homePageData = await payload.findGlobal({ slug: 'home-page' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Halaman Beranda</h1>
        <p className="text-sm text-slate-500">Kelola konten dan tampilan halaman utama website.</p>
      </div>

      <HomePageForm initialData={homePageData} />
    </div>
  )
}
