/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getCollection } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import type { CMSRecord } from '@/types'
import Link from 'next/link'
import { Pagination, PaginationToolbar } from '@/components/ui/Pagination'
import {
  ACTIVITY_CATEGORIES,
  getActivityCategoryLabel,
  getActivityScheduleStatus,
  formatGregorianDateRange,
  formatLunarDate,
} from '@/lib/activities/utils'
import { Calendar, Moon, MapPin, Sparkles, AlertCircle } from 'lucide-react'

export async function ActivitiesListPage({
  locale,
  page = 1,
  limit = 9,
  category,
}: {
  locale: 'id' | 'en'
  page?: number
  limit?: number
  category?: string
}) {
  const where: any = { status: { equals: 'published' } }
  if (category && category !== 'all') {
    where.category = { equals: category }
  }

  const { docs: activities, totalDocs, totalPages, page: currentPage } = await getCollection('activities', locale, {
    where,
    sort: '-date',
    page,
    limit,
  })

  const baseUrl = `/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}`

  return (
    <>
      <PageHeader
        title={locale === 'id' ? 'Jadwal Kegiatan & Perayaan' : 'Activities & Festival Schedule'}
        description={
          locale === 'id'
            ? 'Dokumentasi dan agenda ritual keagamaan, sembahyang leluhur, hari kebesaran dewa, dan perayaan budaya di Klenteng Tek Hay Bio.'
            : 'Documentation and schedule of religious rituals, ancestral worship, deity festivals, and cultural events at Tek Hay Bio Temple.'
        }
      />

      <Section className="bg-stone-50">
        <Container>
          {/* Calendar Banner Callout */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-amber-50/70 to-stone-50 border border-primary/20 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary text-white shrink-0 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {locale === 'id'
                    ? 'Kalender Ritual & Perayaan Klenteng'
                    : 'Temple Ritual & Celebration Calendar'}
                </h3>
                <p className="text-xs text-stone-600">
                  {locale === 'id'
                    ? 'Lihat kalender interaktif bulanan dan agenda ritual tahunan lengkap dengan konversi Imlek.'
                    : 'View interactive monthly calendar and annual schedule with lunar date conversions.'}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/${locale === 'id' ? 'kalender-ritual' : 'ritual-calendar'}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm shrink-0"
            >
              <span>{locale === 'id' ? 'Buka Kalender Ritual' : 'Open Ritual Calendar'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-stone-200 pb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2">
              {locale === 'id' ? 'Kategori:' : 'Category:'}
            </span>
            <Link
              href={baseUrl}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !category || category === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {locale === 'id' ? 'Semua Kegiatan' : 'All Activities'}
            </Link>
            {ACTIVITY_CATEGORIES.map((cat) => {
              const isActive = category === cat.value
              const filterUrl = `${baseUrl}?category=${cat.value}`
              return (
                <Link
                  key={cat.value}
                  href={filterUrl}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat.label[locale]}
                </Link>
              )
            })}
          </div>

          {activities.length === 0 ? (
            <div className="py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200 shadow-sm max-w-xl mx-auto space-y-3">
              <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="text-base font-medium text-stone-700">
                {locale === 'id' ? 'Belum ada agenda kegiatan pada kategori ini.' : 'No upcoming activities in this category.'}
              </p>
              <p className="text-xs text-stone-400">
                {locale === 'id'
                  ? 'Silakan periksa kembali di lain waktu atau pilih kategori lainnya.'
                  : 'Please check back later or select another category.'}
              </p>
              {category && category !== 'all' && (
                <div className="pt-2">
                  <Link href={baseUrl} className="text-xs text-primary font-medium hover:underline">
                    ← {locale === 'id' ? 'Kembali ke Semua Kegiatan' : 'Back to All Activities'}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <PaginationToolbar
                currentPage={currentPage}
                totalDocs={totalDocs}
                limit={limit}
                locale={locale}
                itemName={locale === 'id' ? 'kegiatan' : 'activities'}
                pageSizeOptions={[6, 9, 12, 18]}
                baseUrl={category ? `${baseUrl}?category=${category}` : baseUrl}
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity: any) => {
                  const gregorianDate = formatGregorianDateRange(activity.date, activity.endDate, locale)
                  const lunarDate = formatLunarDate(activity, locale)
                  const categoryLabel = getActivityCategoryLabel(activity.category, locale)
                  const scheduleStatusObj = getActivityScheduleStatus(activity.scheduleStatus, locale)

                  // Date badge on image corner (never show fake date!)
                  const dateObj = activity.date ? new Date(activity.date) : null
                  const hasValidGregorian = dateObj && !isNaN(dateObj.getTime())

                  return (
                    <Link
                      href={`/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}/${activity.slug}`}
                      key={activity.id as string}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col border border-stone-200"
                    >
                      <div className="aspect-[4/3] relative bg-stone-100 overflow-hidden">
                        <MediaImage
                          media={activity.featuredImage as CMSRecord}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top-Right Badge: Real Gregorian date, Lunar badge, or Schedule Status */}
                        {hasValidGregorian ? (
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-md border border-stone-100">
                            <span className="block text-2xl font-bold text-primary leading-none">
                              {dateObj.getDate()}
                            </span>
                            <span className="block text-[11px] font-bold text-stone-600 uppercase mt-1">
                              {dateObj.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                                month: 'short',
                              })}
                            </span>
                          </div>
                        ) : lunarDate ? (
                          <div className="absolute top-4 right-4 bg-amber-50/95 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-md border border-amber-200">
                            <span className="block text-[11px] font-bold text-amber-900 leading-tight">
                              🌙 Imlek
                            </span>
                            {activity.lunarDay && activity.lunarMonth ? (
                              <span className="block text-sm font-bold text-amber-700 mt-0.5">
                                {activity.lunarDay}/{activity.lunarMonth}
                              </span>
                            ) : (
                              <span className="block text-[10px] font-medium text-amber-800 mt-0.5">
                                Bulan {activity.lunarMonth || ''}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-center shadow-md text-white text-xs font-medium">
                            {scheduleStatusObj.label[locale]}
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col space-y-3">
                        {/* Categories and Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded uppercase tracking-wider">
                            {categoryLabel}
                          </span>
                          {activity.scheduleStatus && activity.scheduleStatus !== 'scheduled' && (
                            <span
                              className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${scheduleStatusObj.badgeClass}`}
                            >
                              {scheduleStatusObj.label[locale]}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                          {activity.title as string}
                        </h2>

                        {/* Schedule & Date Rows */}
                        <div className="space-y-1.5 text-xs text-stone-600">
                          {gregorianDate && (
                            <div className="flex items-center gap-1.5 font-medium text-stone-700">
                              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{gregorianDate}</span>
                            </div>
                          )}
                          {lunarDate && (
                            <div className="flex items-center gap-1.5 text-amber-800">
                              <Moon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{lunarDate}</span>
                            </div>
                          )}
                          {!gregorianDate && !lunarDate && (
                            <div className="text-stone-400 italic">
                              {locale === 'id' ? 'Jadwal belum ditentukan' : 'Date to be announced'}
                            </div>
                          )}
                        </div>

                        {/* Related Deity / Figure */}
                        {Boolean(activity.relatedDeity) && (
                          <div className="text-xs text-amber-700 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{activity.relatedDeity as string}</span>
                          </div>
                        )}

                        {/* Location */}
                        {Boolean(activity.location) && (
                          <div className="text-xs text-stone-500 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{activity.location as string}</span>
                          </div>
                        )}

                        {/* Reschedule alert notice if any */}
                        {activity.scheduleStatus === 'rescheduled' && Boolean(activity.rescheduledNote) && (
                          <div className="p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-700 flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{activity.rescheduledNote}</span>
                          </div>
                        )}

                        {/* Excerpt */}
                        <p className="text-stone-600 line-clamp-2 flex-1 text-sm pt-1">
                          {activity.shortDescription as string}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                totalDocs={totalDocs}
                baseUrl={category ? `${baseUrl}?category=${category}` : baseUrl}
                limit={limit}
                locale={locale}
                itemName={locale === 'id' ? 'kegiatan' : 'activities'}
                pageSizeOptions={[6, 9, 12, 18]}
              />
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
