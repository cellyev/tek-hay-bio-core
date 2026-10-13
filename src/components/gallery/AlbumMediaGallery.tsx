/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { MediaImage } from '@/components/ui/MediaImage'
import { isMediaVideo } from '@/lib/gallery/utils'
import {
  Image as ImageIcon,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
} from 'lucide-react'

export function AlbumMediaGallery({
  mediaItems,
  locale,
  albumTitle,
}: {
  mediaItems: any[]
  locale: 'id' | 'en'
  albumTitle?: string
}) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | 'videos'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Filter items based on active tab
  const filteredItems = mediaItems.filter((item) => {
    const mediaDoc = item.media || item
    const isVid = isMediaVideo(mediaDoc)
    if (activeFilter === 'photos') return !isVid
    if (activeFilter === 'videos') return isVid
    return true
  })

  const photosCount = mediaItems.filter((item) => !isMediaVideo(item.media || item)).length
  const videosCount = mediaItems.length - photosCount

  // Helper to resolve title with Album Title as fallback
  const getDisplayTitle = useCallback(
    (mediaDoc: any) => {
      const rawTitle = mediaDoc?.title?.trim()
      if (rawTitle && rawTitle !== 'Tanpa Judul' && rawTitle !== mediaDoc?.filename) {
        return rawTitle
      }
      return albumTitle?.trim() || (locale === 'id' ? 'Dokumentasi Klenteng' : 'Temple Documentation')
    },
    [albumTitle, locale]
  )

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextItem = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length)
    }
  }, [lightboxIndex, filteredItems.length])

  const prevItem = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length)
    }
  }, [lightboxIndex, filteredItems.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextItem()
      if (e.key === 'ArrowLeft') prevItem()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, nextItem, prevItem])

  // Current item inside lightbox
  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null
  const currentMedia = currentItem?.media || currentItem
  const currentIsVideo = isMediaVideo(currentMedia)
  const currentTitle = currentMedia ? getDisplayTitle(currentMedia) : ''
  const currentCaption =
    (typeof currentItem?.caption === 'object' ? currentItem?.caption?.[locale] : currentItem?.caption) ||
    currentMedia?.caption?.[locale] ||
    currentMedia?.description ||
    ''

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all')
              setLightboxIndex(null)
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {locale === 'id' ? 'Semua Media' : 'All Media'} ({mediaItems.length})
          </button>
          {photosCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveFilter('photos')
                setLightboxIndex(null)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeFilter === 'photos'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {locale === 'id' ? 'Foto' : 'Photos'} ({photosCount})
            </button>
          )}
          {videosCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveFilter('videos')
                setLightboxIndex(null)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeFilter === 'videos'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-500" />
              {locale === 'id' ? 'Video' : 'Videos'} ({videosCount})
            </button>
          )}
        </div>

        <div className="text-xs text-stone-500">
          {locale === 'id' ? 'Menampilkan' : 'Showing'} {filteredItems.length}{' '}
          {locale === 'id' ? 'media dokumentasi' : 'media items'}
        </div>
      </div>

      {/* Grid of Media */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200 shadow-sm">
          {locale === 'id' ? 'Tidak ada media pada filter ini.' : 'No media items in this filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item, index) => {
            const mediaDoc = item.media || item
            const isVid = isMediaVideo(mediaDoc)
            const title = getDisplayTitle(mediaDoc)
            const caption =
              (typeof item.caption === 'object' ? item.caption?.[locale] : item.caption) ||
              mediaDoc.caption?.[locale] ||
              mediaDoc.description ||
              ''

            if (isVid) {
              return (
                <div
                  key={mediaDoc.id || index}
                  onClick={() => openLightbox(index)}
                  className="sm:col-span-2 bg-stone-900 rounded-2xl overflow-hidden shadow-md border border-stone-800 flex flex-col group cursor-pointer hover:shadow-2xl hover:border-stone-700 transition-all duration-300"
                >
                  {/* Video Preview Box with Overlay */}
                  <div className="aspect-video relative bg-stone-950 flex items-center justify-center overflow-hidden">
                    <video
                      src={mediaDoc.url}
                      preload="metadata"
                      playsInline
                      muted
                      poster={mediaDoc.videoThumbnail?.url || undefined}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* Centered Glowing Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/15 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-amber-500/90 group-hover:bg-amber-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                        <Play className="w-7 h-7 fill-white text-white ml-1" />
                      </div>
                    </div>

                    {/* Top Left Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-md border border-white/10">
                      <Video className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'id' ? 'Video Acara' : 'Event Video'}</span>
                    </div>

                    {/* Top Right Maximize Pill */}
                    <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 bg-stone-900 text-white flex-1 flex flex-col justify-between space-y-2 border-t border-stone-800/80">
                    <div>
                      <h3 className="font-semibold text-sm text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                        {title}
                      </h3>
                      {caption && (
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                          {caption}
                        </p>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
                      <span className="text-amber-400/90 font-medium flex items-center gap-1">
                        <span>{locale === 'id' ? 'Putar Layar Penuh' : 'Play Fullscreen'}</span>
                        <span>→</span>
                      </span>
                      {mediaDoc.duration && (
                        <span className="font-mono text-stone-500">
                          {Math.floor(mediaDoc.duration / 60)}:
                          {String(Math.floor(mediaDoc.duration % 60)).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            // Photos Card
            return (
              <div
                key={mediaDoc.id || index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square bg-stone-200 rounded-2xl overflow-hidden border border-stone-200 shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <MediaImage
                  media={mediaDoc}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs line-clamp-2 drop-shadow">
                      {caption || title}
                    </span>
                    <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white shrink-0">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal (Supports Both Photos AND Videos) */}
      {lightboxIndex !== null && currentMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-200 select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                {currentIsVideo ? (
                  <>
                    <Video className="w-3.5 h-3.5" />
                    {locale === 'id' ? 'Video' : 'Video'}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    {locale === 'id' ? 'Foto' : 'Photo'}
                  </>
                )}
              </span>
              <span className="text-xs tracking-wider text-stone-400 font-mono">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 text-stone-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={prevItem}
                className="absolute left-2 md:left-6 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 border border-white/10 transition-all hover:scale-110"
                title="Sebelumnya (Panah Kiri)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
              {currentIsVideo ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  controls
                  autoPlay
                  playsInline
                  poster={currentMedia.videoThumbnail?.url || undefined}
                  className="max-w-full max-h-[75vh] rounded-xl shadow-2xl bg-black"
                >
                  {locale === 'id'
                    ? 'Browser Anda tidak mendukung pemutaran video HTML5.'
                    : 'Your browser does not support HTML5 video playback.'}
                </video>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentMedia.url}
                  alt={currentMedia.alt || currentTitle}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-transform duration-300"
                />
              )}
            </div>

            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={nextItem}
                className="absolute right-2 md:right-6 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 border border-white/10 transition-all hover:scale-110"
                title="Berikutnya (Panah Kanan)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-2xl mx-auto text-center text-white pb-2 z-10 space-y-1">
            <h4 className="font-semibold text-sm md:text-base drop-shadow">{currentTitle}</h4>
            {Boolean(currentCaption) && (
              <p className="text-xs md:text-sm text-stone-300 italic drop-shadow">
                {currentCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
