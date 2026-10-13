/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { revalidateCollection } from '../hooks/revalidate'
import { preventDeleteUsedMedia } from '../../lib/media/preventDeleteUsedMedia'

export const GalleryMedia: CollectionConfig = {
  hooks: {
    beforeChange: [
      ({ data, req }: any) => {
        if (data?.mimeType) {
          if (data.mimeType.startsWith('video/')) {
            data.mediaType = 'video'
          } else if (data.mimeType.startsWith('image/')) {
            data.mediaType = 'image'
          }
        }
        return data
      },
    ],
    beforeDelete: [preventDeleteUsedMedia('gallery-media')],
    afterChange: [revalidateCollection('gallery')],
    afterDelete: [revalidateCollection('gallery')],
  },
  slug: 'gallery-media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  admin: {
    group: 'Pusat Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType', 'category', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Judul atau nama media dokumentasi.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Teks alternatif (alt text) untuk aksesibilitas dan SEO foto.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Keterangan atau konteks dokumentasi.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      admin: {
        description: 'Keterangan ringkas dwibahasa untuk tampilan lightbox/detail.',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Foto / Gambar', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
      admin: {
        description: 'Jenis media (otomatis terdeteksi berdasarkan MIME type file).',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Durasi video dalam detik (opsional).',
      },
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'gallery-media',
      admin: {
        description: 'Poster / thumbnail kustom untuk file video (opsional).',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Building', value: 'building' },
        { label: 'Interior', value: 'interior' },
        { label: 'Activities', value: 'activities' },
        { label: 'History', value: 'history' },
        { label: 'Traditions', value: 'traditions' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Kategori arsip media.',
      },
    },
  ],
  upload: {
    mimeTypes: [
      'image/*',
      'video/*',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
}
