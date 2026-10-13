import React from 'react'
import { notFound } from 'next/navigation'
import { RitualCalendarPage } from '../_shared/RitualCalendarPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title:
      locale === 'id'
        ? 'Kalender Ritual dan Perayaan | Klenteng Tek Hay Bio'
        : 'Ritual and Celebration Calendar | Tek Hay Bio Temple',
    description:
      locale === 'id'
        ? 'Jadwal ritual keagamaan, sembahyang leluhur, hari kebesaran dewa, dan perayaan budaya di Klenteng Tek Hay Bio sepanjang tahun.'
        : 'Comprehensive schedule of religious rituals, ancestral worship, deity festivals, and cultural celebrations at Tek Hay Bio Temple.',
    alternates: {
      canonical: `/${locale}/ritual-calendar`,
    },
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const sp = await searchParams

  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  const year = typeof sp.year === 'string' ? parseInt(sp.year, 10) : undefined

  return <RitualCalendarPage locale={locale as 'id' | 'en'} year={year} />
}
