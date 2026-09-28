import React from 'react'
import { notFound } from 'next/navigation'
import { HistoryPage } from '../_shared/HistoryPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Sejarah' : 'History'),
    alternates: {
      canonical: `/${locale}/sejarah`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <HistoryPage locale={locale as 'id' | 'en'} />
}
