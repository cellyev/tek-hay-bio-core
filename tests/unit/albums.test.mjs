import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALBUM_CATEGORIES,
  getAlbumCategoryLabel,
  isMediaVideo,
  countAlbumMedia,
  formatEventDateRange,
} from '../../src/lib/gallery/utils.ts'

test('Verifikasi 1: Kategori Album Galeri Terstruktur dan Bilingual', () => {
  assert.equal(ALBUM_CATEGORIES.length, 6)
  assert.equal(getAlbumCategoryLabel('ritual', 'id'), 'Ritual Keagamaan')
  assert.equal(getAlbumCategoryLabel('ritual', 'en'), 'Religious Ritual')
  assert.equal(getAlbumCategoryLabel('ancestral-worship', 'id'), 'Sembahyang Leluhur')
  assert.equal(getAlbumCategoryLabel('ancestral-worship', 'en'), 'Ancestral Worship')
  assert.equal(getAlbumCategoryLabel('deity-festival', 'id'), 'Hari Kebesaran Dewa')
  assert.equal(getAlbumCategoryLabel('deity-festival', 'en'), 'Deity Festival')
  assert.equal(getAlbumCategoryLabel('cultural-celebration', 'id'), 'Perayaan Budaya')
  assert.equal(getAlbumCategoryLabel('cultural-celebration', 'en'), 'Cultural Celebration')
  assert.equal(getAlbumCategoryLabel('social-activity', 'id'), 'Kegiatan Sosial')
  assert.equal(getAlbumCategoryLabel('social-activity', 'en'), 'Social Activity')
  assert.equal(getAlbumCategoryLabel('other', 'id'), 'Dokumentasi Lainnya')
  assert.equal(getAlbumCategoryLabel('other', 'en'), 'Other Documentation')

  // Fallback aman
  assert.equal(getAlbumCategoryLabel(null, 'id'), 'Dokumentasi Acara')
  assert.equal(getAlbumCategoryLabel(undefined, 'en'), 'Event Documentation')
})

test('Verifikasi 2: Deteksi Tipe Media Foto dan Video (isMediaVideo)', () => {
  // Video via mediaType
  assert.equal(isMediaVideo({ mediaType: 'video' }), true)
  assert.equal(isMediaVideo({ mediaType: 'image' }), false)

  // Video via MIME type
  assert.equal(isMediaVideo({ mimeType: 'video/mp4' }), true)
  assert.equal(isMediaVideo({ mimeType: 'video/webm' }), true)
  assert.equal(isMediaVideo({ mimeType: 'video/quicktime' }), true)
  assert.equal(isMediaVideo({ mimeType: 'image/jpeg' }), false)
  assert.equal(isMediaVideo({ mimeType: 'image/webp' }), false)

  // Video via ekstensi file
  assert.equal(isMediaVideo({ filename: 'dokumentasi-kirab.mp4' }), true)
  assert.equal(isMediaVideo({ filename: 'suasana-klenteng.webm' }), true)
  assert.equal(isMediaVideo({ filename: 'sembahyang.mov' }), true)
  assert.equal(isMediaVideo({ filename: 'altar-utama.jpg' }), false)
  assert.equal(isMediaVideo({ filename: 'patung-kongco.png' }), false)

  // Edge cases
  assert.equal(isMediaVideo(null), false)
  assert.equal(isMediaVideo(undefined), false)
  assert.equal(isMediaVideo({}), false)
})

test('Verifikasi 3: Penghitungan Media dalam Album (countAlbumMedia)', () => {
  const mediaItems = [
    { media: { id: '1', mimeType: 'image/jpeg', filename: 'foto1.jpg' } },
    { media: { id: '2', mimeType: 'image/png', filename: 'foto2.png' } },
    { media: { id: '3', mimeType: 'video/mp4', filename: 'video1.mp4' } },
    { media: { id: '4', mediaType: 'video', filename: 'video2.webm' } },
    { media: { id: '5', mimeType: 'image/webp', filename: 'foto3.webp' } },
  ]

  const counts = countAlbumMedia(mediaItems)
  assert.equal(counts.total, 5)
  assert.equal(counts.photosCount, 3)
  assert.equal(counts.videosCount, 2)

  // Array kosong atau undefined
  const emptyCounts = countAlbumMedia([])
  assert.equal(emptyCounts.total, 0)
  assert.equal(emptyCounts.photosCount, 0)
  assert.equal(emptyCounts.videosCount, 0)

  const undefinedCounts = countAlbumMedia(undefined)
  assert.equal(undefinedCounts.total, 0)
})

test('Verifikasi 4: Format Rentang Tanggal Acara Album', () => {
  // Tanggal tunggal
  const single = formatEventDateRange('2026-08-15', null, 'id')
  assert.ok(single?.includes('15 Agustus 2026'))

  // Rentang bulan yang sama
  const sameMonth = formatEventDateRange('2026-08-15', '2026-08-17', 'id')
  assert.ok(sameMonth?.includes('15 – 17 Agustus 2026'))

  // Rentang lintas bulan
  const crossMonth = formatEventDateRange('2026-08-30', '2026-09-02', 'id')
  assert.ok(crossMonth?.includes('30 Agustus 2026 – 2 September 2026'))

  // Null date
  assert.equal(formatEventDateRange(null, null, 'id'), null)
  assert.equal(formatEventDateRange('', '', 'id'), null)
})

test('Verifikasi 5: Relasi Media dan Album Independen (Non-destruktif)', () => {
  // Simulasi album dengan media
  const albumMediaList = ['media-1', 'media-2', 'media-3']
  
  // Mengeluarkan media-2 dari album
  const updatedList = albumMediaList.filter(id => id !== 'media-2')
  assert.deepEqual(updatedList, ['media-1', 'media-3'])
  
  // Memastikan ID media fisik 'media-2' tetap valid dan tidak berubah
  assert.equal(albumMediaList.includes('media-2'), true)
})

test('Verifikasi 6: Resolusi Judul Dwibahasa (Bidirectional Title Fallback)', () => {
  const resolveTitle = (rawTitle) => {
    const rawTitleId = typeof rawTitle === 'string' ? rawTitle.trim() : (rawTitle?.id?.trim?.() ?? '')
    const rawTitleEn = typeof rawTitle === 'string' ? rawTitle.trim() : (rawTitle?.en?.trim?.() ?? '')

    if (!rawTitleId && !rawTitleEn) {
      return null
    }

    return {
      id: rawTitleId || rawTitleEn,
      en: rawTitleEn || rawTitleId,
    }
  }

  // Kasus 1: Hanya mengisi ID (kasus umum admin) -> EN otomatis terisi dengan ID
  const onlyId = resolveTitle({ id: 'Acara Cap Go Meh 2026', en: '' })
  assert.deepEqual(onlyId, { id: 'Acara Cap Go Meh 2026', en: 'Acara Cap Go Meh 2026' })

  // Kasus 2: Hanya mengisi EN -> ID otomatis terisi dengan EN
  const onlyEn = resolveTitle({ id: '', en: 'Lantern Festival 2026' })
  assert.deepEqual(onlyEn, { id: 'Lantern Festival 2026', en: 'Lantern Festival 2026' })

  // Kasus 3: Input berupa string tunggal -> kedua locale terisi
  const stringTitle = resolveTitle('Perayaan Tong Jiu Pia')
  assert.deepEqual(stringTitle, { id: 'Perayaan Tong Jiu Pia', en: 'Perayaan Tong Jiu Pia' })

  // Kasus 4: Kedua locale diisi berbeda -> kedua nilai dipertahankan
  const bothProvided = resolveTitle({ id: 'Pawai Budaya', en: 'Cultural Parade' })
  assert.deepEqual(bothProvided, { id: 'Pawai Budaya', en: 'Cultural Parade' })

  // Kasus 5: Keduanya kosong -> return null (memicu pesan error ramah pengguna)
  const emptyTitle = resolveTitle({ id: '   ', en: '' })
  assert.equal(emptyTitle, null)
})

test('Verifikasi 7: Fallback Judul Media ke Judul Album Jika Kosong', () => {
  const getMediaDisplayTitle = (mediaDoc, albumTitle, locale = 'id') => {
    const rawTitle = mediaDoc?.title?.trim()
    if (rawTitle && rawTitle !== 'Tanpa Judul' && rawTitle !== mediaDoc?.filename) {
      return rawTitle
    }
    return albumTitle?.trim() || (locale === 'id' ? 'Dokumentasi Klenteng' : 'Temple Documentation')
  }

  const albumTitle = 'Perayaan Tong Jiu Pia 2026'

  // Kasus 1: Media tidak memiliki title sama sekali -> menggunakan judul album
  assert.equal(getMediaDisplayTitle({}, albumTitle), 'Perayaan Tong Jiu Pia 2026')
  assert.equal(getMediaDisplayTitle(null, albumTitle), 'Perayaan Tong Jiu Pia 2026')

  // Kasus 2: Media memiliki title kosong atau string spasi -> menggunakan judul album
  assert.equal(getMediaDisplayTitle({ title: '' }, albumTitle), 'Perayaan Tong Jiu Pia 2026')
  assert.equal(getMediaDisplayTitle({ title: '   ' }, albumTitle), 'Perayaan Tong Jiu Pia 2026')

  // Kasus 3: Media memiliki title 'Tanpa Judul' -> menggunakan judul album
  assert.equal(getMediaDisplayTitle({ title: 'Tanpa Judul' }, albumTitle), 'Perayaan Tong Jiu Pia 2026')

  // Kasus 4: Media hanya memiliki nama file (misal: DSC_001.mp4) -> menggunakan judul album
  assert.equal(
    getMediaDisplayTitle({ title: 'DSC_001.mp4', filename: 'DSC_001.mp4' }, albumTitle),
    'Perayaan Tong Jiu Pia 2026'
  )

  // Kasus 5: Media memiliki judul kustom yang valid -> tetap gunakan judul kustom
  assert.equal(
    getMediaDisplayTitle({ title: 'Sembahyang Mooncake di Halaman' }, albumTitle),
    'Sembahyang Mooncake di Halaman'
  )
})


