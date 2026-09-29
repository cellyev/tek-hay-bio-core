import type { Field } from 'payload'
import { formatSlug } from './formatSlug'

export const slugField = (fieldToUse: string = 'title'): Field => {
  return {
    name: 'slug',
    type: 'text',
    localized: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
    },
    hooks: {
      beforeValidate: [
        async ({ value, originalDoc, data, req, operation, collection }) => {
          // If a manual slug is provided, we just format it and let standard validation handle uniqueness
          if (value && typeof value === 'string') {
            const formatted = formatSlug(value)
            
            // Allow manual updates to the same slug (Payload's unique constraint handles the rest)
            return formatted
          }

          // If no slug provided (empty string or undefined)
          if (operation === 'create' || (operation === 'update' && !value)) {
            const fallbackData = data?.[fieldToUse] || originalDoc?.[fieldToUse]
            if (fallbackData && typeof fallbackData === 'string') {
              const formattedFallback = formatSlug(fallbackData)
              let currentSlug = formattedFallback
              let counter = 1
              let isUnique = false

              // Check for uniqueness in the database
              while (!isUnique) {
                const collectionSlug = collection?.slug
                if (!collectionSlug) break

                const queryWhere: any = {
                  slug: {
                    equals: currentSlug,
                  },
                }

                // Exclude current document ID from uniqueness check if updating
                if (originalDoc?.id) {
                  queryWhere.id = { not_equals: originalDoc.id }
                }

                const query = await req.payload.find({
                  collection: collectionSlug as any,
                  where: queryWhere,
                  limit: 1,
                  locale: req.locale,
                  req,
                })

                if (query.totalDocs === 0) {
                  isUnique = true
                } else {
                  currentSlug = `${formattedFallback}-${counter}`
                  counter++
                }
              }

              return currentSlug
            }
          }

          // Keep existing slug for updates if no new title generation is triggered
          if (operation === 'update' && originalDoc?.slug) {
            return originalDoc.slug
          }

          return value
        },
      ],
    },
  }
}
