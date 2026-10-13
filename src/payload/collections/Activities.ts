/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { slugField } from '../../lib/slug/slugField'
import { revalidateCollection } from '../hooks/revalidate'

export const Activities: CollectionConfig = {
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.date && data?.endDate) {
          if (new Date(data.endDate) < new Date(data.date)) {
            throw new Error('Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.')
          }
        }
        return data
      },
    ],
    afterChange: [revalidateCollection('activities')],
    afterDelete: [revalidateCollection('activities')],
  },
  slug: 'activities',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'scheduleStatus', 'status', 'date'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Nama atau judul agenda kegiatan.',
      },
    },
    slugField(),

    // --- Kategori & Pola Pengulangan ---
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'ritual',
      options: [
        { label: 'Ritual Keagamaan', value: 'ritual' },
        { label: 'Sembahyang Leluhur', value: 'ancestral-worship' },
        { label: 'Hari Kebesaran Dewa', value: 'deity-festival' },
        { label: 'Perayaan Budaya', value: 'cultural-celebration' },
        { label: 'Kegiatan Sosial', value: 'social-activity' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Klasifikasi kegiatan yang terstruktur.',
      },
    },
    {
      name: 'recurrenceType',
      type: 'select',
      required: true,
      defaultValue: 'annual-lunar',
      options: [
        { label: 'Tahunan (Kalender Imlek)', value: 'annual-lunar' },
        { label: 'Tahunan (Kalender Masehi)', value: 'annual-gregorian' },
        { label: 'Periode Tertentu', value: 'periodic' },
        { label: 'Satu Kali Pelaksanaan', value: 'one-time' },
        { label: 'Insidental / Kondisional', value: 'incidental' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pola perulangan atau acuan kalender kegiatan.',
      },
    },
    {
      name: 'scheduleStatus',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Jadwal Ditetapkan', value: 'scheduled' },
        { label: 'Menunggu Konfirmasi / Tentatif', value: 'tentative' },
        { label: 'Jadwal Diubah (Rescheduled)', value: 'rescheduled' },
        { label: 'Belum Ditentukan', value: 'unscheduled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Status kepastian jadwal dari pengurus klenteng.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Status publikasi di website.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'activity-media',
      admin: {
        position: 'sidebar',
        description: 'Poster atau foto utama kegiatan.',
      },
    },

    // --- Waktu Kalender Masehi (Sidebar) ---
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Tanggal/waktu mulai kalender Masehi (kosongkan jika belum dijadwalkan).',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      validate: (value: any, { siblingData, data }: any) => {
        const start = siblingData?.date || data?.date
        if (value && start && new Date(value) < new Date(start)) {
          return 'Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.'
        }
        return true
      },
      admin: {
        position: 'sidebar',
        description: 'Tanggal/waktu selesai kalender Masehi jika berlangsung beberapa hari.',
      },
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Tahun pelaksanaan (opsional).',
      },
    },

    // --- Informasi Deskripsi Dasar ---
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Ringkasan singkat untuk tampilan kartu atau pratinjau.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Deskripsi lengkap dan narasi kegiatan.',
      },
    },

    // --- Detail Kalender Imlek & Aturan Periode ---
    {
      name: 'lunarRuleType',
      type: 'select',
      defaultValue: 'exact_date',
      options: [
        { label: 'Tanggal Tetap Imlek', value: 'exact_date' },
        { label: 'Paruh Pertama Bulan (Tgl 1–15)', value: 'first_half' },
        { label: 'Paruh Kedua Bulan (Tgl 16–30)', value: 'second_half' },
        { label: 'Aturan Periode Khusus / Rentang', value: 'custom_period' },
        { label: 'Tidak Menggunakan Kalender Imlek', value: 'none' },
      ],
      admin: {
        description: 'Pola penanggalan kalender Imlek (Lunar).',
      },
    },
    {
      name: 'lunarDay',
      type: 'number',
      min: 1,
      max: 30,
      validate: (val: any) => {
        if (val !== undefined && val !== null && val !== '') {
          const num = Number(val)
          if (isNaN(num) || num < 1 || num > 30) {
            return 'Tanggal Imlek harus antara 1 dan 30.'
          }
        }
        return true
      },
      admin: {
        description: 'Tanggal Imlek (1 s/d 30, opsional jika periode khusus).',
      },
    },
    {
      name: 'lunarMonth',
      type: 'number',
      min: 1,
      max: 12,
      validate: (val: any) => {
        if (val !== undefined && val !== null && val !== '') {
          const num = Number(val)
          if (isNaN(num) || num < 1 || num > 12) {
            return 'Bulan Imlek harus antara 1 dan 12.'
          }
        }
        return true
      },
      admin: {
        description: 'Bulan Imlek (1 s/d 12).',
      },
    },
    {
      name: 'isLeapMonth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Tandai jika jatuh pada bulan kabisat lunar (Runyue / 闰月).',
      },
    },
    {
      name: 'lunarPeriodDescription',
      type: 'text',
      localized: true,
      admin: {
        description: 'Deskripsi aturan penanggalan (misal: "Sepuluh hari sebelum dan sesudah 5 April untuk Ceng Beng").',
      },
    },

    // --- Catatan Jadwal & Reschedule ---
    {
      name: 'scheduleNote',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Keterangan jadwal (misal: perkiraan tanggal atau catatan keputusan pengurus).',
      },
    },
    {
      name: 'rescheduledNote',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Keterangan alasan atau rincian jika jadwal mengalami perubahan.',
      },
    },

    // --- Dewa atau Tokoh Terkait ---
    {
      name: 'relatedDeity',
      type: 'text',
      localized: true,
      admin: {
        description: 'Nama Dewa, Kongco, atau Tokoh terkait (misal: "Tek Hay Cin Jin", "Kwan Im Po Sat").',
      },
    },
    {
      name: 'deityRole',
      type: 'text',
      localized: true,
      admin: {
        description: 'Keterkaitan atau peran Dewa dalam upacara ini (opsional).',
      },
    },

    // --- Makna, Tradisi & Rangkaian Acara ---
    {
      name: 'ritualMeaning',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Makna spiritual atau tujuan dari ritual / perayaan.',
      },
    },
    {
      name: 'traditionExplanation',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Penjelasan latar belakang tradisi dan nilai budaya yang dilestarikan.',
      },
    },
    {
      name: 'eventSequence',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Rangkaian kegiatan, tahapan sembahyang, atau susunan acara.',
      },
    },
    {
      name: 'managementNotes',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Catatan tambahan resmi dari pengurus klenteng.',
      },
    },

    // --- Lokasi Kegiatan ---
    {
      name: 'locationType',
      type: 'select',
      defaultValue: 'internal',
      options: [
        { label: 'Klenteng Tek Hay Bio (Internal)', value: 'internal' },
        { label: 'Lokasi Lain / Eksternal', value: 'external' },
        { label: 'Gabungan (Internal & Eksternal)', value: 'hybrid' },
      ],
      admin: {
        description: 'Cakupan lokasi pelaksanaan kegiatan.',
      },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      admin: {
        description: 'Nama tempat atau nama klenteng lokasi pelaksanaan.',
      },
    },
    {
      name: 'locationAddress',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Alamat lengkap atau panduan menuju lokasi acara.',
      },
    },
    {
      name: 'locationRelationship',
      type: 'text',
      localized: true,
      admin: {
        description: 'Catatan hubungan dengan lokasi eksternal (jika telah dikonfirmasi).',
      },
    },

    // --- Informasi Partisipasi Umat ---
    {
      name: 'participationDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Penjelasan umum keikutsertaan umat (opsional).',
      },
    },
    {
      name: 'candleDonationInfo',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Informasi donasi pelita / lilin sembahyang (terbuka untuk umum).',
      },
    },
    {
      name: 'lanternDonationInfo',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Informasi donasi lampion berkah (terbuka untuk umum).',
      },
    },
    {
      name: 'requiredEquipment',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Perlengkapan sembahyang atau pakaian yang dianjurkan dibawa umat.',
      },
    },
    {
      name: 'participationInstructions',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Tata tertib dan instruksi pelaksanaan ibadah.',
      },
    },
    {
      name: 'contactInfo',
      type: 'text',
      localized: true,
      admin: {
        description: 'Kontak sekretariat atau narahubung informasi kegiatan.',
      },
    },

    // --- SEO ---
    {
      name: 'seo',
      type: 'group',
      localized: true,
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'activity-media' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
