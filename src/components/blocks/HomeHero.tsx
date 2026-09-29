/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Button } from '../ui/Button'
import { MediaImage } from '../ui/MediaImage'
import { Container, Section } from '../ui/Layout'
import Link from 'next/link'
import type { CMSRecord } from '@/types'

export function Hero({ siteSettings, locale }: { siteSettings: CMSRecord, locale: 'id' | 'en' }) {
  const title = (siteSettings.siteName as string) || 'Klenteng Tek Hay Bio'
  const tagline = (siteSettings.tagline as string) || (locale === 'id' ? 'Pusat Pelestarian Tradisi & Budaya' : 'Center for Tradition & Culture Preservation')
  
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <MediaImage 
          media={siteSettings.defaultSocialImage as CMSRecord} // Use fallback image or logo if hero not explicitly defined
          alt="Tek Hay Bio Hero"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="text-lg md:text-2xl text-stone-200 font-medium drop-shadow">
          {tagline}
        </p>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={`/${locale}/sejarah`} variant="primary" className="w-full sm:w-auto">
            {locale === 'id' ? 'Pelajari Sejarah' : 'Discover History'}
          </Button>
          <Button href={`/${locale}/kontak`} variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white">
            {locale === 'id' ? 'Rencanakan Kunjungan' : 'Plan a Visit'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Introduction({ siteSettings, locale }: { siteSettings: CMSRecord, locale: 'id' | 'en' }) {
  if (!siteSettings.siteName && !siteSettings.tagline) return null
  
  return (
    <Section className="bg-stone-50 border-b border-border">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            {locale === 'id' ? 'Selamat Datang di ' : 'Welcome to '} 
            {(siteSettings.siteName as string) || 'Tek Hay Bio'}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
          <p className="text-lg text-stone-600 leading-relaxed">
            {(siteSettings.tagline as string) || 'Sebuah tempat yang merawat warisan budaya dan nilai-nilai luhur dari generasi ke generasi.'}
          </p>
          <div className="pt-4">
            <Link href={`/${locale}/tentang-kami`} className="inline-flex items-center text-primary font-medium hover:underline">
              {locale === 'id' ? 'Tentang Kami' : 'About Us'} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
