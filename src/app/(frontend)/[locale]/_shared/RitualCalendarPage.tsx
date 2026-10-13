import React from 'react'
import Link from 'next/link'
import { getCollection } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { RitualCalendarView } from '@/components/calendar/RitualCalendarView'
import { Calendar, ArrowLeft } from 'lucide-react'

export async function RitualCalendarPage({
  locale,
  year,
}: {
  locale: 'id' | 'en'
  year?: number
}) {
  const { docs: activities } = await getCollection('activities', locale, {
    where: { status: { equals: 'published' } },
    limit: 150,
    depth: 1,
    sort: 'date',
  })

  const kegiatanUrl = `/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}`

  return (
    <>
      <PageHeader
        title={
          locale === 'id'
            ? 'Kalender Ritual dan Perayaan'
            : 'Ritual and Celebration Calendar'
        }
        description={
          locale === 'id'
            ? 'Panduan penanggalan ritual keagamaan, sembahyang leluhur, hari kebesaran dewa, dan perayaan budaya Klenteng Tek Hay Bio yang dihitung berdasarkan kalender Imlek dan kalender Masehi.'
            : 'Comprehensive calendar of religious rituals, ancestral worship, deity festivals, and cultural traditions at Tek Hay Bio Temple, mapped across lunar and solar cycles.'
        }
      />

      <Section className="bg-stone-50 min-h-screen">
        <Container>
          {/* Quick link navigation bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={kegiatanUrl}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {locale === 'id'
                  ? 'Kembali ke Daftar Semua Kegiatan'
                  : 'Back to All Activities List'}
              </span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {activities.length} {locale === 'id' ? 'agenda terdata' : 'recorded events'}
              </span>
            </div>
          </div>

          {/* Interactive Client Calendar View */}
          <RitualCalendarView
            activities={activities}
            locale={locale}
            initialYear={year}
          />
        </Container>
      </Section>
    </>
  )
}
