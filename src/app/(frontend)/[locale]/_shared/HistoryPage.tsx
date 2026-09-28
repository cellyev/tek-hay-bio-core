import React from 'react'
import { getGlobal } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import { notFound } from 'next/navigation'
import type { CMSRecord } from '@/types'

export async function HistoryPage({ locale }: { locale: 'id' | 'en' }) {
  const history = await getGlobal('history', locale)
  
  if (!history) {
    notFound()
  }

  const timeline = Array.isArray(history.timeline) ? history.timeline : []

  return (
    <>
      <PageHeader 
        title={locale === 'id' ? 'Garis Waktu Sejarah' : 'Historical Timeline'}
        description={locale === 'id' ? 'Perjalanan sejarah Klenteng Tek Hay Bio dari masa ke masa.' : 'The historical journey of Tek Hay Bio Temple.'}
      />
      <Section className="bg-stone-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
            {timeline.length === 0 ? (
              <p className="text-center text-stone-500 italic">
                {locale === 'id' ? 'Belum ada data sejarah.' : 'No historical data available yet.'}
              </p>
            ) : (
              timeline.map((event: Record<string, unknown>, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-stone-50 bg-stone-300 group-hover:bg-primary group-hover:border-primary/20 text-stone-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors duration-300">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-primary font-serif">{event.year as string}</span>
                      {event.verificationStatus === 'under_research' && (
                         <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                           {locale === 'id' ? 'Dalam Penelitian' : 'Under Research'}
                         </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">{event.title as string}</h3>
                    <p className="text-stone-600 mb-4 text-sm leading-relaxed">{event.description as string}</p>
                    
                    {Boolean(event.image) && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-100 mt-4">
                        <MediaImage media={event.image as CMSRecord} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
