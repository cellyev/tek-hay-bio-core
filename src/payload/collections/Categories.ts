import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { slugField } from '../../lib/slug/slugField'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
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
      name: 'description',
      type: 'textarea',
      localized: true,
    }
  ],
}
