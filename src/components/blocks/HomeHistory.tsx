/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Container, Section } from '../ui/Layout'
import { MediaImage } from '../ui/MediaImage'
import { Button } from '../ui/Button'
import type { CMSRecord } from '@/types'

export function ShortHistory({ history, locale }: { history: CMSRecord, locale: 'id' | 'en' }) {
  if (!history || !history.title) return null
  
  const timeline = history.timeline as CMSRecord[] | undefined

  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
              {locale === 'id' ? 'Jejak Waktu' : 'Footprints of Time'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {history.title as string}
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              {(history.shortDescription as string) || 'Jelajahi garis waktu yang membentuk identitas kami.'}
            </p>
            <div className="pt-4">
              <Button href={`/${locale}/sejarah`} variant="outline">
                {locale === 'id' ? 'Baca Sejarah Lengkap' : 'Read Full History'}
              </Button>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-stone-100">
            {/* If history timeline has images, use the first one, else empty state */}
            {timeline && timeline[0]?.image ? (
              <MediaImage media={timeline[0].image as CMSRecord} fill sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 p-8 text-center">
                <span className="font-serif italic text-xl">Arsip Visual</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function Uniqueness({ locale }: { locale: 'id' | 'en' }) {
  // Driven by editorial layout. Since uniqueness isn't a dedicated CMS collection, we create an empty/fallback structure that can be fleshed out later or populated by specific posts.
  return (
    <Section className="bg-stone-900 text-stone-50 border-y border-stone-800">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            {locale === 'id' ? 'Identitas & Nilai Luhur' : 'Identity & Noble Values'}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
          <p className="text-stone-400 text-lg">
            {locale === 'id' 
              ? 'Mengenal lebih dekat ciri khas arsitektur, filosofi, dan tradisi yang dilestarikan.'
              : 'Discovering the unique architecture, philosophy, and preserved traditions.'}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-4 text-center">
              <div className="aspect-[3/4] bg-stone-800 rounded-md overflow-hidden relative border border-stone-700">
                 <div className="absolute inset-0 flex items-center justify-center text-stone-600">
                   <span className="font-serif italic">Detail Arsitektur</span>
                 </div>
              </div>
              <h3 className="font-bold text-lg text-stone-200">
                {locale === 'id' ? 'Warisan Budaya' : 'Cultural Heritage'}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
