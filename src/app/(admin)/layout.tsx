import React from 'react'
import '../globals.css'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 font-sans">
        <AdminShell user={user}>
          {children}
        </AdminShell>
      </body>
    </html>
  )
}
