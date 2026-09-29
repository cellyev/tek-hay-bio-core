/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Access, PayloadRequest } from 'payload'

export const isAdmin = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return Boolean(user?.role === 'super_admin')
}

export const isAdminOrEditor = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return Boolean(user?.role === 'super_admin' || user?.role === 'editor')
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.role === 'super_admin') {
    return true
  }
  
  if (user) {
    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}
