import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './src/payload/collections/Users'
import { Media } from './src/payload/collections/Media'
import { Posts } from './src/payload/collections/Posts'
import { Activities } from './src/payload/collections/Activities'
import { Services } from './src/payload/collections/Services'

import { History } from './src/payload/globals/History'
import { SiteSettings } from './src/payload/globals/SiteSettings'
import { ContactInformation } from './src/payload/globals/ContactInformation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  sharp,
  debug: process.env.NODE_ENV === 'development',
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Posts, Activities, Services],
  globals: [History, SiteSettings, ContactInformation],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-key-for-development',
  typescript: {
    outputFile: path.resolve(dirname, 'src/types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1/tek-hay-bio',
  }),
  localization: {
    locales: [
      { label: 'Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },
  cors: ['http://localhost:3000'],
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
