/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { NewsForm } from '@/components/admin/NewsForm'

export const dynamic = 'force-dynamic'

export default async function AddNewsPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tambah Berita</h1>
        <p className="text-sm text-slate-500">Buat artikel berita baru.</p>
      </div>
      
      <NewsForm />
    </div>
  )
}
