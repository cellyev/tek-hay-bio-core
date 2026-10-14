import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function verifySeededActivities() {
  console.log('='.repeat(80))
  console.log('VERIFIKASI DATA KEGIATAN KLENTENG TEK HAY BIO DALAM DATABASE')
  console.log('='.repeat(80))

  const payload = await getPayload({ config: configPromise })

  const expectedSlugs = [
    'ritual-toa-pek-kong-naik',
    'sembahyang-leluhur-menjelang-imlek',
    'ritual-toa-pek-kong-turun',
    'ritual-kheng-thi-kong',
    'ritual-tolak-bala',
    'sembahyang-cap-go-meh',
    'hari-kebesaran-kongco-tek-hay-cin-jin',
    'sembahyang-ceng-beng',
    'sembahyang-leluhur-jit-gwee',
    'sembahyang-rebutan',
    'perayaan-tiong-jiu-hok-tek-ceng-sin',
  ]

  let allFound = true

  for (let i = 0; i < expectedSlugs.length; i++) {
    const slug = expectedSlugs[i]
    const res = await payload.find({
      collection: 'activities',
      where: {
        or: [
          { slug: { equals: slug } },
          { 'slug.id': { equals: slug } },
        ],
      },
      locale: 'all',
      limit: 1,
      overrideAccess: true,
    })

    if (res.docs.length === 0) {
      console.error(`❌ [${i + 1}] TIDAK DITEMUKAN: ${slug}`)
      allFound = false
      continue
    }

    const doc = res.docs[0] as any
    console.log(`\n[${i + 1}/11] ✅ Ditemukan: ${doc.title?.id} (ID: ${doc.id})`)
    console.log(`  - Title ID       : "${doc.title?.id}"`)
    console.log(`  - Title EN       : "${doc.title?.en}"`)
    console.log(`  - Slug ID        : "${doc.slug?.id}"`)
    console.log(`  - Slug EN        : "${doc.slug?.en}"`)
    console.log(`  - Kategori       : ${doc.category}`)
    console.log(`  - Pola Pengulangan: ${doc.recurrenceType}`)
    console.log(`  - Status Jadwal  : ${doc.scheduleStatus}`)
    console.log(`  - Status Publikasi: ${doc.status}`)
    console.log(`  - Pola Lunar     : ${doc.lunarRuleType}`)
    console.log(`  - Tanggal Lunar  : Day ${doc.lunarDay ?? '-'} / Month ${doc.lunarMonth ?? '-'}`)
    console.log(`  - Kabisat Lunar  : ${doc.isLeapMonth ? 'Ya' : 'Tidak'}`)
    console.log(`  - Periode Khusus : ID: "${doc.lunarPeriodDescription?.id || '-'}" | EN: "${doc.lunarPeriodDescription?.en || '-'}"`)
    console.log(`  - Tanggal Masehi : Mulai: ${doc.date ?? 'null'} | Selesai: ${doc.endDate ?? 'null'}`)
    console.log(`  - Keterangan Jdwl: ID: "${doc.scheduleNote?.id || '-'}"`)
    console.log(`  - Lokasi         : ID: "${doc.location?.id}" | EN: "${doc.location?.en}"`)
    console.log(`  - Alamat Lokasi  : ID: "${doc.locationAddress?.id || '-'}"`)
    console.log(`  - Relasi Lokasi  : ID: "${doc.locationRelationship?.id || '-'}"`)
    console.log(`  - Dewa / Tokoh   : ID: "${doc.relatedDeity?.id || '-'}" (Peran: "${doc.deityRole?.id || '-'}")`)
    console.log(`  - Makna Ritual   : ID: "${doc.ritualMeaning?.id ? doc.ritualMeaning.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - Tradisi        : ID: "${doc.traditionExplanation?.id ? doc.traditionExplanation.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - Rangkaian Acara: ID: "${doc.eventSequence?.id ? doc.eventSequence.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - Partisipasi    : ID: "${doc.participationDescription?.id ? doc.participationDescription.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - Donasi Lilin   : ID: "${doc.candleDonationInfo?.id ? doc.candleDonationInfo.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - Donasi Lampion : ID: "${doc.lanternDonationInfo?.id ? doc.lanternDonationInfo.id.slice(0, 50) + '...' : '-'}"`)
    console.log(`  - RichText ID    : ${doc.description?.id?.root?.children?.length ? `${doc.description.id.root.children.length} paragraf` : 'Kosong'}`)
    console.log(`  - RichText EN    : ${doc.description?.en?.root?.children?.length ? `${doc.description.en.root.children.length} paragraf` : 'Kosong'}`)

    // Integrity checks
    if (!doc.title?.id || !doc.title?.en) {
      console.warn(`    ⚠️ Title bilingual tidak lengkap!`)
      allFound = false
    }
    if (!doc.slug?.id || !doc.slug?.en) {
      console.warn(`    ⚠️ Slug bilingual tidak lengkap!`)
      allFound = false
    }
    if (doc.status !== 'draft') {
      console.warn(`    ⚠️ Status publikasi bukan draft!`)
    }
    if (doc.date !== null && doc.date !== undefined) {
      console.warn(`    ⚠️ Tanggal Masehi tidak boleh terisi jika belum dikonfirmasi!`)
      allFound = false
    }
  }

  console.log('\n' + '='.repeat(80))
  if (allFound) {
    console.log('🎉 SEMUA 11 KEGIATAN LOLOS VALIDASI STRUKTUR & BILINGUAL SECARA LENGKAP!')
  } else {
    console.error('❌ TERDAPAT KESALAHAN PADA VALIDASI!')
  }
  console.log('='.repeat(80))
}

verifySeededActivities()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
