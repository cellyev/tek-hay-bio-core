import React from 'react'
import { Container } from './Layout'

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="py-24 text-center">
      <Container>
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-stone-400">?</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">{title}</h3>
          <p className="text-stone-500">{message}</p>
        </div>
      </Container>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="py-24 flex justify-center items-center min-h-[40vh]">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-stone-500 font-medium tracking-widest uppercase">Memuat...</p>
      </div>
    </div>
  )
}

export function ErrorState({ title = 'Terjadi Kesalahan', message = 'Mohon maaf, halaman atau data yang Anda cari tidak dapat dimuat saat ini. Silakan coba lagi nanti.' }: { title?: string; message?: string }) {
  return (
    <div className="py-24 text-center">
      <Container>
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 font-bold">!</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">{title}</h3>
          <p className="text-stone-600">{message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors text-sm"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </Container>
    </div>
  )
}
