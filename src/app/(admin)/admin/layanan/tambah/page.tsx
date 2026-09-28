import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { ServicesForm } from '@/components/admin/ServicesForm'

export const dynamic = 'force-dynamic'

export default async function AddServicePage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Tambah Layanan</h1></div>
      <ServicesForm />
    </div>
  )
}