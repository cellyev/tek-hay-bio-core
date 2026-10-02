import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const payload = await getPayload({ config: configPromise })
  const data = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    sort: '-createdAt'
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kategori Berita</h1>
          <p className="text-slate-500 mt-1">Kelola kategori untuk berita dan artikel</p>
        </div>
        <Link 
          href="/admin/kategori-berita/tambah" 
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Kategori</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Dibuat Pada</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.docs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                data.docs.map((cat: any) => {
                  const title = typeof cat.title === 'string' ? cat.title : (cat.title?.id || cat.title?.en || '-')
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{title}</td>
                      <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(cat.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/kategori-berita/${cat.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
