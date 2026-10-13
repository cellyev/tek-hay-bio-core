import React from 'react'
import { notFound } from 'next/navigation'
import { ServicesPage } from '../_shared/ServicesPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Layanan' : 'Services'),
    alternates: {
      canonical: `/${locale}/services`,
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
  const limit = typeof sp.limit === 'string' ? parseInt(sp.limit, 10) : 10

  return <ServicesPage locale={locale as 'id' | 'en'} page={page} limit={limit} />
}
