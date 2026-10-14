/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveActivityAction, deleteActivityAction } from '@/app/(admin)/admin/kegiatan/actions'
import { LexicalEditor } from '@/components/admin/LexicalEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { LocaleTabs } from '@/components/admin/LocaleTabs'
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_RECURRENCE_TYPES,
  ACTIVITY_SCHEDULE_STATUSES,
  ACTIVITY_LUNAR_RULES,
  ACTIVITY_LOCATION_TYPES,
} from '@/lib/activities/utils'
import {
  Calendar,
  Moon,
  MapPin,
  Flame,
  Info,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react'

export function ActivitiesForm({ initialData }: { initialData?: any }) {
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
    scheduleNote: getLocalized(initialData?.scheduleNote),
    rescheduledNote: getLocalized(initialData?.rescheduledNote),
    lunarPeriodDescription: getLocalized(initialData?.lunarPeriodDescription),
    relatedDeity: getLocalized(initialData?.relatedDeity),
    deityRole: getLocalized(initialData?.deityRole),
    ritualMeaning: getLocalized(initialData?.ritualMeaning),
    traditionExplanation: getLocalized(initialData?.traditionExplanation),
    eventSequence: getLocalized(initialData?.eventSequence),
    managementNotes: getLocalized(initialData?.managementNotes),
    location: getLocalized(initialData?.location, 'Klenteng Tek Hay Bio, Semarang'),
    locationAddress: getLocalized(initialData?.locationAddress),
    locationRelationship: getLocalized(initialData?.locationRelationship),
    participationDescription: getLocalized(initialData?.participationDescription),
    candleDonationInfo: getLocalized(initialData?.candleDonationInfo),
    lanternDonationInfo: getLocalized(initialData?.lanternDonationInfo),
    requiredEquipment: getLocalized(initialData?.requiredEquipment),
    participationInstructions: getLocalized(initialData?.participationInstructions),
    contactInfo: getLocalized(initialData?.contactInfo),
  })

  const [formData, setFormData] = useState({
    category: initialData?.category || 'ritual',
    recurrenceType: initialData?.recurrenceType || 'annual-lunar',
    scheduleStatus: initialData?.scheduleStatus || 'scheduled',
    status: initialData?.status || 'draft',
    featuredImage: initialData?.featuredImage || null,
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
    year: initialData?.year ?? '',
    lunarRuleType: initialData?.lunarRuleType || 'exact_date',
    lunarDay: initialData?.lunarDay ?? '',
    lunarMonth: initialData?.lunarMonth ?? '',
    isLeapMonth: Boolean(initialData?.isLeapMonth),
    locationType: initialData?.locationType || 'internal',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    const submitData: any = {
      ...formData,
      ...localizedData,
      date: formData.date ? new Date(formData.date).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      year: formData.year ? parseInt(String(formData.year), 10) : null,
      lunarDay: formData.lunarDay ? parseInt(String(formData.lunarDay), 10) : null,
      lunarMonth: formData.lunarMonth ? parseInt(String(formData.lunarMonth), 10) : null,
      isLeapMonth: Boolean(formData.isLeapMonth),
    }

    // Pastikan title memiliki fallback dua arah agar tidak pernah null/kosong
    const titleId = submitData.title?.id?.trim?.() || ''
    const titleEn = submitData.title?.en?.trim?.() || ''
    if (!titleId && !titleEn) {
      setError('Judul kegiatan wajib diisi.')
      setIsSaving(false)
      return
    }

    submitData.title = {
      id: titleId || titleEn,
      en: titleEn || titleId,
    }

    // Pembersihan field EN yang kosong agar fallback ke ID (JANGAN pernah null-kan title)
    Object.keys(submitData).forEach((key) => {
      if (key === 'title') return
      if (
        submitData[key] &&
        typeof submitData[key] === 'object' &&
        'id' in submitData[key] &&
        'en' in submitData[key]
      ) {
        const enVal = submitData[key].en
        if (!enVal) {
          submitData[key].en = null
        } else if (typeof enVal === 'string' && (enVal.trim() === '' || enVal === '<p><br></p>')) {
          submitData[key].en = null
        } else if (typeof enVal === 'object') {
          if (Object.keys(enVal).length === 0) submitData[key].en = null
          else if (
            enVal.root &&
            enVal.root.children &&
            enVal.root.children.length === 1 &&
            enVal.root.children[0].children &&
            enVal.root.children[0].children.length === 0
          ) {
            submitData[key].en = null
          }
        }
      }
    })

    if (submitData.featuredImage && submitData.featuredImage.id) {
      submitData.featuredImage = submitData.featuredImage.id
    }

    const res = await saveActivityAction(initialData?.id || null, submitData)

    setIsSaving(false)
    if (res.success) {
      router.push('/admin/kegiatan')
    } else {
      setError(res.error || 'Terjadi kesalahan saat menyimpan.')
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Hapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.')) return

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
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Language Switcher */}
      <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Form Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Informasi Kegiatan */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-semibold text-slate-900">
                1. Informasi Dasar Kegiatan ({activeTab.toUpperCase()})
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="title"
                value={localizedData.title[activeTab]}
                onChange={handleLocalizedChange}
                placeholder="Contoh: Perayaan Tahun Baru Imlek, Sembahyang King Thi Kong..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <div className="text-xs text-slate-500 mb-2">
                Kosongkan untuk membuat slug otomatis dari judul. Format URL yang ramah SEO.
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
                Ringkasan Singkat ({activeTab.toUpperCase()})
              </label>
              <div className="text-xs text-slate-500 mb-2">
                Ditampilkan pada kartu daftar kegiatan dan pratinjau media sosial.
              </div>
              <textarea
                name="shortDescription"
                value={localizedData.shortDescription[activeTab]}
                onChange={handleLocalizedChange}
                rows={3}
                placeholder="Ringkasan inti mengenai upacara atau kegiatan ini..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi Lengkap ({activeTab.toUpperCase()})
              </label>
              <div key={`editor-activity-${activeTab}`}>
                <LexicalEditor
                  mediaCollection="activity-media"
                  initialData={localizedData.description[activeTab]}
                  onChange={(json) =>
                    setLocalizedData((prev) => ({
                      ...prev,
                      description: { ...prev.description, [activeTab]: json as any },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 2: Jadwal & Kalender */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-900">2. Jadwal & Kalender Acara</h2>
              </div>
              <span className="text-xs text-slate-500">Mendukung Imlek & Masehi</span>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-100 text-xs text-blue-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                Pedoman Penanggalan:
              </div>
              <p>
                - <strong>Kalender Imlek (Lunar)</strong>: Digunakan untuk ritual rutin tahunan (misal: Tanggal 24 Bulan 12 Imlek).
              </p>
              <p>
                - <strong>Kalender Masehi (Gregorian)</strong>: Tanggal aktual pelaksanaan tahun berjalan yang telah dikonfirmasi pengurus klenteng.
              </p>
              <p className="text-amber-700 font-medium pt-1">
                ⚠️ Catatan: Tanggal pelaksanaan dapat mengalami penyesuaian mengikuti hasil musyawarah pengurus Klenteng Tek Hay Bio.
              </p>
            </div>

            {/* Kalender Imlek Details */}
            <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-4">
              <div className="flex items-center gap-2 font-medium text-sm text-amber-900">
                <Moon className="w-4 h-4 text-amber-600" />
                Informasi Kalender Imlek (Lunar)
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pola Aturan Imlek</label>
                <select
                  name="lunarRuleType"
                  value={formData.lunarRuleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {ACTIVITY_LUNAR_RULES.map((rule) => (
                    <option key={rule.value} value={rule.value}>
                      {rule.label[activeTab]}
                    </option>
                  ))}
                </select>
              </div>

              {formData.lunarRuleType === 'none' ? (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Kegiatan ini tidak menggunakan acuan penanggalan Imlek (hanya penanggalan Masehi).</span>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {/* Exact Date */}
                  {formData.lunarRuleType === 'exact_date' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Tanggal Imlek (1–30)
                          </label>
                          <input
                            type="number"
                            name="lunarDay"
                            min="1"
                            max="30"
                            value={formData.lunarDay}
                            onChange={handleChange}
                            placeholder="Contoh: 24"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Bulan Imlek (1–12)
                          </label>
                          <input
                            type="number"
                            name="lunarMonth"
                            min="1"
                            max="12"
                            value={formData.lunarMonth}
                            onChange={handleChange}
                            placeholder="Contoh: 12"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="isLeapMonth"
                          name="isLeapMonth"
                          checked={formData.isLeapMonth}
                          onChange={handleChange}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                        />
                        <label htmlFor="isLeapMonth" className="text-xs text-slate-700 font-medium cursor-pointer">
                          Bulan Kabisat Lunar (Runyue / 闰月)
                        </label>
                      </div>
                    </>
                  )}

                  {/* First Half / Second Half */}
                  {(formData.lunarRuleType === 'first_half' || formData.lunarRuleType === 'second_half') && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Bulan Imlek (1–12)
                          </label>
                          <input
                            type="number"
                            name="lunarMonth"
                            min="1"
                            max="12"
                            value={formData.lunarMonth}
                            onChange={handleChange}
                            placeholder="Contoh: 7"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <div className="p-2.5 bg-amber-100/70 rounded-lg border border-amber-200 text-xs text-amber-800 font-medium">
                            {formData.lunarRuleType === 'first_half'
                              ? '📅 Rentang otomatis: Tanggal 1 s/d 15'
                              : '📅 Rentang otomatis: Tanggal 16 s/d 30'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="isLeapMonth"
                          name="isLeapMonth"
                          checked={formData.isLeapMonth}
                          onChange={handleChange}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                        />
                        <label htmlFor="isLeapMonth" className="text-xs text-slate-700 font-medium cursor-pointer">
                          Bulan Kabisat Lunar (Runyue / 闰月)
                        </label>
                      </div>
                    </>
                  )}

                  {/* Custom Period */}
                  {formData.lunarRuleType === 'custom_period' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Bulan Imlek (Opsional, 1–12)
                          </label>
                          <input
                            type="number"
                            name="lunarMonth"
                            min="1"
                            max="12"
                            value={formData.lunarMonth}
                            onChange={handleChange}
                            placeholder="Kosongkan jika rentang tidak terikat bulan"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                          />
                        </div>

                        <div className="flex items-end pb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isLeapMonth"
                              name="isLeapMonth"
                              checked={formData.isLeapMonth}
                              onChange={handleChange}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            <label htmlFor="isLeapMonth" className="text-xs text-slate-700 font-medium cursor-pointer">
                              Bulan Kabisat Lunar (Runyue / 闰月)
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Keterangan Periode Khusus Imlek ({activeTab.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          name="lunarPeriodDescription"
                          value={localizedData.lunarPeriodDescription[activeTab]}
                          onChange={handleLocalizedChange}
                          placeholder="Misal: 'Sepuluh hari sebelum dan sesudah 5 April (Ceng Beng)'"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                        <div className="text-[11px] text-slate-500 mt-1">
                          Deskripsikan penanggalan adat atau rentang pelaksanaan kegiatan dengan jelas.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Waktu Masehi Aktual */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 font-medium text-sm text-slate-900">
                <Clock className="w-4 h-4 text-slate-600" />
                Tanggal Pelaksanaan Kalender Masehi (Jika Telah Ditetapkan)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tanggal & Waktu Mulai (Masehi)
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Kosongkan jika jadwal pelaksanaan belum diputuskan.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tanggal & Waktu Selesai (Opsional)
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Isi jika kegiatan berlangsung lebih dari satu hari.
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Jadwal & Reschedule */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Keterangan Jadwal Tambahan ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="scheduleNote"
                  value={localizedData.scheduleNote[activeTab]}
                  onChange={handleLocalizedChange}
                  rows={2}
                  placeholder="Catatan jika tanggal masih bersifat perkiraan atau menunggu rapat pengurus..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {formData.scheduleStatus === 'rescheduled' && (
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Kegiatan Ditandai Mengalami Perubahan Jadwal (Rescheduled)
                  </div>
                  <label className="block text-xs font-medium text-slate-700">
                    Keterangan Perubahan Jadwal ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    name="rescheduledNote"
                    value={localizedData.rescheduledNote[activeTab]}
                    onChange={handleLocalizedChange}
                    rows={2}
                    placeholder="Jelaskan alasan pemindahan jadwal dan tanggal sebelumnya..."
                    className="w-full px-3.5 py-2 border border-rose-300 rounded-lg text-sm bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Lokasi Pelaksanaan */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-900">
                3. Lokasi Pelaksanaan Kegiatan ({activeTab.toUpperCase()})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Cakupan Lokasi</label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {ACTIVITY_LOCATION_TYPES.map((lt) => (
                    <option key={lt.value} value={lt.value}>
                      {lt.label[activeTab]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Tempat / Klenteng ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  name="location"
                  value={localizedData.location[activeTab]}
                  onChange={handleLocalizedChange}
                  placeholder="Klenteng Tek Hay Bio, Semarang"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat / Keterangan Lokasi Detail ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="locationAddress"
                value={localizedData.locationAddress[activeTab]}
                onChange={handleLocalizedChange}
                rows={2}
                placeholder="Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {formData.locationType !== 'internal' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Hubungan Lokasi Eksternal ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  name="locationRelationship"
                  value={localizedData.locationRelationship[activeTab]}
                  onChange={handleLocalizedChange}
                  placeholder="Contoh: Kirab Cap Go Meh di Klenteng Tek Hay Kiong Tegal (kunjungan muhibah)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Catat informasi tempat tanpa mengasumsikan kepemilikan acara bersama jika belum resmi dikonfirmasi.
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Makna, Tradisi & Rangkaian Acara */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Flame className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-semibold text-slate-900">
                4. Makna, Tradisi & Rangkaian Ritual ({activeTab.toUpperCase()})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dewa atau Tokoh Terkait ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  name="relatedDeity"
                  value={localizedData.relatedDeity[activeTab]}
                  onChange={handleLocalizedChange}
                  placeholder="Misal: Tek Hay Cin Jin, Kwan Im Po Sat, Hok Tek Ceng Sin..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Peran / Keterkaitan Dewa ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  name="deityRole"
                  value={localizedData.deityRole[activeTab]}
                  onChange={handleLocalizedChange}
                  placeholder="Misal: Tuan Rumah / Hari Kebesaran (Sejit)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Makna & Tujuan Ritual ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="ritualMeaning"
                value={localizedData.ritualMeaning[activeTab]}
                onChange={handleLocalizedChange}
                rows={3}
                placeholder="Makna filosofis, rasa syukur, atau tujuan dari pelaksanaan perayaan..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Penjelasan Tradisi ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="traditionExplanation"
                value={localizedData.traditionExplanation[activeTab]}
                onChange={handleLocalizedChange}
                rows={3}
                placeholder="Latar belakang sejarah tradisi leluhur yang diwariskan turun-temurun..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Rangkaian Kegiatan / Susunan Acara ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="eventSequence"
                value={localizedData.eventSequence[activeTab]}
                onChange={handleLocalizedChange}
                rows={4}
                placeholder="1. Pukul 09.00 WIB: Persiapan altar&#10;2. Pukul 10.00 WIB: Sembahyang bersama Thian Gong&#10;3. Sembahyang Kongco Tek Hay Cin Jin..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Catatan Resmi Pengurus Klenteng ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="managementNotes"
                value={localizedData.managementNotes[activeTab]}
                onChange={handleLocalizedChange}
                rows={2}
                placeholder="Pesan atau imbauan khusus dari pengurus yayasan klenteng..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Section 5: Partisipasi Umat */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  5. Informasi Partisipasi Umat ({activeTab.toUpperCase()})
                </h2>
              </div>
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                Opsional
              </span>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              Bagian ini hanya akan ditampilkan pada halaman website publik apabila diisi. Informasi donasi lilin & lampion terbuka untuk umum tanpa memuat rekening atau klaim yang belum resmi.
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Deskripsi Partisipasi Umat ({activeTab.toUpperCase()})
              </label>
              <textarea
                name="participationDescription"
                value={localizedData.participationDescription[activeTab]}
                onChange={handleLocalizedChange}
                rows={2}
                placeholder="Penjelasan keikutsertaan umat dan masyarakat umum..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Donasi Lilin / Pelita Sembahyang ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="candleDonationInfo"
                  value={localizedData.candleDonationInfo[activeTab]}
                  onChange={handleLocalizedChange}
                  rows={2}
                  placeholder="Terbuka bagi umat yang ingin berpartisipasi menyalakan lilin berkah..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Donasi Lampion Berkah ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="lanternDonationInfo"
                  value={localizedData.lanternDonationInfo[activeTab]}
                  onChange={handleLocalizedChange}
                  rows={2}
                  placeholder="Pemasangan lampion berkah doa keluarga..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Perlengkapan Ibadah / Pakaian ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="requiredEquipment"
                  value={localizedData.requiredEquipment[activeTab]}
                  onChange={handleLocalizedChange}
                  rows={2}
                  placeholder="Pakaian sopan rapi, peralatan sembahyang yang dibawa sendiri..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instruksi & Tata Tertib ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="participationInstructions"
                  value={localizedData.participationInstructions[activeTab]}
                  onChange={handleLocalizedChange}
                  rows={2}
                  placeholder="Menjaga keheningan, mengikuti arahan pemandu ritual klenteng..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kontak Informasi / Narahubung ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                name="contactInfo"
                value={localizedData.contactInfo[activeTab]}
                onChange={handleLocalizedChange}
                placeholder="Sekretariat Klenteng Tek Hay Bio atau narahubung panitia"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Controls) */}
        <div className="space-y-6">
          {/* Publikasi & Klasifikasi */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 text-sm">
              Status & Klasifikasi
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status Publikasi Website <span className="text-red-500">*</span>
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
                Kategori Kegiatan <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label[activeTab]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pola Pengulangan <span className="text-red-500">*</span>
              </label>
              <select
                name="recurrenceType"
                value={formData.recurrenceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {ACTIVITY_RECURRENCE_TYPES.map((rec) => (
                  <option key={rec.value} value={rec.value}>
                    {rec.label[activeTab]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status Jadwal <span className="text-red-500">*</span>
              </label>
              <select
                name="scheduleStatus"
                value={formData.scheduleStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {ACTIVITY_SCHEDULE_STATUSES.map((stat) => (
                  <option key={stat.value} value={stat.value}>
                    {stat.label[activeTab]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tahun Pelaksanaan
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 text-sm">
              Poster / Foto Utama
            </h3>
            <MediaPicker
              mediaCollection="activity-media"
              value={formData.featuredImage}
              onChange={(val) => setFormData((prev) => ({ ...prev, featuredImage: val }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm transition-colors shadow-sm"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Kegiatan'}
            </button>

            {initialData?.id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 text-sm transition-colors"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Kegiatan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
