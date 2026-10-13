import React from 'react'
import { notFound } from 'next/navigation'
import { NewsListPage } from '../_shared/NewsListPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Berita' : 'News'),
    alternates: {
      canonical: `/${locale}/news`,
    }
  }
}

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { locale } = await params
  const sp = await searchParams
  
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  const page = typeof sp.page === 'string' ? parseInt(sp.page, 10) : 1
  const limit = typeof sp.limit === 'string' ? parseInt(sp.limit, 10) : 9

  return <NewsListPage locale={locale as 'id' | 'en'} page={page} limit={limit} />
}
