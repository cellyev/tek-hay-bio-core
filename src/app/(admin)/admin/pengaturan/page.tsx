/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PengaturanPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  if (user.role !== 'super_admin') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Link href="/admin" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Pengaturan Lanjutan</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="mb-4 text-slate-600">Fitur pengaturan lanjutan (seperti sinkronisasi bahasa dan backup konfigurasi) saat ini dinonaktifkan dalam mode Custom Admin.</p>
        <Link href="/admin-payload" className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition">
          Buka Payload Admin Asli
        </Link>
      </div>
    </div>
  )
}
