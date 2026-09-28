import React from 'react'
import { notFound } from 'next/navigation'
import { ContactPage } from '../_shared/ContactPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Kontak' : 'Contact'),
    alternates: {
      canonical: `/${locale}/kontak`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <ContactPage locale={locale as 'id' | 'en'} />
}
