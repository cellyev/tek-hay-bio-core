/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  CalendarDays,
  List,
  Moon,
  MapPin,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
} from 'lucide-react'
import {
  ACTIVITY_CATEGORIES,
} from '@/lib/activities/utils'
import {
  resolveActivityOccurrences,
  groupOccurrencesByMonth,
  generateMonthGrid,
  ActivityOccurrence,
  CalendarDayCell,
} from '@/lib/activities/calendarUtils'
import { MediaImage } from '@/components/ui/MediaImage'
import type { CMSRecord } from '@/types'

const MONTH_NAMES = [
  { id: 'Januari', en: 'January' },
  { id: 'Februari', en: 'February' },
  { id: 'Maret', en: 'March' },
  { id: 'April', en: 'April' },
  { id: 'Mei', en: 'May' },
  { id: 'Juni', en: 'June' },
  { id: 'Juli', en: 'July' },
  { id: 'Agustus', en: 'August' },
  { id: 'September', en: 'September' },
  { id: 'Oktober', en: 'October' },
  { id: 'November', en: 'November' },
  { id: 'Desember', en: 'December' },
]

const WEEKDAY_NAMES = [
  { id: 'Min', en: 'Sun', isSunday: true },
  { id: 'Sen', en: 'Mon', isSunday: false },
  { id: 'Sel', en: 'Tue', isSunday: false },
  { id: 'Rab', en: 'Wed', isSunday: false },
  { id: 'Kam', en: 'Thu', isSunday: false },
  { id: 'Jum', en: 'Fri', isSunday: false },
  { id: 'Sab', en: 'Sat', isSunday: false },
]

export function RitualCalendarView({
  activities,
  locale = 'id',
  initialYear,
}: {
  activities: any[]
  locale: 'id' | 'en'
  initialYear?: number
}) {
  const currentYear = initialYear || new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDayCell, setSelectedDayCell] = useState<CalendarDayCell | null>(null)

  // 1. Resolve occurrences for selectedYear
  const { scheduled, unscheduled } = useMemo(() => {
    return resolveActivityOccurrences(activities, selectedYear, locale)
  }, [activities, selectedYear, locale])

  // 2. Filter by Category
  const filteredScheduled = useMemo(() => {
    if (selectedCategory === 'all') return scheduled
    return scheduled.filter((occ) => occ.category === selectedCategory)
  }, [scheduled, selectedCategory])

  const filteredUnscheduled = useMemo(() => {
    if (selectedCategory === 'all') return unscheduled
    return unscheduled.filter((occ) => occ.category === selectedCategory)
  }, [unscheduled, selectedCategory])

  // 3. Group by month for Agenda List View
  const groupedMonths = useMemo(() => {
    return groupOccurrencesByMonth(filteredScheduled)
  }, [filteredScheduled])

  // 4. Generate Month Grid for Calendar Grid View
  const { cells, monthNameId, monthNameEn } = useMemo(() => {
    return generateMonthGrid(selectedYear, selectedMonth, filteredScheduled)
  }, [selectedYear, selectedMonth, filteredScheduled])

  const currentMonthName = locale === 'id' ? monthNameId : monthNameEn

  // Navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear((prev) => prev - 1)
    } else {
      setSelectedMonth((prev) => prev - 1)
    }
    setSelectedDayCell(null)
  }

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear((prev) => prev + 1)
    } else {
      setSelectedMonth((prev) => prev + 1)
    }
    setSelectedDayCell(null)
  }

  const handleSelectDay = (cell: CalendarDayCell) => {
    setSelectedDayCell(cell)
  }

  // Link base
  const activityBasePath = `/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}`

  // Year options: -1, current, +1, +2
  const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

  return (
    <div className="space-y-8">
      {/* ===================== CONTROL BAR ===================== */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 self-start md:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>{locale === 'id' ? 'Daftar Agenda' : 'Agenda List'}</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{locale === 'id' ? 'Kalender Bulanan' : 'Monthly Calendar'}</span>
            </button>
          </div>

          {/* Year Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1">
              {locale === 'id' ? 'Tahun:' : 'Year:'}
            </span>
            <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200">
              {availableYears.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setSelectedYear(y)
                    setSelectedDayCell(null)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                    selectedYear === y
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2">
            {locale === 'id' ? 'Kategori:' : 'Category:'}
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {locale === 'id' ? 'Semua Kegiatan' : 'All Activities'}
          </button>
          {ACTIVITY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label[locale]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ===================== VIEW MODE A: DAFTAR AGENDA ===================== */}
      {viewMode === 'list' && (
        <div className="space-y-12">
          {filteredScheduled.length === 0 ? (
            <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-xl mx-auto space-y-3 p-6">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-base font-semibold text-stone-700">
                {locale === 'id'
                  ? `Tidak ada agenda kegiatan terjadwal pada tahun ${selectedYear}.`
                  : `No scheduled activities found for year ${selectedYear}.`}
              </p>
              <p className="text-xs text-stone-400">
                {locale === 'id'
                  ? 'Silakan pilih tahun lain atau periksa agenda belum ditentukan di bawah.'
                  : 'Please check other years or explore unscheduled activities below.'}
              </p>
            </div>
          ) : (
            // Render 12 Months
            Array.from({ length: 12 }, (_, i) => i + 1).map((monthNum) => {
              const monthEvents = groupedMonths[monthNum]
              if (!monthEvents || monthEvents.length === 0) return null

              const monthLabel = MONTH_NAMES[monthNum - 1][locale]

              return (
                <section key={monthNum} className="space-y-5">
                  <div className="flex items-center justify-between border-b-2 border-primary/20 pb-2">
                    <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-3">
                      <span>{monthLabel} {selectedYear}</span>
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-3 py-1 rounded-full border border-stone-200">
                      {monthEvents.length} {locale === 'id' ? 'Kegiatan' : 'Events'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthEvents.map((occ) => (
                      <ActivityCalendarCard
                        key={`${occ.id}-${occ.startDateStr}`}
                        occurrence={occ}
                        locale={locale}
                        basePath={activityBasePath}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          )}

          {/* Dedicated Section: Agenda Menunggu Keputusan Pengurus / Belum Memiliki Tanggal Pasti */}
          {filteredUnscheduled.length > 0 && (
            <section className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 md:p-8 space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {locale === 'id'
                      ? 'Agenda Menunggu Keputusan Pengurus & Periode Khusus'
                      : 'Activities Pending Official Schedule & Periodic Rules'}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {locale === 'id'
                      ? 'Kegiatan di bawah ini mengacu pada aturan kalender tertentu (misal: paruh bulan Imlek, peristiwa tradisi, atau bersifat insidental) yang tanggal Masehi resminya menunggu konfirmasi pengurus Klenteng Tek Hay Bio.'
                      : 'The activities below follow lunar periodic rules or conditional traditions. Official Gregorian dates will be confirmed and announced by the temple board.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnscheduled.map((occ) => (
                  <ActivityCalendarCard
                    key={occ.id}
                    occurrence={occ}
                    locale={locale}
                    basePath={activityBasePath}
                    isUnscheduledSection
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ===================== VIEW MODE B: KALENDER BULANAN ===================== */}
      {viewMode === 'calendar' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Calendar Header with Month Navigation */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-200 bg-stone-50/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 transition-colors text-stone-700 shadow-sm"
                  aria-label={locale === 'id' ? 'Bulan Sebelumnya' : 'Previous Month'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 transition-colors text-stone-700 shadow-sm"
                  aria-label={locale === 'id' ? 'Bulan Berikutnya' : 'Next Month'}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                  {currentMonthName} {selectedYear}
                </h2>
              </div>

              {/* Month Quick Select */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value, 10))
                    setSelectedDayCell(null)
                  }}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs md:text-sm font-medium text-stone-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {m[locale]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-100/70 text-center py-2.5 text-xs font-bold uppercase tracking-wider">
              {WEEKDAY_NAMES.map((w, idx) => (
                <div
                  key={idx}
                  className={w.isSunday ? 'text-rose-600 font-extrabold' : 'text-stone-600'}
                >
                  {w[locale]}
                </div>
              ))}
            </div>

            {/* 7-column Calendar Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-100 border-b border-stone-200">
              {cells.map((cell) => {
                const isSelected = selectedDayCell?.dateStr === cell.dateStr
                const hasEvents = cell.occurrences.length > 0

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => handleSelectDay(cell)}
                    className={`min-h-[90px] md:min-h-[120px] p-1.5 md:p-2.5 transition-all flex flex-col justify-between cursor-pointer group ${
                      !cell.isCurrentMonth
                        ? 'bg-stone-50/60 text-stone-400 opacity-60'
                        : 'bg-white hover:bg-stone-50/80'
                    } ${isSelected ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}`}
                  >
                    {/* Date Number & Lunar Label */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs md:text-sm font-bold ${
                          cell.isToday
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-stone-900 group-hover:text-primary'
                        }`}
                      >
                        {cell.day}
                      </span>
                      <span className="text-[10px] md:text-xs text-stone-400 font-mono" title={cell.lunarMonthDay}>
                        {cell.lunarText}
                      </span>
                    </div>

                    {/* Event Badges */}
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {cell.occurrences.slice(0, 2).map((occ) => (
                        <Link
                          key={occ.id}
                          href={`${activityBasePath}/${occ.slug}`}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          className="text-[10px] md:text-xs truncate px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium hover:bg-primary hover:text-white transition-all flex items-center gap-1 group/item z-10 cursor-pointer shadow-none hover:shadow-sm"
                          title={`${occ.title} — ${locale === 'id' ? 'Klik untuk membuka detail kegiatan' : 'Click to open activity details'}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover/item:bg-white shrink-0 transition-colors" />
                          <span className="truncate">{occ.title}</span>
                        </Link>
                      ))}
                      {cell.occurrences.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectDay(cell)
                          }}
                          className="text-[9px] md:text-[10px] text-stone-500 hover:text-primary font-semibold px-1 text-left w-full transition-colors cursor-pointer"
                        >
                          +{cell.occurrences.length - 2} {locale === 'id' ? 'lainnya (lihat)' : 'more (view)'}
                        </button>
                      )}
                    </div>

                    {/* Indicator Dot on Mobile */}
                    {hasEvents && (
                      <div className="flex md:hidden justify-center mt-1">
                        {cell.occurrences.length === 1 ? (
                          <Link
                            href={`${activityBasePath}/${cell.occurrences[0].slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 -m-1"
                            title={cell.occurrences[0].title}
                          >
                            <span className="w-2 h-2 rounded-full bg-primary block" />
                          </Link>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Day Event Drawer / Detail Panel */}
          {selectedDayCell && (
            <div className="bg-white rounded-2xl border-2 border-primary/30 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>
                      {selectedDayCell.day} {currentMonthName} {selectedDayCell.year}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-stone-400" />
                    <span>{locale === 'id' ? 'Kalender Imlek:' : 'Lunar Calendar:'} {selectedDayCell.lunarText} ({selectedDayCell.lunarMonthDay})</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDayCell(null)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold px-2.5 py-1 rounded-lg bg-stone-100"
                >
                  ✕ {locale === 'id' ? 'Tutup' : 'Close'}
                </button>
              </div>

              {selectedDayCell.occurrences.length === 0 ? (
                <p className="text-sm text-stone-500 py-4 text-center">
                  {locale === 'id'
                    ? 'Tidak ada agenda kegiatan khusus pada tanggal ini.'
                    : 'No specific activities scheduled on this date.'}
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedDayCell.occurrences.map((occ) => (
                    <ActivityCalendarCard
                      key={occ.id}
                      occurrence={occ}
                      locale={locale}
                      basePath={activityBasePath}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Unscheduled section under calendar grid view */}
          {filteredUnscheduled.length > 0 && (
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 font-bold">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>
                  {locale === 'id'
                    ? 'Agenda Lainnya (Menunggu Tanggal Masehi Pasti):'
                    : 'Other Activities (Pending Official Solar Date):'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnscheduled.map((occ) => (
                  <ActivityCalendarCard
                    key={occ.id}
                    occurrence={occ}
                    locale={locale}
                    basePath={activityBasePath}
                    isUnscheduledSection
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Reusable Card for Calendar Occurrence
 */
function ActivityCalendarCard({
  occurrence: occ,
  locale,
  basePath,
  isUnscheduledSection = false,
}: {
  occurrence: ActivityOccurrence
  locale: 'id' | 'en'
  basePath: string
  isUnscheduledSection?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Optional Thumbnail if featuredImage exists */}
        {occ.featuredImage && (
          <Link
            href={`${basePath}/${occ.slug}`}
            className="block aspect-[16/9] relative bg-stone-100 overflow-hidden border-b border-stone-100"
          >
            <MediaImage
              media={occ.featuredImage as CMSRecord}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        )}

        <div className="p-5 space-y-3">
          {/* Top Badges: Category & Schedule Status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              {occ.categoryLabel}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${occ.scheduleStatusBadgeClass}`}
            >
              {occ.scheduleStatusLabel[locale]}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-stone-900 group-hover:text-primary transition-colors leading-snug">
            <Link href={`${basePath}/${occ.slug}`}>
              {occ.title}
            </Link>
          </h4>

          {/* Gregorian Date */}
          <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{occ.gregorianDateLabel}</span>
          </div>

          {/* Lunar Date if available */}
          {occ.lunarDateLabel && (
            <div className="text-xs text-stone-600 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{occ.lunarDateLabel}</span>
            </div>
          )}

          {/* Estimated lunar conversion notice badge */}
          {occ.isEstimated && !isUnscheduledSection && (
            <div className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              <Info className="w-3 h-3" />
              <span>
                {locale === 'id'
                  ? 'Perkiraan Tanggal Masehi (Konversi Imlek)'
                  : 'Estimated Gregorian (Lunar Conversion)'}
              </span>
            </div>
          )}

          {/* Deity if available */}
          {occ.deity && (
            <div className="text-xs text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                {locale === 'id' ? 'Dewa:' : 'Deity:'} {occ.deity}
              </span>
            </div>
          )}

          {/* Location */}
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{occ.locationLabel}</span>
          </div>

          {/* Short description */}
          {occ.shortDescription && (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
              {occ.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Detail Link */}
      <div className="p-4 pt-0">
        <Link
          href={`${basePath}/${occ.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>{locale === 'id' ? 'Lihat Detail Kegiatan' : 'View Activity Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
