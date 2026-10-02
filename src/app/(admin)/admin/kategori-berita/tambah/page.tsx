import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CategoryForm } from '@/components/admin/CategoryForm'

export default function AddCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/kategori-berita" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Kategori Baru</h1>
          <p className="text-slate-500 mt-1">Buat kategori berita baru.</p>
        </div>
      </div>
      
      <CategoryForm />
    </div>
  )
}
