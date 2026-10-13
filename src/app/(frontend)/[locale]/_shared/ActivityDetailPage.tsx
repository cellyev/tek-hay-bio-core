/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getBySlugWithAlternates } from './queries'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import type { CMSRecord } from '@/types'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { SetAlternateLanguage } from '@/components/layout/SetAlternateLanguage'
import {
  getActivityCategoryLabel,
  getActivityRecurrenceLabel,
  getActivityScheduleStatus,
  formatGregorianDateRange,
  formatLunarDate,
} from '@/lib/activities/utils'
import {
  Calendar,
  Moon,
  MapPin,
  Sparkles,
  AlertCircle,
  Clock,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Phone,
  Flame,
} from 'lucide-react'

export async function ActivityDetailPage({ locale, slug }: { locale: 'id' | 'en'; slug: string }) {
  const { doc: activity, alternateSlug, needsRedirect, redirectUrl } = (await getBySlugWithAlternates(
    'activities',
    slug,
    locale
  )) as any

  if (needsRedirect && redirectUrl) {
    redirect(redirectUrl)
  }

  if (!activity) {
    notFound()
  }

  const otherLocale = locale === 'id' ? 'en' : 'id'
  const alternatePath =
    otherLocale === 'id'
      ? `/id/kegiatan/${alternateSlug || activity.slug}`
      : `/en/activities/${alternateSlug || activity.slug}`

  const gregorianDate = formatGregorianDateRange(activity.date, activity.endDate, locale)
  const lunarDate = formatLunarDate(activity, locale)
  const categoryLabel = getActivityCategoryLabel(activity.category, locale)
  const recurrenceLabel = getActivityRecurrenceLabel(activity.recurrenceType, locale)
  const scheduleStatusObj = getActivityScheduleStatus(activity.scheduleStatus, locale)

  const hasMeaningOrTradition = Boolean(
    activity.ritualMeaning ||
      activity.traditionExplanation ||
      activity.eventSequence ||
      activity.managementNotes
  )

  const hasParticipation = Boolean(
    activity.participationDescription ||
      activity.candleDonationInfo ||
      activity.lanternDonationInfo ||
      activity.requiredEquipment ||
      activity.participationInstructions ||
      activity.contactInfo
  )

  return (
    <article className="bg-stone-50 min-h-screen">
      <SetAlternateLanguage path={alternatePath} />
      {/* Hero Banner Header */}
      <div className="w-full min-h-[45vh] md:min-h-[55vh] relative bg-stone-900 flex items-end">
        <MediaImage
          media={activity.featuredImage as CMSRecord}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <Container className="relative z-10 py-12 w-full">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link
              href={`/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}`}
              className="text-stone-300 hover:text-white inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors"
            >
              ← {locale === 'id' ? 'Kembali ke Jadwal Kegiatan' : 'Back to Activities Schedule'}
            </Link>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <Link
              href={`/${locale}/${locale === 'id' ? 'kalender-ritual' : 'ritual-calendar'}`}
              className="text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors"
            >
              📅 {locale === 'id' ? 'Lihat di Kalender Ritual' : 'View in Ritual Calendar'}
            </Link>
          </div>

          <div className="max-w-4xl space-y-4 text-white">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-primary text-white font-bold rounded uppercase tracking-wider">
                {categoryLabel}
              </span>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-stone-200 font-medium rounded border border-white/20">
                {recurrenceLabel}
              </span>
              <span
                className={`px-3 py-1 font-medium rounded border ${scheduleStatusObj.badgeClass}`}
              >
                {scheduleStatusObj.label[locale]}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
              {activity.title as string}
            </h1>

            {/* Quick Metadata Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-stone-300">
              {gregorianDate && (
                <div className="flex items-center gap-1.5 text-stone-100 font-medium">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>{gregorianDate}</span>
                </div>
              )}
              {lunarDate && (
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lunarDate}</span>
                </div>
              )}
              {Boolean(activity.location) && (
                <div className="flex items-center gap-1.5 text-stone-300">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{activity.location as string}</span>
                </div>
              )}
              {Boolean(activity.relatedDeity) && (
                <div className="flex items-center gap-1.5 text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {locale === 'id' ? 'Dewa Terkait:' : 'Deity:'} {activity.relatedDeity as string}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Body */}
      <Section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Left 2 Columns: Narratives, Sequence, Meaning */}
            <div className="lg:col-span-2 space-y-10">
              {/* Rescheduled Alert if present */}
              {activity.scheduleStatus === 'rescheduled' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">
                      {locale === 'id' ? 'Pemberitahuan Perubahan Jadwal' : 'Schedule Change Notice'}
                    </div>
                    <p className="text-rose-700">
                      {activity.rescheduledNote ||
                        (locale === 'id'
                          ? 'Kegiatan ini telah mengalami penyesuaian jadwal dari ketetapan sebelumnya.'
                          : 'This activity has been rescheduled from its previous date.')}
                    </p>
                  </div>
                </div>
              )}

              {/* Tentative Schedule Note if present */}
              {activity.scheduleStatus === 'tentative' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">
                      {locale === 'id' ? 'Jadwal Masih Perkiraan / Tentatif' : 'Tentative Schedule'}
                    </div>
                    <p className="text-amber-800">
                      {activity.scheduleNote ||
                        (locale === 'id'
                          ? 'Tanggal pelaksanaan masih menunggu kepastian atau musyawarah pengurus klenteng.'
                          : 'Event date is awaiting final confirmation by temple management.')}
                    </p>
                  </div>
                </div>
              )}

              {/* Short Description */}
              {Boolean(activity.shortDescription) && (
                <p className="text-xl md:text-2xl text-stone-700 leading-relaxed font-serif italic border-l-4 border-primary pl-4 py-1">
                  {activity.shortDescription as string}
                </p>
              )}

              {/* Full Description Content */}
              {Boolean(activity.description) && (
                <div className="prose prose-stone max-w-none text-stone-800">
                  <RichText content={activity.description} />
                </div>
              )}

              {/* Makna & Tradisi Section */}
              {hasMeaningOrTradition && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-8">
                  <div className="border-b border-stone-100 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                      <Flame className="w-6 h-6 text-primary" />
                      {locale === 'id' ? 'Makna, Tradisi & Rangkaian Acara' : 'Meaning, Tradition & Order of Events'}
                    </h2>
                  </div>

                  {Boolean(activity.ritualMeaning) && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-stone-900 text-base">
                        {locale === 'id' ? 'Makna & Tujuan Upacara' : 'Spiritual Meaning & Purpose'}
                      </h3>
                      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                        {activity.ritualMeaning as string}
                      </p>
                    </div>
                  )}

                  {Boolean(activity.traditionExplanation) && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-stone-900 text-base">
                        {locale === 'id' ? 'Latar Belakang Tradisi' : 'Historical & Cultural Tradition'}
                      </h3>
                      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                        {activity.traditionExplanation as string}
                      </p>
                    </div>
                  )}

                  {Boolean(activity.eventSequence) && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {locale === 'id' ? 'Rangkaian Kegiatan / Susunan Acara' : 'Order of Events / Ritual Sequence'}
                      </h3>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 text-sm whitespace-pre-line leading-relaxed">
                        {activity.eventSequence as string}
                      </div>
                    </div>
                  )}

                  {Boolean(activity.managementNotes) && (
                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
                      <div className="font-bold text-amber-950">
                        {locale === 'id' ? 'Catatan Pengurus Klenteng:' : 'Temple Management Notes:'}
                      </div>
                      <p className="whitespace-pre-line">{activity.managementNotes as string}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Partisipasi Umat Section (Hanya jika diisi) */}
              {hasParticipation && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                      <HeartHandshake className="w-6 h-6 text-primary" />
                      {locale === 'id' ? 'Informasi Partisipasi Umat' : 'Public Participation & Offerings'}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      {locale === 'id'
                        ? 'Informasi keterlibatan umat dan sesaji persembahan terbuka untuk umum.'
                        : 'Information on public participation and devotional offerings.'}
                    </p>
                  </div>

                  {Boolean(activity.participationDescription) && (
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {activity.participationDescription as string}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {Boolean(activity.candleDonationInfo) && (
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2 text-amber-900">
                          <Flame className="w-4 h-4 text-amber-600" />
                          {locale === 'id' ? 'Donasi Lilin / Pelita' : 'Candle Offerings'}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                          {activity.candleDonationInfo as string}
                        </p>
                      </div>
                    )}

                    {Boolean(activity.lanternDonationInfo) && (
                      <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2 text-rose-900">
                          🏮 {locale === 'id' ? 'Donasi Lampion Berkah' : 'Blessing Lanterns'}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                          {activity.lanternDonationInfo as string}
                        </p>
                      </div>
                    )}
                  </div>

                  {Boolean(activity.requiredEquipment) && (
                    <div className="space-y-1.5 pt-2">
                      <div className="font-bold text-stone-900 text-sm">
                        {locale === 'id' ? 'Perlengkapan yang Diperlukan' : 'Required Offerings / Dress Code'}
                      </div>
                      <p className="text-xs text-stone-600 whitespace-pre-line">
                        {activity.requiredEquipment as string}
                      </p>
                    </div>
                  )}

                  {Boolean(activity.participationInstructions) && (
                    <div className="space-y-1.5 pt-2">
                      <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {locale === 'id' ? 'Instruksi & Tata Tertib' : 'Rules & Guidelines'}
                      </div>
                      <p className="text-xs text-stone-600 whitespace-pre-line">
                        {activity.participationInstructions as string}
                      </p>
                    </div>
                  )}

                  {Boolean(activity.contactInfo) && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        <strong>{locale === 'id' ? 'Narahubung / Kontak:' : 'Contact:'}</strong>{' '}
                        {activity.contactInfo as string}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Detailed Info Box Sidebar */}
            <div className="space-y-6">
              {/* Schedule & Location Summary Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
                <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
                  {locale === 'id' ? 'Detail Pelaksanaan' : 'Event Details'}
                </h3>

                {/* Calendar Schedule */}
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                      {locale === 'id' ? 'Kalender Masehi' : 'Gregorian Calendar'}
                    </div>
                    {gregorianDate ? (
                      <div className="font-medium text-stone-900 flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{gregorianDate}</span>
                      </div>
                    ) : (
                      <div className="text-stone-400 italic text-xs">
                        {locale === 'id' ? 'Belum ditentukan' : 'To be confirmed'}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                      {locale === 'id' ? 'Kalender Imlek (Lunar)' : 'Lunar Calendar'}
                    </div>
                    {lunarDate ? (
                      <div className="font-medium text-amber-800 flex items-start gap-2">
                        <Moon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{lunarDate}</span>
                      </div>
                    ) : (
                      <div className="text-stone-400 italic text-xs">-</div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                      {locale === 'id' ? 'Status Jadwal' : 'Schedule Status'}
                    </div>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${scheduleStatusObj.badgeClass}`}
                    >
                      {scheduleStatusObj.label[locale]}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                      {locale === 'id' ? 'Pola Pengulangan' : 'Recurrence'}
                    </div>
                    <div className="text-stone-700 text-xs font-medium">{recurrenceLabel}</div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-3">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                      {locale === 'id' ? 'Lokasi Pelaksanaan' : 'Location'}
                    </div>
                    <div className="font-medium text-stone-900 flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div>{activity.location || 'Klenteng Tek Hay Bio, Semarang'}</div>
                        {Boolean(activity.locationAddress) && (
                          <div className="text-xs text-stone-500 mt-1 font-normal">
                            {activity.locationAddress as string}
                          </div>
                        )}
                        {Boolean(activity.locationRelationship) && (
                          <div className="text-xs text-stone-600 mt-1 italic font-normal bg-stone-50 p-2 rounded border border-stone-200">
                            {activity.locationRelationship as string}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {Boolean(activity.relatedDeity) && (
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                        {locale === 'id' ? 'Dewa / Tokoh Terkait' : 'Related Deity'}
                      </div>
                      <div className="font-medium text-amber-800 text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{activity.relatedDeity as string}</span>
                      </div>
                      {Boolean(activity.deityRole) && (
                        <div className="text-xs text-stone-500 mt-0.5">
                          {activity.deityRole as string}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Important Management Disclaimer */}
                <div className="border-t border-stone-100 pt-4 text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 leading-relaxed">
                  ⚠️{' '}
                  {locale === 'id'
                    ? 'Jadwal dan tata cara ritual dapat mengalami penyesuaian mengikuti keputusan musyawarah pengurus Klenteng Tek Hay Bio.'
                    : 'Schedule and ritual procedures are subject to adjustments following temple management deliberations.'}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  )
}
