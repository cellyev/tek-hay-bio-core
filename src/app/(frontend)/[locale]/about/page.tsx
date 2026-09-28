import React from 'react'
import { notFound } from 'next/navigation'
import { AboutPage } from '../_shared/AboutPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: (locale === 'id' ? 'Tentang Kami' : 'About Us'),
    alternates: {
      canonical: `/${locale}/about`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'id' && locale !== 'en') {
    notFound()
  }

  return <AboutPage locale={locale as 'id' | 'en'} />
}
