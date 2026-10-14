'use client'

import React, { Suspense, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPageNumbers } from '@/components/ui/Pagination'

export interface AdminPaginationProps {
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null | undefined
  nextPage: number | null | undefined
  baseUrl: string
  limit: number
  totalDocs?: number
  itemName?: string
  pageSizeOptions?: number[]
}

function AdminPaginationContent({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  prevPage,
  nextPage,
  baseUrl,
  limit,
  totalDocs,
  itemName = 'data',
  pageSizeOptions = [10, 20, 50, 100],
}: AdminPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Calculate item range
  const hasTotalDocs = typeof totalDocs === 'number'
  const start = hasTotalDocs ? (totalDocs === 0 ? 0 : (page - 1) * limit + 1) : (page - 1) * limit + 1
  const end = hasTotalDocs ? Math.min(page * limit, totalDocs) : page * limit

  // Prepare page options
  const options = Array.from(new Set([...pageSizeOptions, limit])).sort((a, b) => a - b)
  const pageNumbers = getPageNumbers(page, totalPages)

  const getPageUrl = (targetPage: number) => {
    // If baseUrl contains query params, parse them
    let targetBase = baseUrl || pathname
    const baseSearchParams = new URLSearchParams()

    if (targetBase.includes('?')) {
      const [path, query] = targetBase.split('?')
      targetBase = path
      const parsed = new URLSearchParams(query)
      parsed.forEach((val, key) => baseSearchParams.set(key, val))
    }

    // Merge searchParams from URL
    if (searchParams) {
      searchParams.forEach((val, key) => {
        baseSearchParams.set(key, val)
      })
    }

    baseSearchParams.set('page', String(targetPage))
    baseSearchParams.set('limit', String(limit))

    return `${targetBase}?${baseSearchParams.toString()}`
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10)
    let targetBase = baseUrl || pathname
    const baseSearchParams = new URLSearchParams()

    if (targetBase.includes('?')) {
      const [path, query] = targetBase.split('?')
      targetBase = path
      const parsed = new URLSearchParams(query)
      parsed.forEach((val, key) => baseSearchParams.set(key, val))
    }

    if (searchParams) {
      searchParams.forEach((val, key) => {
        baseSearchParams.set(key, val)
      })
    }

    baseSearchParams.set('limit', String(newLimit))
    baseSearchParams.set('page', '1') // Reset to page 1

    const finalUrl = `${targetBase}?${baseSearchParams.toString()}`
    startTransition(() => {
      router.push(finalUrl)
    })
  }

  // If no items at all and no pages
  if (hasTotalDocs && totalDocs === 0) {
    return (
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-500">
        <span>Tidak ada {itemName} untuk ditampilkan</span>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
      {/* Summary Info (Image 1 reference) */}
      <div className="text-sm text-slate-600">
        {hasTotalDocs ? (
          <>
            Menampilkan <span className="font-medium text-slate-900">{start}-{end}</span> dari{' '}
            <span className="font-medium text-slate-900">{totalDocs}</span> {itemName}
          </>
        ) : (
          <>
            Halaman <span className="font-medium text-slate-900">{page}</span> dari{' '}
            <span className="font-medium text-slate-900">{totalPages}</span>
          </>
        )}
      </div>

      {/* Page Navigation Buttons (Image 2 reference) */}
      <div className="flex items-center justify-center gap-1.5">
        {/* Prev Button */}
        {hasPrevPage && prevPage ? (
          <Link
            href={getPageUrl(prevPage)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm"
            title="Sebelumnya"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </Link>
        ) : (
          <span
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-medium select-none"
                >
                  ...
                </span>
              )
            }

            const isCurrent = p === page

            return isCurrent ? (
              <span
                key={p}
                aria-current="page"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 text-white text-xs font-semibold shadow-sm select-none"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={getPageUrl(p)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 text-xs font-medium transition-colors shadow-sm"
              >
                {p}
              </Link>
            )
          })}
        </div>

        {/* Next Button */}
        {hasNextPage && nextPage ? (
          <Link
            href={getPageUrl(nextPage)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm"
            title="Selanjutnya"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </Link>
        ) : (
          <span
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </span>
        )}
      </div>

      {/* Page Size Selector (Image 1 reference) */}
      <div className="flex items-center gap-2 text-sm text-slate-600 justify-end">
        <label htmlFor="admin-limit-select" className="text-sm font-medium text-slate-600">
          Tampilkan:
        </label>
        <select
          id="admin-limit-select"
          value={limit}
          onChange={handleLimitChange}
          aria-label="Jumlah data per halaman"
          className="border border-slate-300 rounded-md bg-white px-2.5 py-1 text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer shadow-sm hover:border-slate-400 transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function AdminPagination(props: AdminPaginationProps) {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-500">
          <span>Memuat navigasi...</span>
        </div>
      }
    >
      <AdminPaginationContent {...props} />
    </Suspense>
  )
}
