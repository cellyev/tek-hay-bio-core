import React from 'react'
import { Container, Section } from '../ui/Layout'
import { MediaImage } from '../ui/MediaImage'
import { Button } from '../ui/Button'
import type { CMSRecord } from '@/types'
import Link from 'next/link'

export function GalleryPreview({ mediaList, locale }: { mediaList: CMSRecord[], locale: 'id' | 'en' }) {
  if (!mediaList || mediaList.length === 0) return null

  return (
    <Section className="bg-stone-900 text-stone-50 border-y border-stone-800">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              {locale === 'id' ? 'Galeri Visual' : 'Visual Gallery'}
            </h2>
            <div className="w-16 h-1 bg-primary" />
          </div>
          <Link href={`/${locale}/galeri`} className="text-stone-300 font-medium hover:text-white hover:underline hidden sm:block">
            {locale === 'id' ? 'Lihat Semua Galeri' : 'View Full Gallery'} →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {mediaList.map((media, idx) => (
            <div 
              key={media.id as string} 
              className={`relative bg-stone-800 rounded-lg overflow-hidden border border-stone-700 group ${idx === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
            >
              <MediaImage 
                media={media} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw" 
                className="transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                <span className="text-white font-medium drop-shadow-md line-clamp-2">
                  {(media.title as string) || (media.alt as string) || 'Tek Hay Bio'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function LocationCTA({ contactInfo, locale }: { contactInfo: CMSRecord, locale: 'id' | 'en' }) {
  if (!contactInfo || !contactInfo.address) return null

  return (
    <Section className="bg-stone-50">
      <Container>
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                  {locale === 'id' ? 'Rencanakan Kunjungan' : 'Plan Your Visit'}
                </h2>
                <div className="w-16 h-1 bg-primary" />
                <p className="text-lg text-stone-600 leading-relaxed">
                  {locale === 'id' 
                    ? 'Klenteng Tek Hay Bio terbuka untuk umat, peziarah, dan pengunjung yang ingin mengenal lebih dekat sejarah dan budaya.'
                    : 'Tek Hay Bio Temple is open to devotees, pilgrims, and visitors who want to learn more about our history and culture.'}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                    {locale === 'id' ? 'Alamat' : 'Address'}
                  </h3>
                  <p className="text-stone-600 whitespace-pre-line">{contactInfo.address as string}</p>
                </div>

                {Boolean(contactInfo.visitingHours) && (
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                      {locale === 'id' ? 'Jam Operasional' : 'Visiting Hours'}
                    </h3>
                    <p className="text-stone-600 whitespace-pre-line">{contactInfo.visitingHours as string}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                {Boolean(contactInfo.googleMapsUrl) && (
                  <Button href={contactInfo.googleMapsUrl as string} variant="primary">
                    {locale === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
                  </Button>
                )}
                <Button href={`/${locale}/kontak`} variant="outline">
                  {locale === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                </Button>
              </div>
            </div>
            
            {/* Map Placeholder or Actual Map Image */}
            <div className="bg-stone-200 relative min-h-[300px] lg:min-h-full">
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-stone-500 bg-[url('/file.svg')] bg-center bg-no-repeat bg-[length:100px_100px] opacity-20">
                <span className="sr-only">Map Graphic</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-serif italic text-lg text-stone-600">Peta Lokasi Interaktif</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
