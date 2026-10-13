/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  saveAlbumAction,
  deleteAlbumAction,
  removeMediaFromAlbumAction,
  deleteMediaAction,
  updateMediaAction,
} from '@/app/(admin)/admin/galeri/actions'
import { LocaleTabs } from '@/components/admin/LocaleTabs'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { BulkMediaUploader } from '@/components/admin/BulkMediaUploader'
import { ALBUM_CATEGORIES, isMediaVideo } from '@/lib/gallery/utils'
import {
  Calendar,
  Image as ImageIcon,
  Video,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  AlertCircle,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react'

export function AlbumForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getLocalized = (field: any, fallback = '') => {
    if (!field) return { id: fallback, en: fallback }
    if (typeof field === 'string') return { id: field, en: field }
    return { id: field.id || fallback, en: field.en || fallback }
  }

  const [localizedData, setLocalizedData] = useState({
    title: getLocalized(initialData?.title),
    slug: getLocalized(initialData?.slug),
    description: getLocalized(initialData?.description),
  })

  const [formData, setFormData] = useState({
    category: initialData?.category || 'cultural-celebration',
    status: initialData?.status || 'draft',
    featured: Boolean(initialData?.featured),
    coverImage: initialData?.coverImage || null,
    eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().slice(0, 10) : '',
    eventEndDate: initialData?.eventEndDate
      ? new Date(initialData.eventEndDate).toISOString().slice(0, 10)
      : '',
  })

  // Media items inside album
  const [mediaItems, setMediaItems] = useState<any[]>(() => {
    if (!Array.isArray(initialData?.mediaItems)) return []
    return initialData.mediaItems.map((item: any, idx: number) => ({
      media: item.media,
      caption: getLocalized(item.caption),
      sortOrder: item.sortOrder ?? idx,
    }))
  })

  // Edit metadata modal state
  const [editingItem, setEditingItem] = useState<{
    index: number
    mediaDoc: any
    caption: { id: string; en: string }
    title: string
    alt: string
  } | null>(null)

  const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLocalizedData((prev) => ({
      ...prev,
      [name]: {
        ...(prev as any)[name],
        [activeTab]: value,
      },
    }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleBulkUploadSuccess = (newDocs: any[]) => {
    setMediaItems((prev) => {
      const existingMediaIds = new Set(
        prev.map((i) => (typeof i.media === 'object' ? i.media?.id : i.media))
      )
      const toAdd = newDocs
        .filter((d) => !existingMediaIds.has(d.id))
        .map((doc, idx) => ({
          media: doc,
          caption: { id: '', en: '' },
          sortOrder: prev.length + idx,
        }))
      return [...prev, ...toAdd]
    })
    setSuccessMessage(`${newDocs.length} media berhasil ditambahkan ke daftar album. Tekan "Simpan Album" untuk memfinalisasi.`)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...mediaItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return

    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    // Update sortOrder
    newItems.forEach((item, idx) => {
      item.sortOrder = idx
    })

    setMediaItems(newItems)
  }

  const handleRemoveFromAlbum = async (index: number) => {
    const item = mediaItems[index]
    const mediaId = typeof item.media === 'object' ? item.media?.id : item.media

    if (initialData?.id && mediaId) {
      if (!confirm('Keluarkan media ini dari album? File fisik di Pusat Media TIDAK akan dihapus.')) return
      const res = await removeMediaFromAlbumAction(initialData.id, mediaId)
      if (!res.success) {
        alert('Gagal mengeluarkan media: ' + res.error)
        return
      }
    }

    setMediaItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDeletePermanently = async (index: number) => {
    const item = mediaItems[index]
    const mediaId = typeof item.media === 'object' ? item.media?.id : item.media

    if (!confirm('Hapus file media ini secara permanen dari server?\n\nTindakan ini tidak dapat dibatalkan.')) return

    const res = await deleteMediaAction(mediaId, 'gallery-media')
    if (res.success) {
      setMediaItems((prev) => prev.filter((_, i) => i !== index))
      alert('File berhasil dihapus permanen.')
    } else {
      alert(res.error)
    }
  }

  const openEditModal = (index: number) => {
    const item = mediaItems[index]
    const mediaDoc = typeof item.media === 'object' ? item.media : {}
    setEditingItem({
      index,
      mediaDoc,
      caption: item.caption || { id: '', en: '' },
      title: mediaDoc.title || '',
      alt: mediaDoc.alt || '',
    })
  }

  const saveMetadataChanges = async () => {
    if (!editingItem) return

    // Update local state
    setMediaItems((prev) => {
      const copy = [...prev]
      copy[editingItem.index] = {
        ...copy[editingItem.index],
        caption: editingItem.caption,
      }
      return copy
    })

    // If media doc has ID, update in gallery-media collection
    if (editingItem.mediaDoc?.id) {
      await updateMediaAction(editingItem.mediaDoc.id, 'gallery-media', {
        title: editingItem.title,
        alt: editingItem.alt,
      })
    }

    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    const submitData: any = {
      ...formData,
      ...localizedData,
      eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
      eventEndDate: formData.eventEndDate ? new Date(formData.eventEndDate).toISOString() : null,
      mediaItems: mediaItems.map((item, idx) => ({
        media: typeof item.media === 'object' ? item.media?.id : item.media,
        caption: item.caption,
        sortOrder: idx,
      })),
    }

    if (submitData.coverImage && submitData.coverImage.id) {
      submitData.coverImage = submitData.coverImage.id
    }

    // Pastikan title memiliki fallback dua arah agar tidak pernah null/kosong
    const titleId = submitData.title?.id?.trim?.() || ''
    const titleEn = submitData.title?.en?.trim?.() || ''
    if (!titleId && !titleEn) {
      setError('Judul album wajib diisi.')
      setIsSaving(false)
      return
    }

    submitData.title = {
      id: titleId || titleEn,
      en: titleEn || titleId,
    }

    // Pembersihan field EN kosong untuk field opsional (JANGAN pernah null-kan title)
    Object.keys(submitData).forEach((key) => {
      if (key === 'title') return
      if (
        submitData[key] &&
        typeof submitData[key] === 'object' &&
        'id' in submitData[key] &&
        'en' in submitData[key]
      ) {
        const enVal = submitData[key].en
        if (!enVal || (typeof enVal === 'string' && enVal.trim() === '')) {
          submitData[key].en = null
        }
      }
    })

    const res = await saveAlbumAction(initialData?.id || null, submitData)

    setIsSaving(false)
    if (res.success) {
      if (!initialData?.id && res.id) {
        router.push(`/admin/galeri/${res.id}`)
      } else {
        setSuccessMessage('Album berhasil disimpan.')
        router.refresh()
      }
    } else {
      setError(res.error || 'Terjadi kesalahan saat menyimpan album.')
    }
  }

  const handleDeleteAlbum = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus album dokumentasi ini?\n\nFile foto dan video di dalamnya TIDAK akan dihapus dari Pusat Media.'))
      return

    setIsDeleting(true)
    const res = await deleteAlbumAction(initialData.id)
    if (res.success) {
      router.push('/admin/galeri')
    } else {
      alert('Gagal menghapus album: ' + res.error)
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-3">
          <Check className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <div className="text-sm font-medium">{successMessage}</div>
        </div>
      )}

      <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Informasi Dasar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-slate-900">
                1. Informasi Album ({activeTab.toUpperCase()})
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Judul Album <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="title"
                value={localizedData.title[activeTab]}
                onChange={handleLocalizedChange}
                placeholder="Contoh: Perayaan Cap Go Meh 2026, Kirab Budaya Tek Hay Cin Jin..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <div className="text-xs text-slate-500 mb-1.5">
                Kosongkan untuk membuat slug otomatis dari judul.
              </div>
              <input
                type="text"
                name="slug"
                value={localizedData.slug[activeTab]}
                onChange={handleLocalizedChange}
                placeholder="otomatis-dari-judul"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Deskripsi / Keterangan Album ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="description"
                value={localizedData.description[activeTab]}
                onChange={handleLocalizedChange}
                rows={4}
                placeholder="Deskripsi kegiatan, konteks dokumentasi, dan suasana perayaan..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Section 2: Bulk Upload & Media Gallery */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                  Media dalam Album ({mediaItems.length} File)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unggah banyak foto dan video sekaligus, lalu atur urutan dan keterangan media.
                </p>
              </div>
            </div>

            {/* Bulk Uploader Component */}
            <BulkMediaUploader
              onUploadSuccess={handleBulkUploadSuccess}
              collection="gallery-media"
              defaultTitle={localizedData.title[activeTab] || localizedData.title.id || localizedData.title.en}
            />

            {/* Media Items Grid */}
            {mediaItems.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-500 text-sm">
                Belum ada foto atau video dalam album ini. Gunakan area unggah di atas untuk menambahkan media.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
                  <span>Daftar Media & Urutan Tampil</span>
                  <span>{mediaItems.length} Media Terpasang</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-1">
                  {mediaItems.map((item, index) => {
                    const mediaDoc = typeof item.media === 'object' ? item.media : {}
                    const isVideo = isMediaVideo(mediaDoc)
                    const thumbUrl =
                      mediaDoc.sizes?.thumbnail?.url || mediaDoc.url || '/placeholder.png'
                    const albumTitleFallback =
                      localizedData.title[activeTab] || localizedData.title.id || localizedData.title.en || 'Judul Album'
                    const displayTitle =
                      (mediaDoc.title?.trim() && mediaDoc.title.trim() !== 'Tanpa Judul')
                        ? mediaDoc.title.trim()
                        : albumTitleFallback

                    return (
                      <div
                        key={mediaDoc.id || index}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs relative group hover:border-slate-300 transition-colors"
                      >
                        {/* Media Preview */}
                        <div className="w-20 h-20 rounded-lg bg-slate-900 overflow-hidden relative shrink-0 border border-slate-200">
                          {isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white">
                              <Video className="w-6 h-6 text-amber-400" />
                              <span className="text-[9px] font-bold uppercase tracking-wider mt-1">
                                Video
                              </span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumbUrl}
                              alt={mediaDoc.alt || displayTitle}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Badge Type */}
                          <span className="absolute bottom-1 right-1 bg-black/75 text-white p-0.5 rounded text-[10px]">
                            {isVideo ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3" />}
                          </span>
                        </div>

                        {/* Info & Caption */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="font-semibold text-slate-900 truncate" title={displayTitle}>
                            {displayTitle}
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Urutan ke-{index + 1} • {isVideo ? 'Video' : 'Foto'}
                          </div>

                          {item.caption?.[activeTab] ? (
                            <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                              "{item.caption[activeTab]}"
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openEditModal(index)}
                              className="text-[11px] text-primary hover:underline"
                            >
                              + Tambah keterangan ({activeTab.toUpperCase()})
                            </button>
                          )}
                        </div>

                        {/* Controls Column */}
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => moveItem(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                              title="Geser ke atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem(index, 'down')}
                              disabled={index === mediaItems.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                              title="Geser ke bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(index)}
                              className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-blue-50"
                              title="Edit Keterangan & Alt Text"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromAlbum(index)}
                              className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-amber-50"
                              title="Keluarkan dari album (file tetap aman di Pusat Media)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Status & Kategori */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 text-sm">
              Status & Klasifikasi
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status Publikasi <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="draft">Draft (Draf Pengurus)</option>
                <option value="published">Published (Tayang Publik)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kategori Album <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {ALBUM_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label[activeTab]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
              />
              <label htmlFor="featured" className="text-xs text-slate-700 font-medium cursor-pointer">
                Tampilkan sebagai Album Sorotan / Utama
              </label>
            </div>
          </div>

          {/* Tanggal Acara */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Waktu Pelaksanaan Acara
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Selesai (Opsional)
              </label>
              <input
                type="date"
                name="eventEndDate"
                value={formData.eventEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Isi jika acara berlangsung lebih dari satu hari.
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 text-sm">
              Sampul Album (Cover)
            </h3>
            <p className="text-xs text-slate-500">
              Pilih foto utama yang akan menjadi kartu sampul album di website publik.
            </p>
            <MediaPicker
              mediaCollection="gallery-media"
              value={formData.coverImage}
              onChange={(val) => setFormData((prev) => ({ ...prev, coverImage: val }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm transition-colors shadow-sm"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Album'}
            </button>

            {initialData?.id && (
              <button
                type="button"
                onClick={handleDeleteAlbum}
                disabled={isDeleting}
                className="w-full px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 text-sm transition-colors"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Album'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Edit Metadata Media
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Media</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Teks Alternatif (Alt Text - Foto)
                </label>
                <input
                  type="text"
                  value={editingItem.alt}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, alt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Keterangan dalam Album (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={editingItem.caption.id}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev && { ...prev, caption: { ...prev.caption, id: e.target.value } }
                    )
                  }
                  placeholder="Keterangan foto atau adegan video..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Keterangan dalam Album (English)
                </label>
                <input
                  type="text"
                  value={editingItem.caption.en}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev && { ...prev, caption: { ...prev.caption, en: e.target.value } }
                    )
                  }
                  placeholder="Photo description or video scene..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveMetadataChanges}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
