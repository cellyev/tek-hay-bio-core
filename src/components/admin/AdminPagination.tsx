import React from 'react'
import Link from 'next/link'

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null | undefined;
  nextPage: number | null | undefined;
  baseUrl: string;
  limit: number;
}

export function AdminPagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  prevPage,
  nextPage,
  baseUrl,
  limit
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
      <span className="text-sm text-slate-500">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex gap-2">
        {hasPrevPage && (
          <Link 
            href={`${baseUrl}?page=${prevPage}&limit=${limit}`} 
            className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
          >
            Sebelumnya
          </Link>
        )}
        {hasNextPage && (
          <Link 
            href={`${baseUrl}?page=${nextPage}&limit=${limit}`} 
            className="px-3 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
          >
            Selanjutnya
          </Link>
        )}
      </div>
    </div>
  )
}
