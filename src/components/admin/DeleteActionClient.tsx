'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface Props {
  id: string | number
  action: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function DeleteActionClient({ id, action }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Hapus data ini? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(true)
    try {
      const res = await action(String(id))
      if (!res?.success) {
        window.alert('Gagal menghapus: ' + (res?.error || 'Kesalahan tidak diketahui'))
        setIsDeleting(false)
      }
    } catch (err: any) {
      window.alert('Terjadi kesalahan: ' + err.message)
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
