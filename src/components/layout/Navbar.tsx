/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'

export function Navbar({ locale }: { locale: 'id' | 'en' }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Map of routes
  const navLinks = [
    { id: '/id/tentang-kami', en: '/en/about', labelId: 'Tentang Kami', labelEn: 'About Us' },
    { id: '/id/sejarah', en: '/en/history', labelId: 'Sejarah', labelEn: 'History' },
    { id: '/id/layanan', en: '/en/services', labelId: 'Layanan', labelEn: 'Services' },
    { id: '/id/kegiatan', en: '/en/activities', labelId: 'Kegiatan', labelEn: 'Activities' },
    { id: '/id/berita', en: '/en/news', labelId: 'Berita', labelEn: 'News' },
    { id: '/id/galeri', en: '/en/gallery', labelId: 'Galeri', labelEn: 'Gallery' },
    { id: '/id/kontak', en: '/en/contact', labelId: 'Kontak', labelEn: 'Contact' },
  ]

  // Language Switcher Logic
  const getAlternatePath = () => {
    const targetLocale = locale === 'id' ? 'en' : 'id'
    
    // Find if the current path matches any known route
    const currentRoute = navLinks.find(link => link.id === pathname || link.en === pathname)
    
    if (currentRoute) {
      return targetLocale === 'id' ? currentRoute.id : currentRoute.en
    }
    
    // Fallback: Just replace the locale prefix if it's dynamic (e.g. news slug)
    // NOTE: This basic fallback won't map slugs, but we don't need dynamic slugs fully mapped for Phase 3.1
    if (pathname.startsWith('/id/')) return pathname.replace('/id/', '/en/')
    if (pathname.startsWith('/en/')) return pathname.replace('/en/', '/id/')
    
    return `/${targetLocale}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="font-serif text-xl font-bold tracking-tight text-primary">
            Tek Hay Bio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const href = locale === 'id' ? link.id : link.en
            const label = locale === 'id' ? link.labelId : link.labelEn
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            
            return (
              <Link 
                key={href} 
                href={href}
                className={`transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`}
              >
                {label}
              </Link>
            )
          })}
          
          <div className="h-4 w-px bg-border mx-2" />
          
          <Link 
            href={getAlternatePath()} 
            className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
            title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase text-xs font-bold">{locale === 'id' ? 'en' : 'id'}</span>
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 text-foreground/60 hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const href = locale === 'id' ? link.id : link.en
              const label = locale === 'id' ? link.labelId : link.labelEn
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              
              return (
                <Link 
                  key={href} 
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${isActive ? 'text-foreground' : 'text-foreground/60'}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="pt-4 border-t border-border">
            <Link 
              href={getAlternatePath()} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-medium"
            >
              <Globe className="h-5 w-5" />
              {locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
