/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { slugField } from '../../lib/slug/slugField'

import { revalidateCollection } from '../hooks/revalidate'

export const Services: CollectionConfig = {
  hooks: {
    afterChange: [revalidateCollection('services')],
    afterDelete: [revalidateCollection('services')],
  },
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'sortOrder'],
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
    },
    slugField(),
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'service-media',
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
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
      },
    },
  ],
}
