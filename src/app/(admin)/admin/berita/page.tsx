/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import { DeleteActionClient } from '@/components/admin/DeleteActionClient'
import { BulkDeleteProvider, BulkDeleteCheckbox, BulkDeleteSelectAll, BulkDeleteButton } from '@/components/admin/BulkDelete'
import { deleteNewsAction, deleteManyNewsAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function NewsAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) redirect('/admin/login')

  const currentPage = parseInt(page || '1', 10)
  
  const news = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    limit: 10,
    page: currentPage,
  })

  return (
    <BulkDeleteProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Berita</h1>
            <p className="text-sm text-slate-500">Kelola artikel dan berita terbaru.</p>
          </div>
          <div className="flex items-center gap-2">
            <BulkDeleteButton action={deleteManyNewsAction} />
            <Link href="/admin/berita/tambah" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium shrink-0">
              <Plus className="w-4 h-4" />
              Tambah Berita
            </Link>
          </div>
        </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium w-12"><BulkDeleteSelectAll allIds={news.docs.map((d: any) => d.id)} /></th>
                <th className="px-6 py-4 font-medium">Judul</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada berita yang ditulis.
                  </td>
                </tr>
              ) : (
                news.docs.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><BulkDeleteCheckbox id={post.id} /></td>
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">
                      {post.title as string || 'Tanpa Judul'}
                    </td>
                    <td className="px-6 py-4">
                      {typeof post.category === 'string' ? post.category : ((post.category as any)?.title?.id || (post.category as any)?.title?.en || (post.category as any)?.title || '')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {post.status === 'published' ? 'Publik' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/berita/${post.id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteActionClient id={post.id} action={deleteNewsAction} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {news.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Halaman {news.page} dari {news.totalPages}
            </span>
            <div className="flex gap-2">
              {news.hasPrevPage && (
                <Link href={`/admin/berita?page=${news.prevPage}`} className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50">
                  Sebelumnya
                </Link>
              )}
              {news.hasNextPage && (
                <Link href={`/admin/berita?page=${news.nextPage}`} className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50">
                  Selanjutnya
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </BulkDeleteProvider>
  )
}

