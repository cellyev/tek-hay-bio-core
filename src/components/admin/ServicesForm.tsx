/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveServiceAction, deleteServiceAction } from '@/app/(admin)/admin/layanan/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { LocaleTabs } from '@/components/admin/LocaleTabs'

export function ServicesForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const getLocalized = (field: any, fallback = '') => {
    if (!field) return { id: fallback, en: fallback }
    if (typeof field === 'string') return { id: field, en: field }
    return { id: field.id || fallback, en: field.en || fallback }
  }
  const getLocalizedRichText = (field: any) => {
    if (!field) return { id: null, en: null }
    if (field.root) return { id: field, en: field }
    return { id: field.id || null, en: field.en || null }
  }

  const [localizedData, setLocalizedData] = useState({
    title: getLocalized(initialData?.title),
    slug: getLocalized(initialData?.slug),
    shortDescription: getLocalized(initialData?.shortDescription),
    description: getLocalizedRichText(initialData?.description),
  })

  const [formData, setFormData] = useState({
    image: initialData?.image || null,
    status: initialData?.status || 'draft',
    sortOrder: initialData?.sortOrder ?? 0,
  })

  const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLocalizedData(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        [activeTab]: value
      }
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const submitData: any = {
      ...formData,
      title: localizedData.title,
      slug: localizedData.slug,
      shortDescription: localizedData.shortDescription,
      description: localizedData.description,
    };

        // Option 2 (ID wajib, EN Opsional): Bersihkan field EN yang kosong agar trigger fallback Payload
    Object.keys(submitData).forEach(key => {
      if (submitData[key] && typeof submitData[key] === 'object' && 'id' in submitData[key] && 'en' in submitData[key]) {
        const enVal = submitData[key].en;
        if (!enVal) {
          submitData[key].en = null;
        } else if (typeof enVal === 'string' && (enVal.trim() === '' || enVal === '<p><br></p>')) {
          submitData[key].en = null;
        } else if (typeof enVal === 'object') {
          if (Object.keys(enVal).length === 0) submitData[key].en = null;
          else if (enVal.root && enVal.root.children && enVal.root.children.length === 1 && enVal.root.children[0].children && enVal.root.children[0].children.length === 0) {
             submitData[key].en = null;
          }
        }
      }
    });
if (submitData.image && submitData.image.id) submitData.image = submitData.image.id;
    const res = await saveServiceAction(initialData?.id || null, submitData)
    
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
      
      <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Layanan ({activeTab.toUpperCase()})</label>
              <input 
                required
                type="text" 
                name="title"
                value={localizedData.title[activeTab]}
                onChange={handleLocalizedChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL ({activeTab.toUpperCase()})</label>
              <div className="text-xs text-slate-500 mb-2">Kosongkan untuk membuat slug otomatis dari judul. Anda dapat mengubahnya jika diperlukan.</div>
              <input
                type="text" 
                name="slug"
                value={localizedData.slug[activeTab]}
                onChange={handleLocalizedChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat ({activeTab.toUpperCase()})</label>
              <textarea 
                name="shortDescription"
                value={localizedData.shortDescription[activeTab]}
                onChange={handleLocalizedChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Deskripsi Lengkap ({activeTab.toUpperCase()})</h3>
            <div key={`editor-service-${activeTab}`}>
              <LexicalEditor 
                mediaCollection="service-media"
                initialData={localizedData.description[activeTab]} 
                onChange={(json) => setLocalizedData(prev => ({ 
                  ...prev, 
                  description: { ...prev.description, [activeTab]: json as any } 
                }))} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Featured Image</h3>
            <MediaPicker 
              mediaCollection="service-media"
              value={formData.image} 
              onChange={(val) => setFormData(prev => ({ ...prev, image: val }))} 
            />
          </div>

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil (Sort Order)</label>
              <input 
                type="number" 
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
              <p className="text-xs text-slate-500 mt-1">Semakin kecil angkanya, semakin awal ditampilkan.</p>
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
