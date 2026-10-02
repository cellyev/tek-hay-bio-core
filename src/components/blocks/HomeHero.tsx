/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Button } from '../ui/Button'
import { MediaImage } from '../ui/MediaImage'
import { Container, Section } from '../ui/Layout'
import Link from 'next/link'
import type { CMSRecord } from '@/types'

const getRoute = (val: string, def: string, locale: string) => {
  const r = val || def
  if (r === 'home') return `/${locale}`
  return `/${locale}/${r}`
}

export function Hero({ homePage, siteSettings, locale }: { homePage?: CMSRecord, siteSettings: CMSRecord, locale: 'id' | 'en' }) {
  const hp = (homePage?.hero as any) || {}
  
  const title = hp.title || (siteSettings.siteName as string) || 'Klenteng Tek Hay Bio'
  const tagline = hp.tagline || (siteSettings.tagline as string) || (locale === 'id' ? 'Pusat Pelestarian Tradisi & Budaya' : 'Center for Tradition & Culture Preservation')
  const bgImage = hp.backgroundImage || siteSettings.defaultSocialImage || null
  
  const pBtnText = hp.primaryButtonText || (locale === 'id' ? 'Pelajari Sejarah' : 'Discover History')
  const pBtnLink = getRoute(hp.primaryButtonLink, 'sejarah', locale)
  const sBtnText = hp.secondaryButtonText || (locale === 'id' ? 'Rencanakan Kunjungan' : 'Plan a Visit')
  const sBtnLink = getRoute(hp.secondaryButtonLink, 'kontak', locale)

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        {bgImage && (
          <MediaImage 
            media={bgImage as CMSRecord} 
            alt="Tek Hay Bio Hero"
            fill
            priority
            className="object-cover"
          />
        )}
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
          <Button href={pBtnLink} variant="primary" className="w-full sm:w-auto">
            {pBtnText}
          </Button>
          <Button href={sBtnLink} variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white">
            {sBtnText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Introduction({ homePage, siteSettings, locale }: { homePage?: CMSRecord, siteSettings: CMSRecord, locale: 'id' | 'en' }) {
  const intro = (homePage?.introduction as any) || {}
  
  const title = intro.title || `${locale === 'id' ? 'Selamat Datang di ' : 'Welcome to '} ${(siteSettings.siteName as string) || 'Tek Hay Bio'}`
  const description = intro.description || (siteSettings.tagline as string) || 'Sebuah tempat yang merawat warisan budaya dan nilai-nilai luhur dari generasi ke generasi.'
  const linkText = intro.linkText || (locale === 'id' ? 'Tentang Kami' : 'About Us')
  const linkUrl = getRoute(intro.linkUrl, 'tentang-kami', locale)

  return (
    <Section className="bg-stone-50 border-b border-border">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
          <p className="text-lg text-stone-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <div className="pt-4">
            <Link href={linkUrl} className="inline-flex items-center text-primary font-medium hover:underline">
              {linkText} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
