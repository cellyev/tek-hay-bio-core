import React from 'react'
import Link from 'next/link'

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  limit: number;
}

export function Pagination({ totalPages, currentPage, baseUrl, limit }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}&limit=${limit}`}
          className="px-4 py-2 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors text-stone-600 font-medium text-sm"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 border border-stone-200 rounded-md bg-stone-50 text-stone-400 font-medium text-sm cursor-not-allowed">
          Previous
        </span>
      )}

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}&limit=${limit}`}
            className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}&limit=${limit}`}
          className="px-4 py-2 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors text-stone-600 font-medium text-sm"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 border border-stone-200 rounded-md bg-stone-50 text-stone-400 font-medium text-sm cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}
