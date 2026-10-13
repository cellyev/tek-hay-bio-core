/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, ExternalLink, Image as ImageIcon, Video, Calendar, Layers } from 'lucide-react'
import { DeleteActionClient } from '@/components/admin/DeleteActionClient'
import { BulkDeleteProvider, BulkDeleteCheckbox, BulkDeleteSelectAll, BulkDeleteButton } from '@/components/admin/BulkDelete'
import { deleteAlbumAction, deleteManyAlbumAction } from './actions'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { GalleryUploader } from '@/components/admin/GalleryUploader'
import { getAlbumCategoryLabel, formatEventDateRange, countAlbumMedia } from '@/lib/gallery/utils'

export const dynamic = 'force-dynamic'

const mediaCollections = [
  { id: 'gallery-media', label: 'Galeri Utama' },
  { id: 'news-media', label: 'Media Berita' },
  { id: 'activity-media', label: 'Media Kegiatan' },
  { id: 'service-media', label: 'Media Layanan' },
  { id: 'history-media', label: 'Media Sejarah' },
  { id: 'site-media', label: 'Media Website' },
]

export default async function GalleryAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; collection?: string; page?: string; limit?: string }>
}) {
  const params = await searchParams
  const activeTab = params.tab || 'albums'
  const activeCollection = params.collection || 'gallery-media'
  const page = parseInt(params.page || '1', 10)
  const limit = parseInt(params.limit || '10', 10)

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  if (activeTab === 'media') {
    const mediaLimit = parseInt(params.limit || '100', 10)
    const mediaData = await payload.find({
      collection: activeCollection as any,
      sort: '-createdAt',
      limit: mediaLimit,
      page: page,
    })

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pusat Media Terpusat</h1>
            <p className="text-sm text-slate-500">
              Kelola seluruh file media fisik dari berbagai kategori konten.
            </p>
          </div>
          <Link
            href="/admin/galeri"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium shrink-0"
          >
            ← Kembali ke Daftar Album
          </Link>
        </div>

        {/* Tab Sub-collections */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {mediaCollections.map((c) => (
            <Link
              key={c.id}
              href={`/admin/galeri?tab=media&collection=${c.id}`}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeCollection === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <GalleryUploader initialMedia={mediaData.docs} collection={activeCollection} />

        <AdminPagination
          page={mediaData.page as number}
          totalPages={mediaData.totalPages}
          hasPrevPage={mediaData.hasPrevPage}
          hasNextPage={mediaData.hasNextPage}
          prevPage={mediaData.prevPage}
          nextPage={mediaData.nextPage}
          baseUrl={`/admin/galeri?tab=media&collection=${activeCollection}`}
          limit={mediaLimit}
        />
      </div>
    )
  }

  // Active Tab: ALBUMS
  const albumData = await payload.find({
    collection: 'albums',
    sort: '-createdAt',
    limit: limit,
    page: page,
    depth: 1,
    locale: 'id',
  })

  return (
    <BulkDeleteProvider>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Galeri & Dokumentasi Album</h1>
            <p className="text-sm text-slate-500">
              Kelola album dokumentasi acara, upacara ritual, foto, dan video Klenteng Tek Hay Bio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <BulkDeleteButton action={deleteManyAlbumAction} />
            <Link
              href="/admin/galeri/tambah"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium shrink-0"
            >
              <Plus className="w-4 h-4" /> Buat Album Baru
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <Link
            href="/admin/galeri"
            className="px-4 py-2 text-sm font-medium rounded-t-lg bg-slate-900 text-white flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" /> Album Dokumentasi
          </Link>
          <Link
            href="/admin/galeri?tab=media"
            className="px-4 py-2 text-sm font-medium rounded-t-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4" /> Pusat File Media
          </Link>
        </div>

        {/* Albums Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium w-12">
                    <BulkDeleteSelectAll allIds={albumData.docs.map((d: any) => d.id)} />
                  </th>
                  <th className="px-6 py-4 font-medium w-20">Sampul</th>
                  <th className="px-6 py-4 font-medium">Judul Album</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Waktu Acara</th>
                  <th className="px-6 py-4 font-medium">Isi Media</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {albumData.docs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      Belum ada album dokumentasi yang dibuat. Klik tombol{' '}
                      <strong>"Buat Album Baru"</strong> untuk memulai.
                    </td>
                  </tr>
                ) : (
                  albumData.docs.map((album: any) => {
                    const categoryLabel = getAlbumCategoryLabel(album.category, 'id')
                    const dateFormatted = formatEventDateRange(album.eventDate, album.eventEndDate, 'id')
                    const { photosCount, videosCount, total } = countAlbumMedia(album.mediaItems)
                    const coverUrl =
                      album.coverImage?.sizes?.thumbnail?.url ||
                      album.coverImage?.url ||
                      '/placeholder.png'

                    return (
                      <tr key={album.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <BulkDeleteCheckbox id={album.id} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={coverUrl}
                              alt={album.title || 'Sampul Album'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{album.title || 'Tanpa Judul'}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">/{album.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                            {categoryLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {dateFormatted ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{dateFormatted}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Belum ditentukan</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5 text-xs text-slate-600">
                            <span className="font-medium">{total} Media</span>
                            <span className="text-[11px] text-slate-400">
                              {photosCount} Foto • {videosCount} Video
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              album.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {album.status === 'published' ? 'Publik' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                          {album.status === 'published' && album.slug && (
                            <Link
                              href={`/id/galeri/${album.slug}`}
                              target="_blank"
                              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Lihat di Website Publik"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/galeri/${album.id}`}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Album & Kelola Media"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteActionClient id={album.id} action={deleteAlbumAction} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <AdminPagination
            page={albumData.page as number}
            totalPages={albumData.totalPages}
            hasPrevPage={albumData.hasPrevPage}
            hasNextPage={albumData.hasNextPage}
            prevPage={albumData.prevPage}
            nextPage={albumData.nextPage}
            baseUrl="/admin/galeri"
            limit={limit}
          />
        </div>
      </div>
    </BulkDeleteProvider>
  )
}
