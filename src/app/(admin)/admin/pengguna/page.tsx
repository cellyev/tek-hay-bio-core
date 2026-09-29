/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PenggunaPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  if (user.role !== 'super_admin') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengelola pengguna.</p>
        <Link href="/admin" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Dashboard</Link>
      </div>
    )
  }

  const users = await payload.find({
    collection: 'users',
    limit: 50,
  })

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Kelola Pengguna</h1>
        <p className="text-sm text-slate-500">Daftar akun administrator dan editor sistem.</p>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Peran</th>
              <th className="px-6 py-4 font-medium">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.docs.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{u.email}</td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role === 'super_admin' ? 'Super Admin' : 'Editor'}
                   </span>
                </td>
                <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-600">Pembuatan pengguna baru dapat dilakukan melalui Payload Admin.</p>
          <Link href="/admin-payload/collections/users/create" className="text-sm font-medium text-blue-600 hover:underline">
            Tambah Pengguna &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
