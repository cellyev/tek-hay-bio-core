import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

export interface ActivitySeedData {
  title: { id: string; en: string }
  slug: { id: string; en: string }
  shortDescription: { id: string; en: string }
  description: { id: string; en: string }
  category: 'ritual' | 'ancestral-worship' | 'deity-festival' | 'cultural-celebration' | 'social-activity'
  recurrenceType: 'annual-lunar' | 'annual-gregorian' | 'periodic' | 'one-time' | 'incidental'
  scheduleStatus: 'scheduled' | 'tentative' | 'rescheduled' | 'unscheduled'
  status: 'draft' | 'published'
  lunarRuleType: 'exact_date' | 'first_half' | 'second_half' | 'custom_period' | 'none'
  lunarDay: number | null
  lunarMonth: number | null
  isLeapMonth: boolean
  lunarPeriodDescription: { id: string; en: string } | null
  date: string | null
  endDate: string | null
  year: number | null
  scheduleNote: { id: string; en: string } | null
  rescheduledNote: { id: string; en: string } | null
  locationType: 'internal' | 'external' | 'hybrid'
  location: { id: string; en: string }
  locationAddress: { id: string; en: string }
  locationRelationship: { id: string; en: string } | null
  relatedDeity: { id: string; en: string } | null
  deityRole: { id: string; en: string } | null
  ritualMeaning: { id: string; en: string } | null
  traditionExplanation: { id: string; en: string } | null
  eventSequence: { id: string; en: string } | null
  managementNotes: { id: string; en: string } | null
  participationDescription: { id: string; en: string } | null
  candleDonationInfo: { id: string; en: string } | null
  lanternDonationInfo: { id: string; en: string } | null
  requiredEquipment: { id: string; en: string } | null
  participationInstructions: { id: string; en: string } | null
  contactInfo: { id: string; en: string } | null
}

export const ACTIVITIES_DATA: ActivitySeedData[] = [
  // 1. Ritual Toa Pek Kong Naik
  {
    title: {
      id: 'Ritual Toa Pek Kong Naik',
      en: 'Toa Pek Kong Ascension Ritual',
    },
    slug: {
      id: 'ritual-toa-pek-kong-naik',
      en: 'toa-pek-kong-ascension-ritual',
    },
    shortDescription: {
      id: 'Ritual tahunan yang dilaksanakan pada tanggal 24 bulan 12 Imlek sebagai bagian dari tradisi keagamaan dan penghormatan kepada Toa Pek Kong.',
      en: 'An annual ritual held on the 24th day of the 12th lunar month as part of the religious traditions and devotional practices associated with Toa Pek Kong.',
    },
    description: {
      id: 'Ritual Toa Pek Kong Naik merupakan salah satu kegiatan tahunan yang dilaksanakan oleh umat di Klenteng Tek Hay Bio. Ritual ini berlangsung pada tanggal 24 bulan 12 kalender Imlek dan menjadi bagian dari rangkaian tradisi menjelang Tahun Baru Imlek.\n\nPelaksanaan ritual mengikuti tradisi yang diwariskan dari generasi ke generasi. Rangkaian sembahyang dan tata cara pelaksanaan mengikuti ketentuan serta kebiasaan yang berlaku di klenteng.',
      en: 'The Toa Pek Kong Ascension Ritual is an annual religious observance held at Tek Hay Bio Temple. It takes place on the 24th day of the 12th lunar month and forms part of the traditional observances leading up to the Chinese Lunar New Year.\n\nThe ritual follows customs passed down through generations. Its prayers and ceremonial arrangements follow the practices and guidance observed at the temple.',
    },
    category: 'ritual',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'exact_date',
    lunarDay: 24,
    lunarMonth: 12,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Ritual tahunan menjelang Tahun Baru Imlek',
      en: 'Annual ritual preceding the Chinese Lunar New Year',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Tanggal Masehi dan jam pelaksanaan menunggu konfirmasi pengurus.',
      en: 'The Gregorian date and ceremony time are subject to confirmation by the temple management.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Toa Pek Kong',
      en: 'Toa Pek Kong',
    },
    deityRole: {
      id: 'Tokoh utama yang berkaitan dengan ritual.',
      en: 'The principal figure associated with the ritual.',
    },
    ritualMeaning: {
      id: 'Penghormatan kepada Toa Pek Kong melalui ritual yang diwariskan dalam tradisi klenteng.',
      en: 'Paying homage to Toa Pek Kong through a ritual preserved in the temple\'s traditions.',
    },
    traditionExplanation: {
      id: 'Mengikuti tradisi ritual yang dijaga oleh klenteng.',
      en: 'Follows ritual customs preserved by the temple.',
    },
    eventSequence: {
      id: 'Pelaksanaan sembahyang dan rangkaian ritual sesuai tata cara klenteng.',
      en: 'Prayers and ritual observances according to the temple\'s established practices.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi mengenai keikutsertaan umat dapat diperoleh dari pengurus klenteng.',
      en: 'Information about participation can be obtained from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 2. Sembahyang Leluhur Menjelang Imlek
  {
    title: {
      id: 'Sembahyang Leluhur Menjelang Imlek',
      en: 'Ancestors\' Prayers Before Lunar New Year',
    },
    slug: {
      id: 'sembahyang-leluhur-menjelang-imlek',
      en: 'ancestors-prayers-before-lunar-new-year',
    },
    shortDescription: {
      id: 'Sembahyang leluhur yang dilaksanakan sehari sebelum Tahun Baru Imlek sebagai bagian dari tradisi penghormatan kepada leluhur.',
      en: 'An ancestral prayer observance held one day before the Chinese Lunar New Year as part of the tradition of honoring one\'s ancestors.',
    },
    description: {
      id: 'Sembahyang Leluhur Menjelang Imlek merupakan kegiatan yang dilaksanakan sehari sebelum Tahun Baru Imlek. Kegiatan ini menjadi bagian dari tradisi keluarga dan penghormatan kepada leluhur yang diwariskan secara turun-temurun.\n\nPelaksanaannya mengikuti kebiasaan dan tata cara sembahyang yang berlaku. Waktu serta susunan kegiatan dapat mengikuti ketentuan pengurus dan tradisi yang dijalankan di Klenteng Tek Hay Bio.',
      en: 'Ancestors\' Prayers Before Lunar New Year is an observance held one day before the Chinese Lunar New Year. It forms part of the family tradition of honoring ancestors and preserving customs passed down through generations.\n\nThe observance follows established prayer customs and ceremonial practices. Its schedule and arrangements may be determined by the temple management and the traditions maintained at Tek Hay Bio Temple.',
    },
    category: 'ancestral-worship',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'custom_period',
    lunarDay: null,
    lunarMonth: null,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Sehari sebelum Tahun Baru Imlek',
      en: 'One day before the Chinese Lunar New Year',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Mengikuti tanggal Tahun Baru Imlek pada tahun berjalan.',
      en: 'Follows the Chinese Lunar New Year date for the relevant year.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Leluhur',
      en: 'Ancestors',
    },
    deityRole: {
      id: 'Pihak yang dihormati dalam sembahyang leluhur.',
      en: 'The ancestors honored through the prayers.',
    },
    ritualMeaning: {
      id: 'Penghormatan kepada leluhur dan pelestarian tradisi keluarga.',
      en: 'Honoring ancestors and preserving family traditions.',
    },
    traditionExplanation: {
      id: 'Tradisi sembahyang leluhur yang diwariskan turun-temurun.',
      en: 'Ancestral prayer customs passed down through generations.',
    },
    eventSequence: {
      id: 'Sembahyang leluhur sesuai tata cara yang berlaku.',
      en: 'Ancestral prayers following established customs.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi pelaksanaan dapat ditanyakan kepada pengurus.',
      en: 'Details about participation can be obtained from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 3. Ritual Toa Pek Kong Turun
  {
    title: {
      id: 'Ritual Toa Pek Kong Turun',
      en: 'Toa Pek Kong Descent Ritual',
    },
    slug: {
      id: 'ritual-toa-pek-kong-turun',
      en: 'toa-pek-kong-descent-ritual',
    },
    shortDescription: {
      id: 'Ritual tahunan yang dilaksanakan pada tanggal 4 bulan 1 Imlek sebagai bagian dari rangkaian tradisi keagamaan pada awal tahun lunar.',
      en: 'An annual ritual held on the 4th day of the 1st lunar month as part of the religious observances at the beginning of the lunar year.',
    },
    description: {
      id: 'Ritual Toa Pek Kong Turun merupakan salah satu ritual tahunan yang dilaksanakan pada tanggal 4 bulan 1 Imlek di Klenteng Tek Hay Bio.\n\nKegiatan ini menjadi bagian dari rangkaian tradisi keagamaan pada awal tahun lunar. Pelaksanaan sembahyang dan tata cara ritual mengikuti tradisi yang dijaga oleh klenteng serta arahan pengurus.',
      en: 'The Toa Pek Kong Descent Ritual is an annual observance held on the 4th day of the 1st lunar month at Tek Hay Bio Temple.\n\nIt forms part of the temple\'s religious traditions at the beginning of the lunar year. The prayers and ceremonial procedures follow customs preserved by the temple and the guidance of its management.',
    },
    category: 'ritual',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'exact_date',
    lunarDay: 4,
    lunarMonth: 1,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Awal tahun baru lunar',
      en: 'Beginning of the new lunar year',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Tanggal Masehi menyesuaikan kalender Imlek tahun berjalan.',
      en: 'The Gregorian date follows the lunar calendar for the relevant year.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Toa Pek Kong',
      en: 'Toa Pek Kong',
    },
    deityRole: {
      id: 'Tokoh utama yang berkaitan dengan ritual.',
      en: 'The principal figure associated with the ritual.',
    },
    ritualMeaning: {
      id: 'Pelaksanaan tradisi ritual pada awal tahun lunar.',
      en: 'Observing a traditional ritual at the beginning of the lunar year.',
    },
    traditionExplanation: {
      id: 'Tradisi keagamaan awal tahun lunar di klenteng.',
      en: 'A religious tradition observed at the temple at the beginning of the lunar year.',
    },
    eventSequence: {
      id: 'Sembahyang dan rangkaian ritual sesuai tradisi klenteng.',
      en: 'Prayers and ritual observances according to temple traditions.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi pelaksanaan dapat diperoleh dari pengurus.',
      en: 'Information about participation can be obtained from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 4. Ritual Kheng Thi Kong
  {
    title: {
      id: 'Ritual Kheng Thi Kong',
      en: 'Kheng Thi Kong Ritual',
    },
    slug: {
      id: 'ritual-kheng-thi-kong',
      en: 'kheng-thi-kong-ritual',
    },
    shortDescription: {
      id: 'Ritual sembahyang yang dilaksanakan pada tanggal 9 bulan 1 Imlek sebagai bagian dari tradisi keagamaan pada awal tahun baru lunar.',
      en: 'An annual prayer ritual held on the 9th day of the 1st lunar month as part of the religious traditions observed at the beginning of the lunar year.',
    },
    description: {
      id: 'Ritual Kheng Thi Kong merupakan kegiatan sembahyang tahunan yang dilaksanakan pada tanggal 9 bulan 1 Imlek di Klenteng Tek Hay Bio.\n\nKegiatan ini menjadi bagian dari tradisi keagamaan pada awal tahun lunar. Pelaksanaan ritual mengikuti tata cara sembahyang dan tradisi yang dijalankan oleh klenteng.\n\nNama ritual, tokoh yang dihormati, dan rangkaian upacara dapat dilengkapi lebih lanjut berdasarkan keterangan resmi pengurus.',
      en: 'The Kheng Thi Kong Ritual is an annual prayer observance held on the 9th day of the 1st lunar month at Tek Hay Bio Temple.\n\nIt forms part of the temple\'s religious traditions at the beginning of the lunar year. The ceremony follows the prayer customs and practices maintained by the temple.\n\nThe name of the ritual, the figure being honored, and the ceremonial sequence may be further detailed based on official information from the temple management.',
    },
    category: 'ritual',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'exact_date',
    lunarDay: 9,
    lunarMonth: 1,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Ritual pada awal tahun lunar',
      en: 'Ritual at the beginning of the lunar year',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Jadwal Masehi dan jam pelaksanaan menunggu konfirmasi.',
      en: 'The Gregorian date and ceremony time are awaiting confirmation.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Belum dikonfirmasi',
      en: 'To be confirmed',
    },
    deityRole: {
      id: 'Menunggu konfirmasi pengurus.',
      en: 'Pending confirmation from the temple management.',
    },
    ritualMeaning: {
      id: 'Tradisi sembahyang pada awal tahun lunar.',
      en: 'A traditional prayer observance at the beginning of the lunar year.',
    },
    traditionExplanation: {
      id: 'Mengikuti tata cara sembahyang yang berlaku di klenteng.',
      en: 'Follows the temple\'s established prayer customs.',
    },
    eventSequence: {
      id: 'Mengikuti tata cara resmi klenteng; susunan rinci menunggu konfirmasi.',
      en: 'Follows the temple\'s established practices; detailed sequence pending confirmation.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi pelaksanaan dapat diperoleh dari pengurus.',
      en: 'Information about participation can be obtained from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 5. Ritual Tolak Bala
  {
    title: {
      id: 'Ritual Tolak Bala',
      en: 'Ritual for Protection and the Removal of Misfortune',
    },
    slug: {
      id: 'ritual-tolak-bala',
      en: 'ritual-for-protection-and-the-removal-of-misfortune',
    },
    shortDescription: {
      id: 'Ritual keagamaan yang berkaitan dengan doa memohon perlindungan dan keselamatan. Jadwal serta rangkaian pelaksanaan mengikuti ketentuan pengurus klenteng.',
      en: 'A religious ritual associated with prayers for protection and safety. Its schedule and ceremonial arrangements follow the guidance of the temple management.',
    },
    description: {
      id: 'Ritual Tolak Bala merupakan kegiatan keagamaan yang berkaitan dengan permohonan perlindungan dan keselamatan melalui sembahyang serta doa.\n\nRitual ini menjadi bagian dari praktik keagamaan yang dapat dijalankan menurut tradisi klenteng. Waktu pelaksanaan, tokoh yang dihormati, dan susunan upacara perlu mengikuti keterangan resmi dari pengurus Klenteng Tek Hay Bio.',
      en: 'Ritual Tolak Bala is a religious observance associated with prayers for protection and safety.\n\nThe ritual forms part of religious practices that may be observed according to the temple\'s traditions. Its schedule, the figures being honored, and the ceremonial arrangements should follow official information provided by the management of Tek Hay Bio Temple.',
    },
    category: 'ritual',
    recurrenceType: 'incidental',
    scheduleStatus: 'unscheduled',
    status: 'draft',
    lunarRuleType: 'custom_period',
    lunarDay: null,
    lunarMonth: null,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Jadwal ritual menunggu konfirmasi pengurus',
      en: 'Ritual schedule pending confirmation from the temple management',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Jangan menetapkan tanggal sebelum mendapatkan informasi resmi.',
      en: 'Do not set a date until official information is available.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Belum dikonfirmasi',
      en: 'To be confirmed',
    },
    deityRole: {
      id: 'Menunggu konfirmasi pengurus.',
      en: 'Pending confirmation from the temple management.',
    },
    ritualMeaning: {
      id: 'Doa untuk memohon perlindungan dan keselamatan.',
      en: 'Prayers seeking protection and safety.',
    },
    traditionExplanation: {
      id: 'Mengikuti tata cara yang ditetapkan pengurus.',
      en: 'Follows the ceremonial practices established by the temple management.',
    },
    eventSequence: {
      id: 'Menunggu keterangan resmi.',
      en: 'Awaiting official details.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi partisipasi menunggu konfirmasi pengurus.',
      en: 'Participation information is pending confirmation from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 6. Sembahyang Cap Go Meh
  {
    title: {
      id: 'Sembahyang Cap Go Meh',
      en: 'Cap Go Meh Prayer Ceremony',
    },
    slug: {
      id: 'sembahyang-cap-go-meh',
      en: 'cap-go-meh-prayer-ceremony',
    },
    shortDescription: {
      id: 'Sembahyang Cap Go Meh merupakan bagian dari tradisi perayaan penutup rangkaian Tahun Baru Imlek. Kegiatan ini juga berkaitan dengan tradisi makan lontong opor dan kirab di Tek Hay Kiong, Tegal.',
      en: 'The Cap Go Meh prayer ceremony forms part of the closing celebrations of the Chinese Lunar New Year period. The recorded traditions also include lontong opor and a procession associated with Tek Hay Kiong Temple in Tegal.',
    },
    description: {
      id: 'Cap Go Meh merupakan perayaan yang menandai hari ke-15 bulan pertama kalender Imlek. Di dalam tradisi yang dicatat, kegiatan ini mencakup sembahyang dan tradisi makan lontong opor, serta kirab yang berkaitan dengan Tek Hay Kiong di Tegal.\n\nInformasi mengenai hubungan pelaksanaan sembahyang di Klenteng Tek Hay Bio dengan kegiatan kirab di Tek Hay Kiong perlu disesuaikan dengan jadwal dan susunan acara yang ditetapkan pengurus.',
      en: 'Cap Go Meh marks the 15th day of the first lunar month. According to the recorded traditions, the observance includes prayers, the customary meal of lontong opor, and a procession associated with Tek Hay Kiong Temple in Tegal.\n\nThe relationship between the prayer ceremony at Tek Hay Bio Temple and the procession at Tek Hay Kiong Temple should be clarified according to the schedule and arrangements established by the temple management.',
    },
    category: 'cultural-celebration',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'exact_date',
    lunarDay: 15,
    lunarMonth: 1,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Hari ke-15 bulan pertama Imlek (Cap Go Meh)',
      en: '15th day of the first lunar month (Cap Go Meh)',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Jadwal sembahyang dan kirab perlu dikonfirmasi.',
      en: 'The prayer ceremony and procession schedules require confirmation.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: {
      id: 'Kirab berkaitan dengan Tek Hay Kiong di Tegal (menunggu konfirmasi hubungan kegiatan dengan pengurus).',
      en: 'Procession associated with Tek Hay Kiong Temple in Tegal (pending confirmation from temple management).',
    },
    relatedDeity: {
      id: 'Belum dikonfirmasi',
      en: 'To be confirmed',
    },
    deityRole: {
      id: 'Tokoh terkait belum dikonfirmasi.',
      en: 'Related figure not yet confirmed.',
    },
    ritualMeaning: {
      id: 'Bagian dari tradisi perayaan Cap Go Meh dan kebersamaan umat.',
      en: 'Part of Cap Go Meh traditions and community observances.',
    },
    traditionExplanation: {
      id: 'Tradisi makan lontong opor dan kirab yang berkaitan dengan Tek Hay Kiong, Tegal.',
      en: 'The traditional lontong opor meal and a procession associated with Tek Hay Kiong, Tegal.',
    },
    eventSequence: {
      id: 'Sembahyang, tradisi makan lontong opor, dan kirab sesuai jadwal yang telah dikonfirmasi.',
      en: 'Prayers, the traditional lontong opor meal, and the procession according to the confirmed schedule.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Konfirmasi lokasi dan susunan kegiatan kepada pengurus.',
      en: 'Confirm the location and event arrangements with the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 7. Perayaan Hari Kebesaran Kongco Tek Hay Cin Jin
  {
    title: {
      id: 'Perayaan Hari Kebesaran Kongco Tek Hay Cin Jin',
      en: 'Celebration of Kongco Tek Hay Cin Jin\'s Birthday',
    },
    slug: {
      id: 'hari-kebesaran-kongco-tek-hay-cin-jin',
      en: 'celebration-of-kongco-tek-hay-cin-jins-birthday',
    },
    shortDescription: {
      id: 'Perayaan tahunan untuk memperingati hari kebesaran Kongco Tek Hay Cin Jin pada tanggal 2 bulan 2 Imlek. Kegiatan ini mencakup pengumpulan donasi lilin dan tradisi peminjaman perlengkapan simbolis yang berkaitan dengan dewa.',
      en: 'An annual celebration honoring Kongco Tek Hay Cin Jin on the 2nd day of the 2nd lunar month. The observance includes candle donations and a tradition involving symbolic items associated with the deity.',
    },
    description: {
      id: 'Perayaan Hari Kebesaran Kongco Tek Hay Cin Jin dilaksanakan pada tanggal 2 bulan 2 kalender Imlek di Klenteng Tek Hay Bio.\n\nDalam rangkaian tradisi yang dicatat, kegiatan ini mencakup pengumpulan donasi lilin serta peminjaman barang-barang dewa, seperti kue gembreng, kue mangkok, kue kuro, jeruk, apel, pir, dan punji atau modal dari dewa yang berupa angpao.\n\nPelaksanaan kegiatan, ketentuan donasi, ketersediaan perlengkapan, serta tata cara peminjaman mengikuti kebijakan dan arahan pengurus klenteng.',
      en: 'The Celebration of Kongco Tek Hay Cin Jin\'s Birthday is held on the 2nd day of the 2nd lunar month at Tek Hay Bio Temple.\n\nAccording to the recorded traditions, the event includes candle donations and the borrowing of items associated with the deity, such as kue gembreng, kue mangkok, kue kuro, oranges, apples, pears, and punji, or symbolic capital from the deity in the form of an angpao (red envelope).\n\nThe arrangements for the celebration, donation procedures, availability of ceremonial items, and borrowing process are subject to the temple management\'s policies and guidance.',
    },
    category: 'deity-festival',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'exact_date',
    lunarDay: 2,
    lunarMonth: 2,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Hari kebesaran Kongco Tek Hay Cin Jin',
      en: 'Celebration of Kongco Tek Hay Cin Jin',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Jadwal kegiatan dan ketentuan partisipasi menunggu konfirmasi pengurus.',
      en: 'The event schedule and participation arrangements are subject to confirmation by the temple management.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Kongco Tek Hay Cin Jin',
      en: 'Kongco Tek Hay Cin Jin',
    },
    deityRole: {
      id: 'Tokoh utama dalam perayaan hari kebesaran.',
      en: 'The central figure honored during the celebration.',
    },
    ritualMeaning: {
      id: 'Penghormatan kepada Kongco Tek Hay Cin Jin dan pelestarian tradisi yang dijalankan umat.',
      en: 'Honoring Kongco Tek Hay Cin Jin and preserving the traditions observed by devotees.',
    },
    traditionExplanation: {
      id: 'Donasi lilin dan peminjaman perlengkapan simbolis: kue gembreng, kue mangkok, kue kuro, jeruk, apel, pir, dan punji berupa angpao.',
      en: 'Candle donations and borrowing symbolic items: kue gembreng, kue mangkok, kue kuro, oranges, apples, pears, and punji in the form of an angpao.',
    },
    eventSequence: {
      id: 'Sembahyang, kegiatan donasi lilin, dan pelayanan peminjaman perlengkapan sesuai ketentuan pengurus.',
      en: 'Prayers, candle donations, and the borrowing of ceremonial items according to the temple management\'s arrangements.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Umat dapat mencari informasi kepada pengurus mengenai rangkaian perayaan, donasi lilin, serta tradisi peminjaman perlengkapan.',
      en: 'Devotees may contact the temple management for information about the celebration, candle donations, and the tradition of borrowing ceremonial items.',
    },
    candleDonationInfo: {
      id: 'Informasi mengenai donasi lilin dapat diperoleh melalui pengurus Klenteng Tek Hay Bio. Ketentuan dan mekanisme donasi mengikuti informasi resmi yang berlaku.',
      en: 'Information about candle donations is available from the management of Tek Hay Bio Temple. Donation procedures are subject to the temple\'s official arrangements.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 8. Sembahyang Ceng Beng
  {
    title: {
      id: 'Sembahyang Ceng Beng',
      en: 'Ceng Beng Ancestral Prayers',
    },
    slug: {
      id: 'sembahyang-ceng-beng',
      en: 'ceng-beng-ancestral-prayers',
    },
    shortDescription: {
      id: 'Sembahyang Ceng Beng merupakan tradisi penghormatan kepada leluhur yang dilaksanakan di sekitar periode Ceng Beng, dengan rentang sepuluh hari sebelum hingga sepuluh hari sesudah tanggal 5 April.',
      en: 'Ceng Beng is an ancestral remembrance tradition observed around the Qingming period, with a recorded observance window extending from ten days before to ten days after April 5.',
    },
    description: {
      id: 'Ceng Beng merupakan tradisi yang berkaitan dengan penghormatan kepada leluhur. Berdasarkan informasi yang dicatat, periode sembahyang berlangsung dalam rentang sepuluh hari sebelum hingga sepuluh hari sesudah tanggal 5 April.\n\nTradisi ini menjadi kesempatan untuk mengenang dan menghormati leluhur melalui kegiatan sembahyang sesuai kebiasaan yang dijalankan. Tanggal serta lokasi pelaksanaan perlu mengikuti ketentuan pengurus dan tradisi keluarga masing-masing.',
      en: 'Ceng Beng is a tradition associated with honoring and remembering ancestors. According to the recorded information, the prayer period extends from ten days before to ten days after April 5.\n\nThe observance provides an opportunity to remember and honor ancestors through prayers and customary practices. The exact dates and locations should follow the temple management\'s guidance and the traditions observed by individual families.',
    },
    category: 'ancestral-worship',
    recurrenceType: 'periodic',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'custom_period',
    lunarDay: null,
    lunarMonth: null,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Sepuluh hari sebelum hingga sepuluh hari sesudah 5 April',
      en: 'Ten days before through ten days after April 5',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Periode pelaksanaan mengikuti tradisi Ceng Beng; tanggal kegiatan khusus di klenteng perlu dikonfirmasi.',
      en: 'The observance follows the Ceng Beng period; the dates of any specific temple activities require confirmation.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Leluhur',
      en: 'Ancestors',
    },
    deityRole: {
      id: 'Pihak yang dihormati melalui sembahyang.',
      en: 'The ancestors honored through prayers.',
    },
    ritualMeaning: {
      id: 'Mengenang dan menghormati leluhur.',
      en: 'Remembering and honoring ancestors.',
    },
    traditionExplanation: {
      id: 'Tradisi penghormatan leluhur pada periode Ceng Beng.',
      en: 'Ancestral remembrance traditions during the Ceng Beng period.',
    },
    eventSequence: {
      id: 'Sembahyang leluhur sesuai tradisi keluarga dan ketentuan yang berlaku.',
      en: 'Ancestral prayers according to family traditions and established practices.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Konfirmasi jadwal dan ketentuan kepada pengurus.',
      en: 'Confirm schedules and arrangements with the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 9. Sembahyang Leluhur Jit Gwee
  {
    title: {
      id: 'Sembahyang Leluhur Jit Gwee',
      en: 'Jit Gwee Ancestral Prayers',
    },
    slug: {
      id: 'sembahyang-leluhur-jit-gwee',
      en: 'jit-gwee-ancestral-prayers',
    },
    shortDescription: {
      id: 'Sembahyang leluhur yang dilaksanakan pada paruh pertama bulan 7 Imlek sebagai bagian dari tradisi penghormatan kepada leluhur.',
      en: 'An ancestral prayer observance held during the first half of the 7th lunar month as part of the tradition of honoring ancestors.',
    },
    description: {
      id: 'Sembahyang Leluhur Jit Gwee merupakan kegiatan sembahyang yang dilaksanakan pada paruh pertama bulan 7 kalender Imlek.\n\nKegiatan ini berkaitan dengan tradisi penghormatan kepada leluhur yang diwariskan dari generasi ke generasi. Waktu pelaksanaan, susunan sembahyang, dan ketentuan partisipasi mengikuti kebiasaan serta arahan pengurus Klenteng Tek Hay Bio.',
      en: 'Jit Gwee Ancestral Prayers are held during the first half of the 7th lunar month.\n\nThe observance forms part of the tradition of honoring ancestors passed down through generations. The schedule, prayer arrangements, and participation requirements follow the customs and guidance of Tek Hay Bio Temple\'s management.',
    },
    category: 'ancestral-worship',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'first_half',
    lunarDay: null,
    lunarMonth: 7,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Paruh pertama bulan 7 Imlek',
      en: 'First half of the 7th lunar month',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Tanggal dan jam pelaksanaan menunggu informasi resmi pengurus.',
      en: 'The date and time are awaiting official confirmation from the temple management.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Leluhur',
      en: 'Ancestors',
    },
    deityRole: {
      id: 'Pihak yang dihormati dalam sembahyang.',
      en: 'The ancestors honored through the prayers.',
    },
    ritualMeaning: {
      id: 'Penghormatan kepada leluhur melalui tradisi sembahyang.',
      en: 'Honoring ancestors through traditional prayers.',
    },
    traditionExplanation: {
      id: 'Tradisi sembahyang leluhur pada paruh pertama bulan 7 Imlek.',
      en: 'Ancestral prayer tradition during the first half of the 7th lunar month.',
    },
    eventSequence: {
      id: 'Sembahyang leluhur sesuai tata cara klenteng.',
      en: 'Ancestral prayers according to the temple\'s established practices.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi pelaksanaan dapat diperoleh dari pengurus.',
      en: 'Information about participation can be obtained from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 10. Sembahyang Rebutan
  {
    title: {
      id: 'Sembahyang Rebutan',
      en: 'Sembahyang Rebutan — Prayers for Wandering Spirits',
    },
    slug: {
      id: 'sembahyang-rebutan',
      en: 'sembahyang-rebutan-prayers-for-wandering-spirits',
    },
    shortDescription: {
      id: 'Sembahyang Rebutan merupakan tradisi sembahyang pada paruh kedua bulan 7 Imlek yang berkaitan dengan penghormatan dan doa bagi arwah gentayangan.',
      en: 'Sembahyang Rebutan is a traditional observance held during the second half of the 7th lunar month, associated with prayers and offerings for wandering spirits.',
    },
    description: {
      id: 'Sembahyang Rebutan merupakan salah satu tradisi yang dilaksanakan pada paruh kedua bulan 7 kalender Imlek. Berdasarkan keterangan yang diperoleh, kegiatan ini ditujukan untuk arwah gentayangan.\n\nPelaksanaan tradisi ini merupakan bagian dari praktik keagamaan dan budaya yang diwariskan secara turun-temurun. Susunan sembahyang, perlengkapan yang digunakan, dan tata cara pelaksanaan mengikuti tradisi yang berlaku di Klenteng Tek Hay Bio serta arahan pengurus.',
      en: 'Sembahyang Rebutan is a traditional observance held during the second half of the 7th lunar month. According to the information recorded, the ceremony is associated with wandering spirits.\n\nThe observance forms part of religious and cultural practices passed down through generations. The prayer arrangements, ceremonial items, and procedures follow the traditions maintained at Tek Hay Bio Temple and the guidance of its management.',
    },
    category: 'ancestral-worship',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'tentative',
    status: 'draft',
    lunarRuleType: 'second_half',
    lunarDay: null,
    lunarMonth: 7,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Paruh kedua bulan 7 Imlek',
      en: 'Second half of the 7th lunar month',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Jadwal pelaksanaan dan susunan acara perlu dikonfirmasi kepada pengurus.',
      en: 'The event schedule and ceremony arrangements should be confirmed with the temple management.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Arwah gentayangan',
      en: 'Wandering spirits',
    },
    deityRole: {
      id: 'Pihak yang menjadi tujuan doa dalam tradisi ini.',
      en: 'The spirits for whom prayers are offered in this tradition.',
    },
    ritualMeaning: {
      id: 'Doa dan penghormatan dalam tradisi sembahyang bagi arwah gentayangan.',
      en: 'Prayers and observances associated with the tradition of honoring wandering spirits.',
    },
    traditionExplanation: {
      id: 'Tradisi sembahyang pada paruh kedua bulan 7 Imlek.',
      en: 'A prayer tradition during the second half of the 7th lunar month.',
    },
    eventSequence: {
      id: 'Mengikuti tata cara sembahyang dan ketentuan pengurus.',
      en: 'Follows the prayer customs and arrangements established by the temple management.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Informasi partisipasi menunggu konfirmasi pengurus.',
      en: 'Participation information is pending confirmation from the temple management.',
    },
    candleDonationInfo: {
      id: 'Tidak dicatat khusus untuk kegiatan ini; isi hanya jika dikonfirmasi.',
      en: 'Not specifically recorded for this event; fill only if confirmed.',
    },
    lanternDonationInfo: null,
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },

  // 11. Perayaan Tiong Jiu dan Hari Kebesaran Hok Tek Ceng Sin
  {
    title: {
      id: 'Perayaan Tiong Jiu dan Hari Kebesaran Hok Tek Ceng Sin',
      en: 'Tiong Jiu Celebration and the Festival Honoring Hok Tek Ceng Sin',
    },
    slug: {
      id: 'perayaan-tiong-jiu-hok-tek-ceng-sin',
      en: 'tiong-jiu-celebration-and-festival-honoring-hok-tek-ceng-sin',
    },
    shortDescription: {
      id: 'Perayaan Tiong Jiu sekaligus hari kebesaran Dewa Bumi Hok Tek Ceng Sin. Kegiatan ini mencakup pengumpulan donasi lampion dan tradisi peminjaman perlengkapan simbolis yang berkaitan dengan dewa.',
      en: 'The Tiong Jiu celebration coincides with an observance honoring Hok Tek Ceng Sin, the Earth Deity. Traditions associated with the event include lantern donations and the borrowing of symbolic items connected with the deity.',
    },
    description: {
      id: 'Perayaan Tiong Jiu merupakan kegiatan tahunan yang juga berkaitan dengan hari kebesaran Dewa Bumi Hok Tek Ceng Sin.\n\nBerdasarkan informasi yang dicatat, rangkaian tradisi ini mencakup pengumpulan donasi lampion serta peminjaman barang-barang dewa, seperti kue gembreng, kue mangkok, kue kuro, kue bulan, jeruk, apel, pir, dan punji atau modal dari dewa yang berupa angpao.\n\nKegiatan ini menjadi bagian dari tradisi keagamaan dan budaya yang dijalankan oleh umat. Jadwal, ketersediaan perlengkapan, dan ketentuan partisipasi mengikuti informasi resmi dari pengurus Klenteng Tek Hay Bio.',
      en: 'The Tiong Jiu celebration is an annual observance that is also associated with the celebration honoring Hok Tek Ceng Sin, the Earth Deity.\n\nAccording to the recorded information, the traditions include lantern donations and the borrowing of deity-associated items, such as kue gembreng, kue mangkok, kue kuro, mooncakes, oranges, apples, pears, and punji, or symbolic capital from the deity in the form of an angpao (red envelope).\n\nThe event forms part of the religious and cultural traditions observed by devotees. Its schedule, the availability of ceremonial items, and participation arrangements follow official information provided by the management of Tek Hay Bio Temple.',
    },
    category: 'deity-festival',
    recurrenceType: 'annual-lunar',
    scheduleStatus: 'unscheduled',
    status: 'draft',
    lunarRuleType: 'custom_period',
    lunarDay: null,
    lunarMonth: null,
    isLeapMonth: false,
    lunarPeriodDescription: {
      id: 'Perayaan Tiong Jiu dan hari kebesaran Hok Tek Ceng Sin; tanggal Imlek perlu dikonfirmasi pengurus.',
      en: 'Tiong Jiu celebration and observance honoring Hok Tek Ceng Sin; the lunar date requires confirmation from the temple management.',
    },
    date: null,
    endDate: null,
    year: null,
    scheduleNote: {
      id: 'Pastikan tanggal pelaksanaan dan apakah kedua perayaan berlangsung pada hari yang sama.',
      en: 'Confirm the event date and whether both celebrations take place on the same day.',
    },
    rescheduledNote: null,
    locationType: 'internal',
    location: {
      id: 'Klenteng Tek Hay Bio, Semarang',
      en: 'Tek Hay Bio Temple, Semarang',
    },
    locationAddress: {
      id: 'Jl. Gang Pinggir No. 107, Kranggan, Semarang Tengah, Semarang. Verifikasi sebelum publikasi.',
      en: 'Jl. Gang Pinggir No. 107, Kranggan, Central Semarang, Semarang. Verify before publication.',
    },
    locationRelationship: null,
    relatedDeity: {
      id: 'Hok Tek Ceng Sin (Dewa Bumi)',
      en: 'Hok Tek Ceng Sin (Earth Deity)',
    },
    deityRole: {
      id: 'Tokoh yang dihormati dalam perayaan hari kebesaran.',
      en: 'The deity honored during the celebration.',
    },
    ritualMeaning: {
      id: 'Penghormatan kepada Hok Tek Ceng Sin dan pelestarian tradisi Tiong Jiu.',
      en: 'Honoring Hok Tek Ceng Sin and preserving the traditions associated with Tiong Jiu.',
    },
    traditionExplanation: {
      id: 'Donasi lampion dan peminjaman perlengkapan simbolis: kue gembreng, kue mangkok, kue kuro, kue bulan, jeruk, apel, pir, dan punji berupa angpao.',
      en: 'Lantern donations and borrowing symbolic items: kue gembreng, kue mangkok, kue kuro, mooncakes, oranges, apples, pears, and punji in the form of an angpao.',
    },
    eventSequence: {
      id: 'Sembahyang, kegiatan donasi lampion, serta pelayanan peminjaman perlengkapan sesuai ketentuan pengurus.',
      en: 'Prayers, lantern donations, and the borrowing of ceremonial items according to the temple management\'s arrangements.',
    },
    managementNotes: {
      id: 'Belum tersedia; lengkapi setelah dikonfirmasi.',
      en: 'Not yet available; complete after confirmation.',
    },
    participationDescription: {
      id: 'Umat dapat menghubungi pengurus untuk memperoleh informasi mengenai perayaan, donasi lampion, serta tradisi peminjaman perlengkapan simbolis.',
      en: 'Devotees may contact the temple management for information about the celebration, lantern donations, and the tradition of borrowing symbolic ceremonial items.',
    },
    candleDonationInfo: null,
    lanternDonationInfo: {
      id: 'Informasi mengenai donasi lampion dapat diperoleh melalui pengurus Klenteng Tek Hay Bio. Ketentuan, biaya, dan mekanisme partisipasi perlu mengikuti informasi resmi yang berlaku.',
      en: 'Information about lantern donations is available from the management of Tek Hay Bio Temple. Any fees, conditions, and participation procedures must follow the temple\'s official arrangements.',
    },
    requiredEquipment: {
      id: 'Informasi belum tersedia; konfirmasi kepada pengurus.',
      en: 'Information not available; confirm with the temple management.',
    },
    participationInstructions: {
      id: 'Ikuti arahan pengurus dan tata tertib klenteng yang berlaku.',
      en: 'Follow the temple management\'s guidance and applicable temple rules.',
    },
    contactInfo: {
      id: 'Sekretariat Klenteng Tek Hay Bio atau narahubung resmi panitia; lengkapi kontak setelah dikonfirmasi.',
      en: 'Tek Hay Bio Temple Secretariat or an official event contact; add contact details once confirmed.',
    },
  },
]

export function textToLexical(text: string) {
  if (!text) return null
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: 'justify',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: p.trim(),
            type: 'text',
            version: 1,
          },
        ],
      })),
    },
  }
}

export function extractLocalePayload(item: ActivitySeedData, locale: 'id' | 'en') {
  return {
    title: item.title[locale],
    slug: item.slug[locale],
    shortDescription: item.shortDescription[locale],
    description: textToLexical(item.description[locale]),
    category: item.category,
    recurrenceType: item.recurrenceType,
    scheduleStatus: item.scheduleStatus,
    status: item.status,
    lunarRuleType: item.lunarRuleType,
    lunarDay: item.lunarDay,
    lunarMonth: item.lunarMonth,
    isLeapMonth: item.isLeapMonth,
    lunarPeriodDescription: item.lunarPeriodDescription ? item.lunarPeriodDescription[locale] : null,
    date: item.date,
    endDate: item.endDate,
    year: item.year,
    scheduleNote: item.scheduleNote ? item.scheduleNote[locale] : null,
    rescheduledNote: item.rescheduledNote ? item.rescheduledNote[locale] : null,
    locationType: item.locationType,
    location: item.location ? item.location[locale] : null,
    locationAddress: item.locationAddress ? item.locationAddress[locale] : null,
    locationRelationship: item.locationRelationship ? item.locationRelationship[locale] : null,
    relatedDeity: item.relatedDeity ? item.relatedDeity[locale] : null,
    deityRole: item.deityRole ? item.deityRole[locale] : null,
    ritualMeaning: item.ritualMeaning ? item.ritualMeaning[locale] : null,
    traditionExplanation: item.traditionExplanation ? item.traditionExplanation[locale] : null,
    eventSequence: item.eventSequence ? item.eventSequence[locale] : null,
    managementNotes: item.managementNotes ? item.managementNotes[locale] : null,
    participationDescription: item.participationDescription ? item.participationDescription[locale] : null,
    candleDonationInfo: item.candleDonationInfo ? item.candleDonationInfo[locale] : null,
    lanternDonationInfo: item.lanternDonationInfo ? item.lanternDonationInfo[locale] : null,
    requiredEquipment: item.requiredEquipment ? item.requiredEquipment[locale] : null,
    participationInstructions: item.participationInstructions ? item.participationInstructions[locale] : null,
    contactInfo: item.contactInfo ? item.contactInfo[locale] : null,
  }
}

export async function importActivities(options: { dryRun?: boolean; force?: boolean } = {}) {
  const { dryRun = false, force = false } = options
  console.log('='.repeat(70))
  console.log(`Klenteng Tek Hay Bio - Kegiatan Import Process`)
  console.log(`Mode: ${dryRun ? 'DRY-RUN (Simulasi tanpa menyimpan)' : 'LIVE (Penyimpanan ke Database)'}`)
  console.log(`Force Overwrite: ${force ? 'YES' : 'NO'}`)
  console.log('='.repeat(70))

  const payload = await getPayload({ config: configPromise })

  const results = {
    total: ACTIVITIES_DATA.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    details: [] as {
      index: number
      titleId: string
      titleEn: string
      slugId: string
      slugEn: string
      action: 'created' | 'updated' | 'skipped' | 'failed'
      status: string
      reason?: string
      id?: string | number
    }[],
  }

  for (let i = 0; i < ACTIVITIES_DATA.length; i++) {
    const item = ACTIVITIES_DATA[i]
    const index = i + 1
    const slugId = item.slug.id
    const slugEn = item.slug.en

    console.log(`\n[${index}/${ACTIVITIES_DATA.length}] Memeriksa: "${item.title.id}" (${slugId})`)

    try {
      // 1. Periksa apakah dokumen dengan slug ID atau slug EN sudah ada
      const existingId = await payload.find({
        collection: 'activities',
        where: {
          or: [
            { slug: { equals: slugId } },
            { 'slug.id': { equals: slugId } },
            { 'slug.en': { equals: slugEn } },
          ],
        },
        locale: 'all',
        limit: 1,
        overrideAccess: true,
      })

      const existingDoc = existingId.docs[0] as any

      if (existingDoc) {
        if (!force) {
          console.log(`  ℹ️  Dokumen sudah ada di database (ID: ${existingDoc.id}). Dilewati demi keamanan data.`)
          results.skipped++
          results.details.push({
            index,
            titleId: item.title.id,
            titleEn: item.title.en,
            slugId,
            slugEn,
            action: 'skipped',
            status: existingDoc.status || 'draft',
            reason: `Sudah ada di database (ID: ${existingDoc.id})`,
            id: existingDoc.id,
          })
          continue
        }

        // Jika force === true, lakukan update yang aman
        console.log(`  🔄 Melakukan update dokumen yang sudah ada (ID: ${existingDoc.id})...`)
        if (!dryRun) {
          const idData = extractLocalePayload(item, 'id')
          const enData = extractLocalePayload(item, 'en')

          await payload.update({
            collection: 'activities',
            id: existingDoc.id,
            data: idData,
            locale: 'id',
            overrideAccess: true,
          })

          await payload.update({
            collection: 'activities',
            id: existingDoc.id,
            data: enData,
            locale: 'en',
            overrideAccess: true,
          })
        }

        results.updated++
        results.details.push({
          index,
          titleId: item.title.id,
          titleEn: item.title.en,
          slugId,
          slugEn,
          action: 'updated',
          status: item.status,
          id: existingDoc.id,
        })
        console.log(`  ✅ Berhasil diperbarui.`)
        continue
      }

      // 2. Jika belum ada, buat dokumen baru
      console.log(`  ➕ Membuat dokumen baru...`)
      if (!dryRun) {
        const idData = extractLocalePayload(item, 'id')
        const enData = extractLocalePayload(item, 'en')

        // Buat record untuk locale 'id'
        const created = await payload.create({
          collection: 'activities',
          data: idData,
          locale: 'id',
          overrideAccess: true,
        })

        // Perbarui data untuk locale 'en'
        await payload.update({
          collection: 'activities',
          id: created.id,
          data: enData,
          locale: 'en',
          overrideAccess: true,
        })

        results.created++
        results.details.push({
          index,
          titleId: item.title.id,
          titleEn: item.title.en,
          slugId,
          slugEn,
          action: 'created',
          status: item.status,
          id: created.id,
        })
        console.log(`  ✅ Berhasil dibuat (ID: ${created.id}).`)
      } else {
        results.created++
        results.details.push({
          index,
          titleId: item.title.id,
          titleEn: item.title.en,
          slugId,
          slugEn,
          action: 'created',
          status: item.status,
          id: 'simulated-id',
        })
        console.log(`  [DRY-RUN] Simulasi pembuatan dokumen berhasil.`)
      }
    } catch (err: any) {
      console.error(`  ❌ Gagal memproses:`, err.message || err)
      results.failed++
      results.details.push({
        index,
        titleId: item.title.id,
        titleEn: item.title.en,
        slugId,
        slugEn,
        action: 'failed',
        status: item.status,
        reason: err.message || String(err),
      })
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('RINGKASAN HASIL IMPORT KEGIATAN')
  console.log('='.repeat(70))
  console.log(`Total Kegiatan Diproses : ${results.total}`)
  console.log(`Berhasil Dibuat (Baru) : ${results.created}`)
  console.log(`Berhasil Diperbarui    : ${results.updated}`)
  console.log(`Dilewati (Sudah Ada)   : ${results.skipped}`)
  console.log(`Gagal Diproses         : ${results.failed}`)
  console.log('='.repeat(70))

  return results
}

// CLI Execution entry point
if (process.argv[1]?.includes('import-activities')) {
  const isDryRun = process.argv.includes('--dry-run')
  const isForce = process.argv.includes('--force')

  importActivities({ dryRun: isDryRun, force: isForce })
    .then(() => {
      console.log('Eksekusi selesai dengan aman.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Fatal error saat eksekusi:', err)
      process.exit(1)
    })
}
