import type { CollectionConfig } from 'payload';
import { isAdminOrEditor } from '../access/roles';
import { preventDeleteUsedMedia } from '../../lib/media/preventDeleteUsedMedia';

export const HistoryMedia: CollectionConfig = {
  slug: 'history-media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'alt', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    
  ],
  hooks: {
    beforeDelete: [preventDeleteUsedMedia('history-media')],
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
  },
};
