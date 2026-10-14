'use client'

import React, { Suspense, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationToolbarProps {
  currentPage: number
  totalDocs: number
  limit: number
  locale?: 'id' | 'en'
  itemName?: string
  pageSizeOptions?: number[]
  baseUrl?: string
  className?: string
}

export interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl?: string
  limit?: number
  totalDocs?: number
  locale?: 'id' | 'en'
  itemName?: string
  pageSizeOptions?: number[]
  className?: string
  showToolbarAtBottom?: boolean
}

// Windowing helper to generate page number array with ellipsis
export function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 1) return [1]
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // When current page is near the start
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }

  // When current page is near the end
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  // When current page is in the middle
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

function PaginationToolbarContent({
  currentPage,
  totalDocs,
  limit,
  locale = 'id',
  itemName,
  pageSizeOptions = [6, 9, 12, 18],
  baseUrl,
  className = '',
}: PaginationToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  if (totalDocs <= 0) return null

  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, totalDocs)
  const defaultItemName = locale === 'id' ? 'item' : 'items'
  const displayItemName = itemName || defaultItemName

  // Ensure current limit is present in options and sorted
  const options = Array.from(new Set([...pageSizeOptions, limit])).sort((a, b) => a - b)

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10)
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.set('limit', String(newLimit))
    params.set('page', '1') // reset to page 1 on limit change

    const targetUrl = `${baseUrl || pathname}?${params.toString()}`
    startTransition(() => {
      router.push(targetUrl)
    })
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-2 text-stone-600 text-sm ${className}`}
    >
      <div className="text-stone-600">
        {locale === 'id' ? 'Menampilkan' : 'Showing'}{' '}
        <span className="font-medium text-stone-900">
          {start}-{end}
        </span>{' '}
        {locale === 'id' ? 'dari' : 'of'}{' '}
        <span className="font-medium text-stone-900">{totalDocs}</span>{' '}
        <span>{displayItemName}</span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="limit-select" className="text-stone-600 text-sm font-medium">
          {locale === 'id' ? 'Tampilkan:' : 'Show:'}
        </label>
        <select
          id="limit-select"
          value={limit}
          onChange={handleLimitChange}
          aria-label={locale === 'id' ? 'Jumlah item per halaman' : 'Items per page'}
          className="border border-stone-300 rounded-md bg-white px-2.5 py-1 text-sm font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 cursor-pointer shadow-sm hover:border-stone-400 transition-colors"
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

export function PaginationToolbar(props: PaginationToolbarProps) {
  return (
    <Suspense
      fallback={
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-2 text-stone-600 text-sm ${props.className || ''}`}>
          <div>
            {props.locale === 'en' ? 'Showing items' : 'Menampilkan item'}
          </div>
        </div>
      }
    >
      <PaginationToolbarContent {...props} />
    </Suspense>
  )
}

function PaginationContent({
  totalPages,
  currentPage,
  baseUrl,
  limit,
  totalDocs,
  locale = 'id',
  itemName,
  pageSizeOptions = [6, 9, 12, 18],
  className = '',
  showToolbarAtBottom = false,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Build target page URL preserving other search params
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.set('page', String(page))
    if (limit) {
      params.set('limit', String(limit))
    }
    return `${baseUrl || pathname}?${params.toString()}`
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10)
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.set('limit', String(newLimit))
    params.set('page', '1')

    const targetUrl = `${baseUrl || pathname}?${params.toString()}`
    startTransition(() => {
      router.push(targetUrl)
    })
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages)
  const options = limit
    ? Array.from(new Set([...pageSizeOptions, limit])).sort((a, b) => a - b)
    : pageSizeOptions

  const start = limit && totalDocs ? (currentPage - 1) * limit + 1 : 1
  const end = limit && totalDocs ? Math.min(currentPage * limit, totalDocs) : totalDocs || 0
  const displayItemName = itemName || (locale === 'id' ? 'item' : 'items')

  return (
    <div className={`mt-12 mb-4 space-y-4 ${className}`}>
      {/* Optional bottom toolbar if requested */}
      {showToolbarAtBottom && typeof totalDocs === 'number' && typeof limit === 'number' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-stone-600 text-sm pt-4 border-t border-stone-200">
          <div>
            {locale === 'id' ? 'Menampilkan' : 'Showing'}{' '}
            <span className="font-medium text-stone-900">
              {start}-{end}
            </span>{' '}
            {locale === 'id' ? 'dari' : 'of'}{' '}
            <span className="font-medium text-stone-900">{totalDocs}</span>{' '}
            <span>{displayItemName}</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="bottom-limit-select" className="text-stone-600 text-sm font-medium">
              {locale === 'id' ? 'Tampilkan:' : 'Show:'}
            </label>
            <select
              id="bottom-limit-select"
              value={limit}
              onChange={handleLimitChange}
              aria-label={locale === 'id' ? 'Jumlah item per halaman' : 'Items per page'}
              className="border border-stone-300 rounded-md bg-white px-2.5 py-1 text-sm font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 cursor-pointer shadow-sm hover:border-stone-400 transition-colors"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation Buttons: [ < ] [ 1 ] [ 2 ] [ > ] */}
      <div className="flex justify-center items-center gap-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-400 hover:text-stone-900 transition-colors shadow-sm"
            aria-label={locale === 'id' ? 'Halaman sebelumnya' : 'Previous page'}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </Link>
        ) : (
          <span
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-200 bg-stone-50/70 text-stone-300 cursor-not-allowed shadow-none"
            aria-disabled="true"
            aria-label={locale === 'id' ? 'Halaman sebelumnya' : 'Previous page'}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </span>
        )}

        {/* Page Number Buttons */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-stone-400 text-sm font-medium select-none"
                >
                  ...
                </span>
              )
            }

            const isCurrent = page === currentPage

            return isCurrent ? (
              <span
                key={page}
                aria-current="page"
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-900 bg-stone-900 text-white text-sm font-semibold shadow-sm select-none"
              >
                {page}
              </span>
            ) : (
              <Link
                key={page}
                href={getPageUrl(page)}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-400 hover:text-stone-900 text-sm font-medium transition-colors shadow-sm"
              >
                {page}
              </Link>
            )
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-400 hover:text-stone-900 transition-colors shadow-sm"
            aria-label={locale === 'id' ? 'Halaman selanjutnya' : 'Next page'}
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </Link>
        ) : (
          <span
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-stone-200 bg-stone-50/70 text-stone-300 cursor-not-allowed shadow-none"
            aria-disabled="true"
            aria-label={locale === 'id' ? 'Halaman selanjutnya' : 'Next page'}
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </span>
        )}
      </div>
    </div>
  )
}

export function Pagination(props: PaginationProps) {
  return (
    <Suspense
      fallback={
        <div className={`mt-12 mb-4 flex justify-center items-center gap-2 ${props.className || ''}`}>
          <span className="w-9 h-9 flex items-center justify-center rounded-md border border-stone-200 bg-stone-900 text-white text-sm font-semibold">
            {props.currentPage || 1}
          </span>
        </div>
      }
    >
      <PaginationContent {...props} />
    </Suspense>
  )
}
