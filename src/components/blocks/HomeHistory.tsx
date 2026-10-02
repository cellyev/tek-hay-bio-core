/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Container, Section } from '../ui/Layout'
import { MediaImage } from '../ui/MediaImage'
import { Button } from '../ui/Button'
import type { CMSRecord } from '@/types'

export function ShortHistory({ homePage, history, locale }: { homePage?: CMSRecord, history: CMSRecord, locale: 'id' | 'en' }) {
  const hp = (homePage?.historySection as any) || {}
  
  const heading = hp.heading || (locale === 'id' ? 'Jejak Waktu' : 'Footprints of Time')
  const title = hp.title || (history?.title as string) || ''
  const description = hp.description || (history?.shortDescription as string) || 'Jelajahi garis waktu yang membentuk identitas kami.'
  const buttonText = locale === 'id' ? 'Baca Sejarah Lengkap' : 'Read Full History'
  const buttonLink = `/${locale}/sejarah`
  
  const timeline = history?.timeline as CMSRecord[] | undefined
  const displayImage = hp.image || (timeline && timeline[0]?.image) || null

  if (!title && !history?.title) return null

  return (
    <Section className="bg-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
              {heading}
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {title}
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
            <div className="pt-4">
              <Button href={buttonLink} variant="outline">
                {buttonText}
              </Button>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-stone-100">
            {displayImage ? (
              <MediaImage media={displayImage as CMSRecord} fill sizes="(max-width: 768px) 100vw, 50vw" />
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

export function Uniqueness({ homePage, locale }: { homePage?: CMSRecord, locale: 'id' | 'en' }) {
  const hp = (homePage?.uniquenessSection as any) || {}
  
  const title = hp.title || (locale === 'id' ? 'Identitas & Nilai Luhur' : 'Identity & Noble Values')
  const description = hp.description || (locale === 'id' 
              ? 'Mengenal lebih dekat ciri khas arsitektur, filosofi, dan tradisi yang dilestarikan.'
              : 'Discovering the unique architecture, philosophy, and preserved traditions.')
  
  const defaultFeatures = [
    { title: locale === 'id' ? 'Warisan Budaya' : 'Cultural Heritage', image: null },
    { title: locale === 'id' ? 'Filosofi Arsitektur' : 'Architectural Philosophy', image: null },
    { title: locale === 'id' ? 'Tradisi Leluhur' : 'Ancestral Traditions', image: null }
  ]
  const features = (hp.features && hp.features.length > 0) ? hp.features : defaultFeatures

  return (
    <Section className="bg-stone-900 text-stone-50 border-y border-stone-800">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
          <p className="text-stone-400 text-lg whitespace-pre-line">
            {description}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item: any, i: number) => (
            <div key={i} className="space-y-4 text-center">
              <div className="aspect-[3/4] bg-stone-800 rounded-md overflow-hidden relative border border-stone-700">
                 {item.image ? (
                   <MediaImage media={item.image as CMSRecord} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-stone-600">
                     <span className="font-serif italic">Detail Arsitektur</span>
                   </div>
                 )}
              </div>
              <h3 className="font-bold text-lg text-stone-200">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
