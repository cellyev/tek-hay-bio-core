import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { GalleryUploader } from '@/components/admin/GalleryUploader'

export const dynamic = 'force-dynamic'

export default async function GalleryAdminPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  const data = await payload.find({
    collection: 'media',
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Galeri Media</h1>
        <p className="text-sm text-slate-500">Kelola gambar dan media yang digunakan di website.</p>
      </div>

      <GalleryUploader initialMedia={data.docs} />
    </div>
  )
}
