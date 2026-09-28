import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tekhaybio.com'
  
  const routes = [
    '',
    '/about', '/tentang-kami',
    '/history', '/sejarah',
    '/services', '/layanan',
    '/activities', '/kegiatan',
    '/news', '/berita',
    '/gallery', '/galeri',
    '/contact', '/kontak',
  ]

  return routes.flatMap((route) => {
    // Determine locale from route if possible, or just generate for both /id and /en
    // Since we mapped localized slugs directly, we can just prepend locale
    if (route === '') {
      return [
        { url: `${baseUrl}/id`, lastModified: new Date() },
        { url: `${baseUrl}/en`, lastModified: new Date() }
      ]
    }
    
    // We already split route names above by their locales.
    const isIndonesian = ['tentang-kami', 'sejarah', 'layanan', 'kegiatan', 'berita', 'galeri', 'kontak'].some(r => route.includes(r))
    const locale = isIndonesian ? 'id' : 'en'

    return {
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
    }
  })
}
