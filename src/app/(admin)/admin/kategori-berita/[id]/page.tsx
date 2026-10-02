import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowLeft } from 'lucide-react'
import { CategoryForm } from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })
  
  let data
  try {
    data = await payload.findByID({
      collection: 'categories',
      id: resolvedParams.id,
      depth: 1
    })
  } catch (error) {
    notFound()
  }

  if (!data) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/kategori-berita" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Kategori</h1>
          <p className="text-slate-500 mt-1">Ubah data kategori berita.</p>
        </div>
      </div>
      
      <CategoryForm initialData={data} />
    </div>
  )
}
