import test from 'node:test'
import assert from 'node:assert/strict'
import { getPageNumbers } from '../../src/components/ui/Pagination.tsx'

test('Pagination: Page number windowing logic matches requirements', () => {
  // Case 1: Single page
  assert.deepEqual(getPageNumbers(1, 1), [1])

  // Case 2: 2 pages (like reference image: [ < ] [ 1 ] [ 2 ] [ > ])
  assert.deepEqual(getPageNumbers(1, 2), [1, 2])
  assert.deepEqual(getPageNumbers(2, 2), [1, 2])

  // Case 3: Up to 5 pages shows all pages
  assert.deepEqual(getPageNumbers(1, 3), [1, 2, 3])
  assert.deepEqual(getPageNumbers(2, 4), [1, 2, 3, 4])
  assert.deepEqual(getPageNumbers(3, 5), [1, 2, 3, 4, 5])

  // Case 4: Near start when totalPages > 5
  assert.deepEqual(getPageNumbers(1, 10), [1, 2, 3, 4, '...', 10])
  assert.deepEqual(getPageNumbers(2, 10), [1, 2, 3, 4, '...', 10])
  assert.deepEqual(getPageNumbers(3, 10), [1, 2, 3, 4, '...', 10])

  // Case 5: In middle when totalPages > 5
  assert.deepEqual(getPageNumbers(5, 10), [1, '...', 4, 5, 6, '...', 10])
  assert.deepEqual(getPageNumbers(6, 10), [1, '...', 5, 6, 7, '...', 10])

  // Case 6: Near end when totalPages > 5
  assert.deepEqual(getPageNumbers(8, 10), [1, '...', 7, 8, 9, 10])
  assert.deepEqual(getPageNumbers(10, 10), [1, '...', 7, 8, 9, 10])
})

test('Pagination: Item range calculation matches Reference Image 1', () => {
  // Reference Image 1: Menampilkan 1-8 dari 10 produk
  const calculateRange = (page, limit, totalDocs) => {
    if (totalDocs === 0) return { start: 0, end: 0 }
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, totalDocs)
    return { start, end }
  }

  // Exact reference case: 10 items, 8 per page, page 1
  assert.deepEqual(calculateRange(1, 8, 10), { start: 1, end: 8 })

  // Page 2 of same reference:
  assert.deepEqual(calculateRange(2, 8, 10), { start: 9, end: 10 })

  // Berita: 24 items, limit 9, page 1
  assert.deepEqual(calculateRange(1, 9, 24), { start: 1, end: 9 })
  // Berita: page 2
  assert.deepEqual(calculateRange(2, 9, 24), { start: 10, end: 18 })
  // Berita: page 3
  assert.deepEqual(calculateRange(3, 9, 24), { start: 19, end: 24 })

  // Zero items
  assert.deepEqual(calculateRange(1, 10, 0), { start: 0, end: 0 })
})

test('Pagination: Page size options sorting and deduplication', () => {
  const getOptions = (pageSizeOptions, currentLimit) => {
    return Array.from(new Set([...pageSizeOptions, currentLimit])).sort((a, b) => a - b)
  }

  // Standard case (Image 1 options: 8, 12, 16)
  assert.deepEqual(getOptions([8, 12, 16], 8), [8, 12, 16])

  // Non-standard limit injected from URL query param
  assert.deepEqual(getOptions([6, 9, 12, 18], 15), [6, 9, 12, 15, 18])
  assert.deepEqual(getOptions([6, 9, 12, 18], 9), [6, 9, 12, 18])
})
