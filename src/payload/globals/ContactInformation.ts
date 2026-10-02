/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidate'

export const ContactInformation: GlobalConfig = {
  slug: 'contact-information',
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
    { name: 'address', type: 'textarea', localized: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'googleMapsUrl', type: 'text', admin: { description: 'Tautan langsung ke Google Maps (misal: https://maps.app.goo.gl/...)' } },
    { name: 'googleMapsEmbedCode', type: 'textarea', admin: { description: 'Tempel (paste) kode <iframe> Embed dari Google Maps di sini agar tampilan peta persis seperti yang Anda inginkan.' } },
    { name: 'latitude', type: 'text' },
    { name: 'longitude', type: 'text' },
    {
      name: 'socialMedia',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    { name: 'visitingHours', type: 'textarea', localized: true },
  ],
}
