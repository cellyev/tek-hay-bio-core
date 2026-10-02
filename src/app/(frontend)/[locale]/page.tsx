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
    homePage: {},
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

  const hp = data.homePage as CMSRecord

  return (
    <>
      <Hero homePage={hp} siteSettings={data.siteSettings as CMSRecord} locale={locale} />
      <Introduction homePage={hp} siteSettings={data.siteSettings as CMSRecord} locale={locale} />
      <ShortHistory homePage={hp} history={data.history as CMSRecord} locale={locale} />
      <Uniqueness homePage={hp} locale={locale} />
      <ServicesList homePage={hp} services={data.services as CMSRecord[]} locale={locale} />
      <ActivitiesList homePage={hp} activities={data.activities as CMSRecord[]} locale={locale} />
      <NewsList homePage={hp} posts={data.posts as CMSRecord[]} locale={locale} />
      <GalleryPreview homePage={hp} mediaList={data.media as CMSRecord[]} locale={locale} />
      <LocationCTA homePage={hp} contactInfo={data.contactInfo as CMSRecord} locale={locale} />
    </>
  )
}
