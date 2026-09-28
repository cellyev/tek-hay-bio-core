import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect, notFound } from 'next/navigation'
import { NewsForm } from '@/components/admin/NewsForm'

export const dynamic = 'force-dynamic'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  try {
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Berita</h1>
          <p className="text-sm text-slate-500">Perbarui artikel berita yang sudah ada.</p>
        </div>
        
        <NewsForm initialData={post} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
