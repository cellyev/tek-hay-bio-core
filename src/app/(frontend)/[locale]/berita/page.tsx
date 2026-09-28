import React from 'react'
import { notFound } from 'next/navigation'
import { NewsListPage } from '../_shared/NewsListPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Berita' : 'News'),
    alternates: {
      canonical: `/${locale}/berita`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <NewsListPage locale={locale as 'id' | 'en'} />
}
