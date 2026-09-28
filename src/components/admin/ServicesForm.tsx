'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveServiceAction, deleteServiceAction } from '@/app/(admin)/admin/layanan/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

export function ServicesForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || null,
    status: initialData?.status || 'draft',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const res = await saveServiceAction(initialData?.id || null, formData)
    
    setIsSaving(false)
    if (res.success) {
      router.push('/admin/layanan')
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus layanan? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(true)
    const res = await deleteServiceAction(initialData.id)
    if (res.success) {
      router.push('/admin/layanan')
    } else {
      alert('Gagal menghapus layanan: ' + res.error)
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Layanan</label>
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
              <input 
                required
                type="text" 
                name="slug"
                value={formData.slug}
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
            <h3 className="font-semibold text-slate-900">Deskripsi Lengkap</h3>
            <LexicalEditor 
              initialData={initialData?.description} 
              onChange={(json) => setFormData(prev => ({ ...prev, description: json as any }))} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Publikasi</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Publikasi</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Dipublikasikan</option>
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
