/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LocaleTabs } from '@/components/admin/LocaleTabs'

export function CategoryForm({ initialData }: { initialData?: any }) {
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

  const [localizedData, setLocalizedData] = useState({
    title: getLocalized(initialData?.title),
    description: getLocalized(initialData?.description),
  })

  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    try {
      const submitData = {
        ...formData,
        title: localizedData.title,
        description: localizedData.description,
      }
      
      const url = initialData?.id ? `/api/categories/${initialData.id}` : '/api/categories'
      const method = initialData?.id ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      
      if (!res.ok) throw new Error('Failed to save category')
      router.push('/admin/kategori-berita')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus kategori ini? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/categories/${initialData.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      router.push('/admin/kategori-berita')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori ({activeTab.toUpperCase()})</label>
          <input 
            required={activeTab === 'id'}
            type="text" 
            name="title"
            value={localizedData.title[activeTab]}
            onChange={handleLocalizedChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL (Otomatis jika kosong)</label>
          <input 
            type="text" 
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi ({activeTab.toUpperCase()})</label>
          <textarea 
            name="description"
            value={localizedData.description[activeTab]}
            onChange={handleLocalizedChange}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </button>
        
        {initialData?.id && (
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50"
          >
            {isDeleting ? 'Hapus...' : 'Hapus'}
          </button>
        )}
      </div>
    </form>
  )
}
