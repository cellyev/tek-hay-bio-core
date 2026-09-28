import React from 'react'
import { notFound } from 'next/navigation'
import { ServicesPage } from '../_shared/ServicesPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Layanan' : 'Services'),
    alternates: {
      canonical: `/${locale}/layanan`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <ServicesPage locale={locale as 'id' | 'en'} />
}
