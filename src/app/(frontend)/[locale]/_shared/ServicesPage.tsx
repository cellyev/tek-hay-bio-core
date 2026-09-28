import React from 'react'
import { getCollection } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import type { CMSRecord } from '@/types'

export async function ServicesPage({ locale }: { locale: 'id' | 'en' }) {
  const services = await getCollection('services', locale, { 
    where: { status: { equals: 'published' } },
    sort: 'sortOrder'
  })

  return (
    <>
      <PageHeader 
        title={locale === 'id' ? 'Layanan & Fasilitas' : 'Services & Facilities'}
        description={locale === 'id' ? 'Berbagai layanan keagamaan dan fasilitas yang tersedia untuk umat.' : 'Various religious services and facilities available for devotees.'}
      />
      <Section className="bg-white">
        <Container>
          {services.length === 0 ? (
             <div className="py-12 text-center text-stone-500 italic bg-stone-50 rounded-lg border border-stone-100">
               {locale === 'id' ? 'Belum ada data layanan.' : 'No services available yet.'}
             </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, idx) => (
                <div key={service.id as string} className={`flex flex-col md:flex-row gap-8 items-start ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-5/12 aspect-[4/3] relative rounded-xl overflow-hidden shadow-md bg-stone-100 shrink-0">
                    <MediaImage media={service.image as CMSRecord} fill className="object-cover" />
                  </div>
                  <div className="w-full md:w-7/12 space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">{service.title as string}</h2>
                      {service.availability === 'unavailable' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                          {locale === 'id' ? 'Tidak Tersedia' : 'Unavailable'}
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-stone-600 leading-relaxed font-medium">
                      {service.shortDescription as string}
                    </p>
                    <div className="prose prose-stone max-w-none">
                       <RichText content={service.description} className="text-sm text-stone-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
