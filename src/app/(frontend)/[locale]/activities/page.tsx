import React from 'react'
import { notFound } from 'next/navigation'
import { ActivitiesListPage } from '../_shared/ActivitiesListPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Kegiatan' : 'Activities'),
    alternates: {
      canonical: `/${locale}/activities`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <ActivitiesListPage locale={locale as 'id' | 'en'} />
}
