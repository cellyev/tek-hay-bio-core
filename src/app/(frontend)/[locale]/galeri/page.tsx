import React from 'react'
import { notFound } from 'next/navigation'
import { GalleryPage } from '../_shared/GalleryPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Galeri' : 'Gallery'),
    alternates: {
      canonical: `/${locale}/galeri`,
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
  const limit = typeof sp.limit === 'string' ? parseInt(sp.limit, 10) : 12

  return <GalleryPage locale={locale as 'id' | 'en'} page={page} limit={limit} />
}
