/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveGlobalAction } from '@/app/(admin)/admin/actions'
import { MediaPicker } from '@/components/admin/MediaPicker'

const routeOptions = [
  { label: 'Beranda (Home)', value: 'home' },
  { label: 'Sejarah', value: 'sejarah' },
  { label: 'Tentang Kami', value: 'tentang-kami' },
  { label: 'Layanan', value: 'layanan' },
  { label: 'Kegiatan', value: 'kegiatan' },
  { label: 'Berita', value: 'berita' },
  { label: 'Galeri', value: 'galeri' },
  { label: 'Kontak', value: 'kontak' },
]

export function HomePageForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('hero')

  const [formData, setFormData] = useState({
    hero: initialData?.hero || {},
    introduction: initialData?.introduction || {},
    historySection: initialData?.historySection || {},
    uniquenessSection: initialData?.uniquenessSection || {},
    servicesSection: initialData?.servicesSection || {},
    activitiesSection: initialData?.activitiesSection || {},
    newsSection: initialData?.newsSection || {},
    gallerySection: initialData?.gallerySection || {},
    ctaSection: initialData?.ctaSection || {},
  })

  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }))
  }

  const handleFeatureChange = (index: number, field: string, value: any) => {
    const features = [...(formData.uniquenessSection.features || [])]
    if (!features[index]) features[index] = {}
    features[index][field] = value
    handleChange('uniquenessSection', 'features', features)
  }

  const addFeature = () => {
    const features = [...(formData.uniquenessSection.features || [])]
    features.push({ title: '', image: null, id: Math.random().toString(36).substr(2, 9) })
    handleChange('uniquenessSection', 'features', features)
  }

  const removeFeature = (index: number) => {
    const features = [...(formData.uniquenessSection.features || [])]
    features.splice(index, 1)
    handleChange('uniquenessSection', 'features', features)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    const res = await saveGlobalAction('home-page', formData)
    
    setIsSaving(false)
    if (res.success) {
      alert('Halaman Beranda berhasil disimpan.')
      router.refresh()
    } else {
      setError(res.error || 'Terjadi kesalahan.')
    }
  }

  const renderInput = (section: string, field: string, label: string, type = 'text') => {
    const value = (formData as any)[section][field] || ''
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {type === 'textarea' ? (
          <textarea 
            value={value}
            onChange={e => handleChange(section, field, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        ) : type === 'select-route' ? (
          <select 
            value={value}
            onChange={e => handleChange(section, field, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          >
            <option value="">-- Pilih Rute --</option>
            {routeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : type === 'image' ? (
          <MediaPicker 
            mediaCollection={field === 'image' && section === 'historySection' ? 'history-media' : 'site-media'}
            value={value} 
            onChange={(val) => handleChange(section, field, val)} 
          />
        ) : (
          <input 
            type={type} 
            value={value}
            onChange={e => handleChange(section, field, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" 
          />
        )}
      </div>
    )
  }

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'introduction', label: 'Pengantar' },
    { id: 'history', label: 'Sejarah & Keunikan' },
    { id: 'lists', label: 'Layanan, Kegiatan, Berita' },
    { id: 'cta', label: 'Galeri & CTA' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Bagian Hero Utama</h3>
            {renderInput('hero', 'title', 'Judul Utama (Title)')}
            {renderInput('hero', 'tagline', 'Slogan (Tagline)', 'textarea')}
            {renderInput('hero', 'backgroundImage', 'Gambar Latar (Background)', 'image')}
            
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput('hero', 'primaryButtonText', 'Teks Tombol Utama')}
              {renderInput('hero', 'primaryButtonLink', 'Tautan Tombol Utama', 'select-route')}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput('hero', 'secondaryButtonText', 'Teks Tombol Sekunder')}
              {renderInput('hero', 'secondaryButtonLink', 'Tautan Tombol Sekunder', 'select-route')}
            </div>
          </div>
        )}

        {activeTab === 'introduction' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Bagian Pengantar Singkat</h3>
            {renderInput('introduction', 'title', 'Judul Pengantar')}
            {renderInput('introduction', 'description', 'Deskripsi Pengantar', 'textarea')}
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput('introduction', 'linkText', 'Teks Tautan')}
              {renderInput('introduction', 'linkUrl', 'URL Tautan', 'select-route')}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Sejarah</h3>
              {renderInput('historySection', 'heading', 'Sub-judul (Kecil)')}
              {renderInput('historySection', 'title', 'Judul Utama')}
              {renderInput('historySection', 'description', 'Deskripsi', 'textarea')}
              {renderInput('historySection', 'image', 'Gambar Pendukung', 'image')}
              <div className="grid md:grid-cols-2 gap-4">
                {renderInput('historySection', 'buttonText', 'Teks Tombol')}
                {renderInput('historySection', 'buttonLink', 'Tautan Tombol', 'select-route')}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Keunikan</h3>
              {renderInput('uniquenessSection', 'title', 'Judul Keunikan')}
              {renderInput('uniquenessSection', 'description', 'Deskripsi Keunikan', 'textarea')}
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-slate-700">Daftar Fitur/Keunikan</label>
                  <button type="button" onClick={addFeature} className="text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-700 hover:bg-slate-200">+ Tambah Fitur</button>
                </div>
                
                <div className="space-y-4">
                  {(formData.uniquenessSection.features || []).map((feature: any, i: number) => (
                    <div key={feature.id || i} className="p-4 border border-slate-200 rounded-md bg-slate-50 relative">
                      <button type="button" onClick={() => removeFeature(i)} className="absolute top-4 right-4 text-red-500 text-sm hover:underline">Hapus</button>
                      <div className="grid md:grid-cols-2 gap-4 mr-12">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Judul Fitur</label>
                          <input type="text" value={feature.title || ''} onChange={e => handleFeatureChange(i, 'title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Ikon/Gambar</label>
                          <MediaPicker mediaCollection="site-media" value={feature.image} onChange={(val) => handleFeatureChange(i, 'image', val)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!formData.uniquenessSection.features || formData.uniquenessSection.features.length === 0) && (
                    <p className="text-sm text-slate-500 italic">Belum ada fitur keunikan.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Layanan</h3>
              {renderInput('servicesSection', 'title', 'Judul Layanan')}
              {renderInput('servicesSection', 'description', 'Deskripsi Layanan', 'textarea')}
              {renderInput('servicesSection', 'linkUrl', 'Tautan (Lihat Semua)', 'select-route')}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Kegiatan</h3>
              {renderInput('activitiesSection', 'title', 'Judul Kegiatan')}
              {renderInput('activitiesSection', 'description', 'Deskripsi Kegiatan', 'textarea')}
              {renderInput('activitiesSection', 'linkUrl', 'Tautan (Lihat Semua)', 'select-route')}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Berita</h3>
              {renderInput('newsSection', 'title', 'Judul Berita')}
              {renderInput('newsSection', 'description', 'Deskripsi Berita', 'textarea')}
              {renderInput('newsSection', 'linkUrl', 'Tautan (Lihat Semua)', 'select-route')}
            </div>
          </div>
        )}

        {activeTab === 'cta' && (
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian Pratinjau Galeri</h3>
              {renderInput('gallerySection', 'title', 'Judul Galeri')}
              {renderInput('gallerySection', 'description', 'Deskripsi', 'textarea')}
              <div className="grid md:grid-cols-2 gap-4">
                {renderInput('gallerySection', 'buttonText', 'Teks Tombol')}
                {renderInput('gallerySection', 'buttonLink', 'Tautan Tombol', 'select-route')}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Bagian CTA Lokasi / Kontak</h3>
              {renderInput('ctaSection', 'title', 'Judul Ajakan (CTA)')}
              {renderInput('ctaSection', 'description', 'Deskripsi Ajakan', 'textarea')}
              <div className="grid md:grid-cols-2 gap-4">
                {renderInput('ctaSection', 'buttonText', 'Teks Tombol Kontak')}
                {renderInput('ctaSection', 'buttonLink', 'Tautan Tombol', 'select-route')}
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="bg-slate-900 text-white px-6 py-3 rounded-md hover:bg-slate-800 disabled:opacity-50 font-medium w-full md:w-auto min-w-[200px]"
      >
        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Beranda'}
      </button>
    </form>
  )
}
