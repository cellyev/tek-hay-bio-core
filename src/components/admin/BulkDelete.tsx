'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Trash2 } from 'lucide-react'

interface BulkDeleteContextType {
  selectedIds: string[]
  toggleId: (id: string) => void
  toggleAll: (ids: string[]) => void
  clear: () => void
  isDeleting: boolean
  setIsDeleting: (v: boolean) => void
}

const BulkDeleteContext = createContext<BulkDeleteContextType | null>(null)

export function BulkDeleteProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleAll = (ids: string[]) => {
    if (ids.length > 0 && selectedIds.length === ids.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(ids)
    }
  }

  return (
    <BulkDeleteContext.Provider value={{ selectedIds, toggleId, toggleAll, clear: () => setSelectedIds([]), isDeleting, setIsDeleting }}>
      {children}
    </BulkDeleteContext.Provider>
  )
}

export function useBulkDelete() {
  const ctx = useContext(BulkDeleteContext)
  if (!ctx) throw new Error('useBulkDelete must be used within BulkDeleteProvider')
  return ctx
}

export function BulkDeleteCheckbox({ id }: { id: string | number }) {
  const { selectedIds, toggleId } = useBulkDelete()
  const stringId = String(id)
  return (
    <input 
      type="checkbox" 
      checked={selectedIds.includes(stringId)} 
      onChange={() => toggleId(stringId)}
      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
    />
  )
}

export function BulkDeleteSelectAll({ allIds }: { allIds: (string | number)[] }) {
  const { selectedIds, toggleAll } = useBulkDelete()
  const ids = allIds.map(String)
  const isAllSelected = ids.length > 0 && selectedIds.length === ids.length
  
  return (
    <input 
      type="checkbox" 
      checked={isAllSelected}
      onChange={() => toggleAll(ids)}
      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
    />
  )
}

export function BulkDeleteButton({ action }: { action: (ids: string[]) => Promise<{ success: boolean; error?: string }> }) {
  const { selectedIds, clear, isDeleting, setIsDeleting } = useBulkDelete()

  if (selectedIds.length === 0) return null

  const handleDelete = async () => {
    if (!window.confirm(`Hapus ${selectedIds.length} data terpilih? Tindakan ini tidak dapat dibatalkan.`)) return
    
    setIsDeleting(true)
    try {
      const res = await action(selectedIds)
      if (!res?.success) {
        window.alert('Gagal menghapus data: ' + (res?.error || 'Kesalahan tidak diketahui'))
      } else {
        clear()
      }
    } catch (err: any) {
      window.alert('Terjadi kesalahan: ' + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium shrink-0 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? 'Menghapus...' : `Hapus (${selectedIds.length})`}
    </button>
  )
}
