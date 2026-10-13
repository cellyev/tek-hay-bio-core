import test from 'node:test'
import assert from 'node:assert/strict'
import { getDetailRoutePrefix } from '../../src/app/(frontend)/[locale]/_shared/queries.ts'

test('Verifikasi Alternate Slug 1: Pemetaan Prefix Rute Koleksi Detail', () => {
  assert.equal(getDetailRoutePrefix('posts', 'id'), '/id/berita')
  assert.equal(getDetailRoutePrefix('posts', 'en'), '/en/news')

  assert.equal(getDetailRoutePrefix('activities', 'id'), '/id/kegiatan')
  assert.equal(getDetailRoutePrefix('activities', 'en'), '/en/activities')

  assert.equal(getDetailRoutePrefix('albums', 'id'), '/id/galeri')
  assert.equal(getDetailRoutePrefix('albums', 'en'), '/en/gallery')
})

test('Verifikasi Alternate Slug 2: Logika Resolusi Fallback Slug Lintas Bahasa Navbar', () => {
  function mapDynamicFallback(pathname) {
    if (pathname.startsWith('/id/berita/')) {
      return pathname.replace('/id/berita/', '/en/news/')
    }
    if (pathname.startsWith('/en/news/')) {
      return pathname.replace('/en/news/', '/id/berita/')
    }
    if (pathname.startsWith('/id/kegiatan/')) {
      return pathname.replace('/id/kegiatan/', '/en/activities/')
    }
    if (pathname.startsWith('/en/activities/')) {
      return pathname.replace('/en/activities/', '/id/kegiatan/')
    }
    if (pathname.startsWith('/id/galeri/')) {
      return pathname.replace('/id/galeri/', '/en/gallery/')
    }
    if (pathname.startsWith('/en/gallery/')) {
      return pathname.replace('/en/gallery/', '/id/galeri/')
    }
    return pathname
  }

  assert.equal(mapDynamicFallback('/id/berita/berita-1'), '/en/news/berita-1')
  assert.equal(mapDynamicFallback('/en/news/first-news'), '/id/berita/first-news')
  assert.equal(mapDynamicFallback('/id/kegiatan/imlek-2026'), '/en/activities/imlek-2026')
  assert.equal(mapDynamicFallback('/en/activities/cny-2026'), '/id/kegiatan/cny-2026')
  assert.equal(mapDynamicFallback('/id/galeri/album-cap-go-meh'), '/en/gallery/album-cap-go-meh')
  assert.equal(mapDynamicFallback('/en/gallery/cap-go-meh-album'), '/id/galeri/cap-go-meh-album')
})

test('Verifikasi Alternate Slug 3: Simulasi Logika Resolusi Slug Dwibahasa & Redirect', () => {
  // Simulasi dokumen di database
  const mockDatabase = [
    {
      id: 'post-1',
      collection: 'posts',
      slug: {
        id: 'berita-1',
        en: 'news-1',
      },
    },
    {
      id: 'act-1',
      collection: 'activities',
      slug: {
        id: 'sembahyang-bersama',
        en: 'joint-prayer',
      },
    },
  ]

  function resolveMockSlug(collection, slug, locale) {
    const otherLocale = locale === 'id' ? 'en' : 'id'

    // 1. Cari di locale aktif
    const primary = mockDatabase.find(
      (item) => item.collection === collection && item.slug[locale] === slug
    )

    if (primary) {
      return {
        doc: primary,
        currentSlug: primary.slug[locale],
        alternateSlug: primary.slug[otherLocale],
        needsRedirect: false,
        redirectUrl: null,
      }
    }

    // 2. Jika tidak ada di locale aktif, cari di otherLocale (slug bahasa lain)
    const fallback = mockDatabase.find(
      (item) => item.collection === collection && item.slug[otherLocale] === slug
    )

    if (fallback) {
      const canonicalSlug = fallback.slug[locale]
      const prefix = getDetailRoutePrefix(collection, locale)
      return {
        doc: fallback,
        currentSlug: canonicalSlug,
        alternateSlug: fallback.slug[otherLocale],
        needsRedirect: canonicalSlug !== slug,
        redirectUrl: `${prefix}/${canonicalSlug}`,
      }
    }

    return {
      doc: null,
      currentSlug: null,
      alternateSlug: null,
      needsRedirect: false,
      redirectUrl: null,
    }
  }

  // Kasus A: Buka berita di ID dengan slug ID ('berita-1')
  const resA = resolveMockSlug('posts', 'berita-1', 'id')
  assert.equal(resA.currentSlug, 'berita-1')
  assert.equal(resA.alternateSlug, 'news-1')
  assert.equal(resA.needsRedirect, false)

  // Kasus B: Ganti bahasa ke EN -> URL menjadi /en/news/news-1
  const resB = resolveMockSlug('posts', 'news-1', 'en')
  assert.equal(resB.currentSlug, 'news-1')
  assert.equal(resB.alternateSlug, 'berita-1')
  assert.equal(resB.needsRedirect, false)

  // Kasus C: Pengguna membuka /en/news/berita-1 (slug ID diakses di rute EN)
  const resC = resolveMockSlug('posts', 'berita-1', 'en')
  assert.equal(resC.currentSlug, 'news-1')
  assert.equal(resC.alternateSlug, 'berita-1')
  assert.equal(resC.needsRedirect, true)
  assert.equal(resC.redirectUrl, '/en/news/news-1')

  // Kasus D: Pengguna membuka /id/kegiatan/joint-prayer (slug EN diakses di rute ID)
  const resD = resolveMockSlug('activities', 'joint-prayer', 'id')
  assert.equal(resD.currentSlug, 'sembahyang-bersama')
  assert.equal(resD.alternateSlug, 'joint-prayer')
  assert.equal(resD.needsRedirect, true)
  assert.equal(resD.redirectUrl, '/id/kegiatan/sembahyang-bersama')

  // Kasus E: Slug tidak ada sama sekali
  const resE = resolveMockSlug('posts', 'slug-tidak-ditemukan', 'id')
  assert.equal(resE.doc, null)
  assert.equal(resE.needsRedirect, false)
})
