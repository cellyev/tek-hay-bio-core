/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: {
    afterChange: [revalidateGlobal()],
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Pengaturan & Sistem',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'site-media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'site-media',
    },
    {
      name: 'defaultSocialImage',
      type: 'upload',
      relationTo: 'site-media',
    },
  ],
}
