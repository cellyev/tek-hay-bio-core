/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function Footer({ locale }: { locale: 'id' | 'en' }) {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch global settings
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
  })
  
  const contactInfo = await payload.findGlobal({
    slug: 'contact-information',
    locale,
  })

  const year = new Date().getFullYear()

  // Navigation Links
  const navLinks = [
    { href: locale === 'id' ? '/id/tentang-kami' : '/en/about', label: locale === 'id' ? 'Tentang Kami' : 'About Us' },
    { href: locale === 'id' ? '/id/sejarah' : '/en/history', label: locale === 'id' ? 'Sejarah' : 'History' },
    { href: locale === 'id' ? '/id/layanan' : '/en/services', label: locale === 'id' ? 'Layanan' : 'Services' },
    { href: locale === 'id' ? '/id/kegiatan' : '/en/activities', label: locale === 'id' ? 'Kegiatan' : 'Activities' },
    { href: locale === 'id' ? '/id/berita' : '/en/news', label: locale === 'id' ? 'Berita' : 'News' },
    { href: locale === 'id' ? '/id/galeri' : '/en/gallery', label: locale === 'id' ? 'Galeri' : 'Gallery' },
  ]

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div className="md:col-span-2">
          <Link href={`/${locale}`} className="inline-block mb-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              {siteSettings.siteName || 'Klenteng Tek Hay Bio'}
            </span>
          </Link>
          <p className="max-w-md text-stone-400 text-sm leading-relaxed">
            {siteSettings.tagline || (locale === 'id' 
              ? 'Pusat informasi digital, sejarah, dan kegiatan pelestarian tradisi leluhur.'
              : 'Digital information center, history, and activities preserving ancestral traditions.')}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
            {locale === 'id' ? 'Tautan' : 'Links'}
          </h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
            {locale === 'id' ? 'Kontak' : 'Contact'}
          </h3>
          <address className="not-italic text-sm space-y-2 text-stone-400">
            {contactInfo.address && <p>{contactInfo.address}</p>}
            {contactInfo.phone && <p>Tel: {contactInfo.phone}</p>}
            {contactInfo.email && <p>Email: {contactInfo.email}</p>}
          </address>
          
          {contactInfo.socialMedia && contactInfo.socialMedia.length > 0 && (
            <div className="mt-4 flex gap-4">
              {contactInfo.socialMedia.map((social: { platform?: string | null, url?: string | null, label?: string | null }, idx: number) => (
                <a 
                  key={idx} 
                  href={social.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-sm"
                >
                  {social.label || social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-stone-800 text-sm text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {year} {siteSettings.siteName || 'Tek Hay Bio'}. All rights reserved.</p>
        <p>{locale === 'id' ? 'Dikelola oleh pengurus klenteng.' : 'Managed by the temple board.'}</p>
      </div>
    </footer>
  )
}
