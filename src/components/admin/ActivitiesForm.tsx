/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveActivityAction, deleteActivityAction } from '@/app/(admin)/admin/kegiatan/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'

export function ActivitiesForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    location: initialData?.location || '',
    status: initialData?.status || 'draft',
    featuredImage: initialData?.featuredImage || null,
    })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const submitData = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : null,
    };
    if (submitData.featuredImage && submitData.featuredImage.id) submitData.featuredImage = submitData.featuredImage.id;
    const res = await saveActivityAction(initialData?.id || null, submitData)
    
    setIsSaving(false)
    if (res.success) {
      router.push('/admin/kegiatan')
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus kegiatan? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(true)
    const res = await deleteActivityAction(initialData.id)
    if (res.success) {
      router.push('/admin/kegiatan')
    } else {
      alert('Gagal menghapus kegiatan: ' + res.error)
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <div className="text-xs text-slate-500 mb-2">Kosongkan untuk membuat slug otomatis dari judul. Anda dapat mengubahnya jika diperlukan.</div>
              <input 
                
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
              <textarea 
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Konten Kegiatan</h3>
            <LexicalEditor 
              mediaCollection="activity-media"
              initialData={initialData?.description} 
              onChange={(json) => setFormData(prev => ({ ...prev, description: json as any }))} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Featured Image</h3>
            <MediaPicker 
              mediaCollection="activity-media"
              value={formData.featuredImage} 
              onChange={(val) => setFormData(prev => ({ ...prev, featuredImage: val }))} 
            />
          </div>
          

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Publikasi & Waktu</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Kegiatan</label>
              <input 
                type="datetime-local" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Publik</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
            
            {initialData?.id && (
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50"
              >
                {isDeleting ? 'Hapus...' : 'Hapus'}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
