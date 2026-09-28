import React from 'react'
import { notFound } from 'next/navigation'
import { GalleryPage } from '../_shared/GalleryPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Galeri' : 'Gallery'),
    alternates: {
      canonical: `/${locale}/gallery`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <GalleryPage locale={locale as 'id' | 'en'} />
}
