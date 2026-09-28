import React from 'react'
import { notFound } from 'next/navigation'
import { ActivityDetailPage } from '../../_shared/ActivityDetailPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')}`,
    alternates: {
      canonical: `/${locale}/kegiatan/${slug}`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <ActivityDetailPage locale={locale as 'id' | 'en'} slug={slug} />
}
