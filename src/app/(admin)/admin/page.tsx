/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { FileText, CalendarDays, Box, ImageIcon, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch counts
  const [news, activities, services, media, drafts] = await Promise.all([
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'activities' }),
    payload.count({ collection: 'services' }),
    payload.count({ collection: 'gallery-media' }),
    payload.count({ collection: 'posts', where: { status: { equals: 'draft' } } }),
  ])

  // Fetch latest content
  const latestNews = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    limit: 5,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Selamat datang kembali, {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/berita/tambah" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium">
            <Plus className="w-4 h-4" />
            Berita Baru
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Berita', count: news.totalDocs, icon: FileText, href: '/admin/berita', color: 'text-blue-600' },
          { label: 'Kegiatan', count: activities.totalDocs, icon: CalendarDays, href: '/admin/kegiatan', color: 'text-green-600' },
          { label: 'Layanan', count: services.totalDocs, icon: Box, href: '/admin/layanan', color: 'text-purple-600' },
          { label: 'Media', count: media.totalDocs, icon: ImageIcon, href: '/admin/galeri', color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-slate-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Berita Terbaru</h2>
            <Link href="/admin/berita" className="text-sm text-primary hover:underline">Lihat Semua</Link>
          </div>
          {latestNews.docs.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {latestNews.docs.map((post) => (
                <li key={post.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">{post.title as string || 'Tanpa Judul'}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt as string || '-'}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {post.status === 'published' ? 'Publik' : 'Draft'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Belum ada berita.
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Status Konten</h2>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm text-slate-600">Draft Berita</span>
               <span className="text-sm font-bold text-slate-900">{drafts.totalDocs}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
