/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveGlobalAction } from '@/app/(admin)/admin/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'

export function HistoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    content: initialData?.content || null,
  })
  
  const [timeline, setTimeline] = useState<any[]>(initialData?.timeline || [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleTimelineChange = (index: number, field: string, value: any) => {
    const newTimeline = [...timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    setTimeline(newTimeline)
  }

  const addTimelineItem = () => {
    setTimeline([...timeline, { year: '', title: '', description: '', verificationStatus: 'verified', id: Math.random().toString(36).substr(2, 9) }])
  }

  const removeTimelineItem = (index: number) => {
    const newTimeline = [...timeline]
    newTimeline.splice(index, 1)
    setTimeline(newTimeline)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const submitData = {
      ...formData,
      timeline: timeline.map(t => ({
        year: t.year,
        title: t.title,
        description: t.description,
        verificationStatus: t.verificationStatus,
        // Optional image relation not implemented in simple custom admin yet
      }))
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
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Judul Halaman Sejarah</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sejarah Singkat (Tampil di Beranda)</label>
          <textarea 
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900">Sejarah Lengkap</h3>
        <LexicalEditor 
          mediaCollection="history-media"
          initialData={formData.content} 
          onChange={(json) => setFormData(prev => ({ ...prev, content: json }))} 
        />
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
           <h3 className="font-semibold text-lg text-slate-900">Linimasa (Timeline)</h3>
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
                     <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
                     <input type="text" value={item.year} onChange={e => handleTimelineChange(i, 'year', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
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
                     <label className="block text-sm font-medium text-slate-700 mb-1">Judul Peristiwa</label>
                     <input type="text" value={item.title} onChange={e => handleTimelineChange(i, 'title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                     <textarea value={item.description} onChange={e => handleTimelineChange(i, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
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
