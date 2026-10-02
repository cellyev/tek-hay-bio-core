/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveGlobalAction } from '@/app/(admin)/admin/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { LocaleTabs } from '@/components/admin/LocaleTabs'

export function HistoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id')
  const [isSaving, setIsSaving] = useState(false)
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
    timelineTitle: getLocalized(initialData?.timelineTitle),
    shortDescription: getLocalized(initialData?.shortDescription),
    content: getLocalizedRichText(initialData?.content),
  })
  
  const [timeline, setTimeline] = useState<any[]>(() => {
    const arr = Array.isArray(initialData?.timeline) ? initialData.timeline : [];
    return arr.map((item: any) => ({
      ...item,
      year: getLocalized(item.year),
      title: getLocalized(item.title),
      description: getLocalized(item.description)
    }))
  })

  const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLocalizedData(prev => ({
      ...prev,
      [name]: { ...prev[name as keyof typeof prev], [activeTab]: value }
    }))
  }
  
  const handleTimelineChange = (index: number, field: string, value: any) => {
    setTimeline(prev => {
      const arr = [...prev]
      arr[index] = { ...arr[index], [field]: value }
      return arr
    })
  }

  const handleTimelineLocalizedChange = (index: number, field: string, value: any) => {
    setTimeline(prev => {
      const arr = [...prev]
      arr[index] = { ...arr[index], [field]: { ...arr[index][field], [activeTab]: value } }
      return arr
    })
  }

  const addTimelineItem = () => {
    setTimeline(prev => {
      const arr = [...prev]
      arr.push({ year: {id: '', en: ''}, title: {id: '', en: ''}, description: {id: '', en: ''}, verificationStatus: 'verified', id: Math.random().toString(36).substr(2, 9) })
      return arr
    })
  }

  const removeTimelineItem = (index: number) => {
    setTimeline(prev => {
      const arr = [...prev]
      arr.splice(index, 1)
      return arr
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const submitData = {
      title: localizedData.title,
      timelineTitle: localizedData.timelineTitle,
      shortDescription: localizedData.shortDescription,
      content: localizedData.content,
      timeline: timeline.map(t => ({ ...t, image: t.image?.id || t.image }))
    }
    
    const res = await saveGlobalAction('history', submitData)
    
    setIsSaving(false)
    if (res.success) {
      alert('Sejarah berhasil disimpan.')
      router.refresh()
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Judul Halaman Sejarah ({activeTab.toUpperCase()})</label>
          <input 
            type="text" 
            name="title"
            value={localizedData.title[activeTab]}
            onChange={handleLocalizedChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sejarah Singkat (Tampil di Beranda) ({activeTab.toUpperCase()})</label>
          <textarea 
            name="shortDescription"
            value={localizedData.shortDescription[activeTab]}
            onChange={handleLocalizedChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900">Sejarah Lengkap ({activeTab.toUpperCase()})</h3>
        <div key={`editor-history-${activeTab}`}>
          <LexicalEditor 
            mediaCollection="history-media"
            initialData={localizedData.content[activeTab]} 
            onChange={(json) => setLocalizedData(prev => ({ 
              ...prev, 
              content: { ...prev.content, [activeTab]: json } 
            }))} 
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
           <h3 className="font-semibold text-lg text-slate-900">Linimasa (Timeline) ({activeTab.toUpperCase()})</h3>
           <button type="button" onClick={addTimelineItem} className="text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-700 hover:bg-slate-200">
             + Tambah Momen
           </button>
        </div>
        
        {timeline.length === 0 ? (
          <p className="text-slate-500 text-sm">Belum ada linimasa.</p>
        ) : (
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={item.id || i} className="p-4 border border-slate-200 rounded-md space-y-4 bg-slate-50 relative">
                <button type="button" onClick={() => removeTimelineItem(i)} className="absolute top-4 right-4 text-red-500 text-sm hover:underline">Hapus</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-12">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Tahun ({activeTab.toUpperCase()})</label>
                     <input type="text" value={item.year[activeTab] || ''} onChange={e => handleTimelineLocalizedChange(i, 'year', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Status Verifikasi</label>
                     <select value={item.verificationStatus} onChange={e => handleTimelineChange(i, 'verificationStatus', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900">
                       <option value="verified">Verified</option>
                       <option value="under_research">Under Research</option>
                     </select>
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Momen</label>
                     <MediaPicker 
                       mediaCollection="history-media"
                       value={item.image} 
                       onChange={(val) => handleTimelineChange(i, 'image', val)} 
                     />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Judul Peristiwa ({activeTab.toUpperCase()})</label>
                     <input type="text" value={item.title[activeTab] || ''} onChange={e => handleTimelineLocalizedChange(i, 'title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi ({activeTab.toUpperCase()})</label>
                     <textarea value={item.description[activeTab] || ''} onChange={e => handleTimelineLocalizedChange(i, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 font-medium"
      >
        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}
