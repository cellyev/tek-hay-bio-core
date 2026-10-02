/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveNewsAction, deleteNewsAction } from '@/app/(admin)/admin/berita/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { LocaleTabs } from '@/components/admin/LocaleTabs'

export function NewsForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  // Check if initialData.title is an object (locale: 'all') or string
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
    excerpt: getLocalized(initialData?.excerpt),
    content: getLocalizedRichText(initialData?.content),
  })

  const [formData, setFormData] = useState({
    category: initialData?.category?.id || (typeof initialData?.category === 'string' ? initialData.category : ''),
    featuredImage: initialData?.featuredImage || null,
    status: initialData?.status || 'draft',
    author: initialData?.author?.id || (typeof initialData?.author === 'string' ? initialData.author : ''),
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
  })

  const [users, setUsers] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  React.useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(data => {
      if (data && data.docs) setUsers(data.docs)
    }).catch(err => console.error(err))
    
    fetch('/api/categories?limit=100').then(res => res.json()).then(data => {
      if (data && data.docs) setCategories(data.docs)
    }).catch(err => console.error(err))
  }, [])

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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const submitData: any = { 
      ...formData,
      title: localizedData.title,
      slug: localizedData.slug,
      excerpt: localizedData.excerpt,
      content: localizedData.content
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
if (submitData.featuredImage && submitData.featuredImage.id) submitData.featuredImage = submitData.featuredImage.id;
    if (!submitData.author) submitData.author = null;
    if (!submitData.category) submitData.category = null;
    if (!submitData.publishedAt) submitData.publishedAt = null;
    else submitData.publishedAt = new Date(submitData.publishedAt).toISOString();
    
    const res = await saveNewsAction(initialData?.id || null, submitData)
    
    setIsSaving(false)
    if (res.success) {
      router.push('/admin/berita')
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus berita? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(true)
    const res = await deleteNewsAction(initialData.id)
    if (res.success) {
      router.push('/admin/berita')
    } else {
      alert('Gagal menghapus berita: ' + res.error)
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama ({activeTab.toUpperCase()})</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Ringkasan (Excerpt) ({activeTab.toUpperCase()})</label>
              <textarea 
                name="excerpt"
                value={localizedData.excerpt[activeTab]}
                onChange={handleLocalizedChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Konten Berita ({activeTab.toUpperCase()})</h3>
            <div key={`editor-content-${activeTab}`}>
              <LexicalEditor 
                initialData={localizedData.content[activeTab]} 
                onChange={(json) => setLocalizedData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, [activeTab]: json } 
                }))} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Featured Image</h3>
            <MediaPicker 
              mediaCollection="news-media"
              value={formData.featuredImage} 
              onChange={(val) => setFormData(prev => ({ ...prev, featuredImage: val }))} 
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900">Publikasi</h3>
            
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Publikasi</label>
              <input 
                type="datetime-local" 
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Penulis (Author)</label>
              <select 
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">-- Pilih Penulis --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.email || u.id}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">-- Tidak ada kategori --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {typeof c.title === 'string' ? c.title : (c.title?.id || c.title?.en || c.id)}
                  </option>
                ))}
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
