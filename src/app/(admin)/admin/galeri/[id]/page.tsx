import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect, notFound } from 'next/navigation'
import { AlbumForm } from '@/components/admin/AlbumForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  try {
    const data = await payload.findByID({
      collection: 'albums',
      id,
      locale: 'all',
      depth: 2,
    })

    if (!data) notFound()

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Album Dokumentasi</h1>
            <p className="text-sm text-slate-500">
              Edit informasi album, unggah media secara massal, atau atur urutan tampilan foto dan video.
            </p>
          </div>
          <Link
            href="/admin/galeri"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            ← Kembali ke Daftar Album
          </Link>
        </div>

        <AlbumForm initialData={data} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
