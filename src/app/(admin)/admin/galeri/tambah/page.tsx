import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { AlbumForm } from '@/components/admin/AlbumForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AddAlbumPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buat Album Dokumentasi Baru</h1>
          <p className="text-sm text-slate-500">
            Isi informasi dasar album terlebih dahulu, kemudian Anda dapat menambahkan banyak foto dan video.
          </p>
        </div>
        <Link
          href="/admin/galeri"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          ← Kembali ke Daftar Album
        </Link>
      </div>

      <AlbumForm />
    </div>
  )
}
