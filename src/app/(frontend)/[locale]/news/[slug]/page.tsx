import React from 'react'
import { notFound } from 'next/navigation'
import { NewsDetailPage } from '../../_shared/NewsDetailPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')}`,
    alternates: {
      canonical: `/${locale}/news/${slug}`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <NewsDetailPage locale={locale as 'id' | 'en'} slug={slug} />
}
