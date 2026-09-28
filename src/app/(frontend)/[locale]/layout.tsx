import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale as 'id' | 'en'
  
  // Need to bypass during build if MongoDB isn't running. We'll use a try/catch.
  let siteName = 'Klenteng Tek Hay Bio'
  let description = 'Pusat informasi digital, sejarah, dan kegiatan pelestarian tradisi leluhur.'

  try {
    const payload = await getPayload({ config: configPromise })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale,
    })
    if (siteSettings.siteName) siteName = siteSettings.siteName
    if (siteSettings.tagline) description = siteSettings.tagline
  } catch {
    // Database likely not available during build
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tekhaybio.com'

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      languages: {
        'id-ID': `/id`,
        'en-US': `/en`,
      },
    },
    openGraph: {
      siteName,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  
  if (resolvedParams.locale !== 'id' && resolvedParams.locale !== 'en') {
    notFound()
  }

  const locale = resolvedParams.locale as 'id' | 'en'

  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  )
}
