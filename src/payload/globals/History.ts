/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidate'

export const History: GlobalConfig = {
  slug: 'history',
  hooks: {
    afterChange: [revalidateGlobal()],
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        { name: 'year', type: 'text' },
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'history-media' },
        { 
          name: 'verificationStatus', 
          type: 'select',
          options: [
            { label: 'Verified', value: 'verified' },
            { label: 'Under Research', value: 'under_research' },
          ],
          defaultValue: 'verified'
        }
      ],
    },
  ],
}
