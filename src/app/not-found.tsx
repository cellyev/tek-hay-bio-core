import React from 'react'
import Link from 'next/link'
import './globals.css'

export default function NotFound() {
  return (
    <html lang="id">
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-900 text-center">
          <h1 className="text-4xl font-bold mb-4">Halaman tidak ditemukan</h1>
          <p className="mb-8 text-lg">Informasi yang Anda cari tidak tersedia.</p>
          <Link href="/id" className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
            Kembali ke Beranda
          </Link>
        </main>
      </body>
    </html>
  )
}
