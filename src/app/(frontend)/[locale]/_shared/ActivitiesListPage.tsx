import React from 'react'
import { getCollection } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import type { CMSRecord } from '@/types'
import Link from 'next/link'

export async function ActivitiesListPage({ locale }: { locale: 'id' | 'en' }) {
  const activities = await getCollection('activities', locale, { 
    where: { status: { equals: 'published' } },
    sort: '-date'
  })

  return (
    <>
      <PageHeader 
        title={locale === 'id' ? 'Jadwal Kegiatan' : 'Activities Schedule'}
        description={locale === 'id' ? 'Agenda ritual, perayaan, dan kegiatan budaya.' : 'Schedule for rituals, celebrations, and cultural events.'}
      />
      <Section className="bg-stone-50">
        <Container>
          {activities.length === 0 ? (
             <div className="py-12 text-center text-stone-500 italic bg-white rounded-lg border border-stone-100 shadow-sm">
               {locale === 'id' ? 'Belum ada agenda kegiatan.' : 'No upcoming activities.'}
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <Link href={`/${locale}/${locale === 'id' ? 'kegiatan' : 'activities'}/${activity.slug}`} key={activity.id as string} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col border border-stone-200">
                  <div className="aspect-[4/3] relative bg-stone-100 overflow-hidden">
                    <MediaImage media={activity.featuredImage as CMSRecord} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-sm">
                       <span className="block text-2xl font-bold text-primary leading-none">
                         {new Date(activity.date as string).getDate()}
                       </span>
                       <span className="block text-xs font-bold text-stone-600 uppercase mt-1">
                         {new Date(activity.date as string).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'short' })}
                       </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded uppercase tracking-wider">
                         {activity.type === 'ritual' ? 'Ritual' : activity.type === 'cultural' ? 'Cultural' : 'Other'}
                       </span>
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {activity.title as string}
                    </h2>
                    {Boolean(activity.location) && (
                      <div className="text-sm text-stone-500 mb-3 flex items-center gap-1">
                        📍 {activity.location as string}
                      </div>
                    )}
                    <p className="text-stone-600 line-clamp-2 flex-1 text-sm">{activity.shortDescription as string}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
