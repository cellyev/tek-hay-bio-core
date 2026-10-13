/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getBySlug } from './queries'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import type { CMSRecord } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAlbumCategoryLabel,
  formatEventDateRange,
  countAlbumMedia,
} from '@/lib/gallery/utils'
import { AlbumMediaGallery } from '@/components/gallery/AlbumMediaGallery'
import { Calendar, Layers, Image as ImageIcon, Video } from 'lucide-react'

export async function AlbumDetailPage({ locale, slug }: { locale: 'id' | 'en'; slug: string }) {
  const album = (await getBySlug('albums', slug, locale)) as any

  if (!album || album.status !== 'published') {
    notFound()
  }

  const categoryLabel = getAlbumCategoryLabel(album.category, locale)
  const dateFormatted = formatEventDateRange(album.eventDate, album.eventEndDate, locale)
  const { photosCount, videosCount, total } = countAlbumMedia(album.mediaItems)
  const backUrl = `/${locale}/${locale === 'id' ? 'galeri' : 'gallery'}`

  return (
    <article className="bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <div className="w-full min-h-[40vh] md:min-h-[50vh] relative bg-stone-900 flex items-end">
        {album.coverImage && (
          <MediaImage
            media={album.coverImage as CMSRecord}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

        <Container className="relative z-10 py-12 w-full">
          <Link
            href={backUrl}
            className="text-stone-300 hover:text-white mb-6 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors"
          >
            ← {locale === 'id' ? 'Kembali ke Daftar Album' : 'Back to Album Gallery'}
          </Link>

          <div className="max-w-4xl space-y-4 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-primary text-white font-bold rounded uppercase tracking-wider">
                {categoryLabel}
              </span>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-stone-200 font-medium rounded border border-white/20">
                {total} {locale === 'id' ? 'Dokumentasi' : 'Items'} ({photosCount} Foto • {videosCount} Video)
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
              {album.title as string}
            </h1>

            {dateFormatted && (
              <div className="flex items-center gap-2 text-sm text-amber-300 font-medium pt-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{dateFormatted}</span>
              </div>
            )}

            {Boolean(album.description) && (
              <p className="text-base md:text-lg text-stone-300 max-w-3xl leading-relaxed pt-2">
                {album.description as string}
              </p>
            )}
          </div>
        </Container>
      </div>

      {/* Main Content Gallery */}
      <Section className="py-12 md:py-16">
        <Container>
          <AlbumMediaGallery
            mediaItems={album.mediaItems || []}
            locale={locale}
            albumTitle={album.title as string}
          />
        </Container>
      </Section>
    </article>
  )
}
