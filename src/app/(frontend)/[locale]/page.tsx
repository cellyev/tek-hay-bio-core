import React from 'react'
import { getHomepageData } from '@/modules/home/queries'
import { Hero, Introduction } from '@/components/blocks/HomeHero'
import { ShortHistory, Uniqueness } from '@/components/blocks/HomeHistory'
import { ServicesList, ActivitiesList, NewsList } from '@/components/blocks/HomeLists'
import { GalleryPreview, LocationCTA } from '@/components/blocks/HomeCTA'
import type { Metadata } from 'next'
import type { CMSRecord } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale as 'id' | 'en'

  return {
    alternates: {
      canonical: `/${locale}`,
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale as 'id' | 'en'
  
  // Note: if MongoDB is down during build, this query could fail. 
  // We use try/catch to gracefully render empty states instead of breaking the build.
  let data: Record<string, unknown> = {
    siteSettings: {},
    contactInfo: {},
    history: {},
    services: [],
    activities: [],
    posts: [],
    media: [],
  }

  try {
    data = await getHomepageData(locale)
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
  }

  return (
    <>
      <Hero siteSettings={data.siteSettings as CMSRecord} locale={locale} />
      <Introduction siteSettings={data.siteSettings as CMSRecord} locale={locale} />
      <ShortHistory history={data.history as CMSRecord} locale={locale} />
      <Uniqueness locale={locale} />
      <ServicesList services={data.services as CMSRecord[]} locale={locale} />
      <ActivitiesList activities={data.activities as CMSRecord[]} locale={locale} />
      <NewsList posts={data.posts as CMSRecord[]} locale={locale} />
      <GalleryPreview mediaList={data.media as CMSRecord[]} locale={locale} />
      <LocationCTA contactInfo={data.contactInfo as CMSRecord} locale={locale} />
    </>
  )
}
