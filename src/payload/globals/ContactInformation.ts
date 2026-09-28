import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const ContactInformation: GlobalConfig = {
  slug: 'contact-information',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    { name: 'address', type: 'textarea', localized: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'googleMapsUrl', type: 'text' },
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
