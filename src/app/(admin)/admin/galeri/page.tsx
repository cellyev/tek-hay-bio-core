/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { GalleryUploader } from '@/components/admin/GalleryUploader'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const collections = [
  { id: 'gallery-media', label: 'Galeri Utama' },
  { id: 'news-media', label: 'Media Berita' },
  { id: 'activity-media', label: 'Media Kegiatan' },
  { id: 'service-media', label: 'Media Layanan' },
  { id: 'history-media', label: 'Media Sejarah' },
  { id: 'site-media', label: 'Media Website' },
]

export default async function GalleryAdminPage({ searchParams }: { searchParams: Promise<{ collection?: string }> }) {
  const params = await searchParams;
  const activeCollection = params.collection || 'gallery-media';
  
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  const data = await payload.find({
    collection: activeCollection as any,
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Media</h1>
        <p className="text-sm text-slate-500">Kelola gambar dan media secara terpusat berdasarkan kategorinya.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {collections.map(c => (
          <Link 
            key={c.id} 
            href={`/admin/galeri?collection=${c.id}`}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeCollection === c.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <GalleryUploader initialMedia={data.docs} collection={activeCollection} />
    </div>
  )
}
