import React from 'react'
import { getBySlug } from './queries'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import type { CMSRecord } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function ActivityDetailPage({ locale, slug }: { locale: 'id' | 'en', slug: string }) {
  const activity = await getBySlug('activities', slug, locale)
  
  if (!activity) {
    notFound()
  }

  const dateObj = new Date(activity.date as string)

  return (
    <article>
      <div className="w-full h-[40vh] md:h-[60vh] relative bg-stone-900 flex items-end">
        <MediaImage media={activity.featuredImage as CMSRecord} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
        <Container className="relative z-10 pb-12 w-full">
          <Link href={`/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}`} className="text-stone-300 hover:text-white mb-6 inline-block text-sm">
            ← {locale === 'id' ? 'Kembali ke Jadwal' : 'Back to Schedule'}
          </Link>
          <div className="max-w-3xl space-y-4 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider">
                {activity.type === 'ritual' ? 'Ritual' : activity.type === 'cultural' ? 'Cultural' : 'Other'}
              </span>
              <span className="text-stone-300 text-sm">
                {dateObj.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
              {activity.title as string}
            </h1>
            {Boolean(activity.location) && (
              <p className="text-lg text-stone-300 flex items-center gap-2">
                📍 {activity.location as string}
              </p>
            )}
          </div>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-serif italic">
              {activity.shortDescription as string}
            </p>
            
            <div className="w-16 h-1 bg-stone-200" />
            
            <RichText content={activity.description} />
          </div>
        </Container>
      </Section>
    </article>
  )
}
