import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidate'

export const routeOptions = [
  { label: 'Beranda (Home)', value: 'home' },
  { label: 'Sejarah', value: 'sejarah' },
  { label: 'Tentang Kami', value: 'tentang-kami' },
  { label: 'Layanan', value: 'layanan' },
  { label: 'Kegiatan', value: 'kegiatan' },
  { label: 'Berita', value: 'berita' },
  { label: 'Galeri', value: 'galeri' },
  { label: 'Kontak', value: 'kontak' },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  hooks: {
    afterChange: [revalidateGlobal()],
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Halaman & Profil',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'tagline',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'site-media',
                },
              ],
            },
          ],
        },
        {
          label: 'Introduction',
          fields: [
            {
              name: 'introduction',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'History Section',
          fields: [
            {
              name: 'historySection',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'history-media',
                },
              ],
            },
          ],
        },
        {
          label: 'Uniqueness Section',
          fields: [
            {
              name: 'uniquenessSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'features',
                  type: 'array',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'site-media',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lists Sections',
          description: 'Pengaturan untuk bagian daftar Layanan, Kegiatan, dan Berita',
          fields: [
            {
              name: 'servicesSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
            {
              name: 'activitiesSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
            {
              name: 'newsSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Gallery & CTA',
          fields: [
            {
              name: 'gallerySection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
            {
              name: 'ctaSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
