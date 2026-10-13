/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { slugField } from '../../lib/slug/slugField'
import { revalidateCollection } from '../hooks/revalidate'

export const Albums: CollectionConfig = {
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.eventDate && data?.eventEndDate) {
          if (new Date(data.eventEndDate) < new Date(data.eventDate)) {
            throw new Error('Tanggal selesai acara tidak boleh lebih awal daripada tanggal mulai.')
          }
        }
        return data
      },
    ],
    afterChange: [revalidateCollection('albums')],
    afterDelete: [revalidateCollection('albums')],
  },
  slug: 'albums',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'eventDate'],
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
        description: 'Judul album dokumentasi (contoh: Acara Tong Jiu Pia Tahun 2026).',
      },
    },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'cultural-celebration',
      options: [
        { label: 'Ritual Keagamaan', value: 'ritual' },
        { label: 'Sembahyang Leluhur', value: 'ancestral-worship' },
        { label: 'Hari Kebesaran Dewa', value: 'deity-festival' },
        { label: 'Perayaan Budaya', value: 'cultural-celebration' },
        { label: 'Kegiatan Sosial', value: 'social-activity' },
        { label: 'Dokumentasi Lainnya', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Kategori klasifikasi album.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Status publikasi album di website.',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Tanggal mulai pelaksanaan acara.',
      },
    },
    {
      name: 'eventEndDate',
      type: 'date',
      validate: (value: any, { siblingData, data }: any) => {
        const start = siblingData?.eventDate || data?.eventDate
        if (value && start && new Date(value) < new Date(start)) {
          return 'Tanggal selesai acara tidak boleh lebih awal daripada tanggal mulai.'
        }
        return true
      },
      admin: {
        position: 'sidebar',
        description: 'Tanggal selesai acara jika berlangsung beberapa hari (opsional).',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'gallery-media',
      admin: {
        position: 'sidebar',
        description: 'Gambar sampul utama album.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Tampilkan sebagai album sorotan / unggulan.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Keterangan atau narasi pengantar mengenai dokumentasi acara ini.',
      },
    },
    {
      name: 'mediaItems',
      type: 'array',
      admin: {
        description: 'Daftar foto dan video yang termasuk dalam album ini.',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'gallery-media',
          required: true,
          admin: {
            description: 'File foto atau video dari Pusat Media Galeri.',
          },
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          admin: {
            description: 'Keterangan khusus untuk item ini dalam album (opsional).',
          },
        },
        {
          name: 'sortOrder',
          type: 'number',
          admin: {
            description: 'Urutan tampil media.',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      localized: true,
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'gallery-media' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
