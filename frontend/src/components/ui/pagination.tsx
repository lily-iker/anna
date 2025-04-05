'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i)
    }

    // Always show last page if there are more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    // Add ellipses where needed
    const result = []
    let prev = 0

    for (const page of pageNumbers) {
      if (page - prev > 1) {
        result.push(-1) // -1 represents ellipsis
      }
      result.push(page)
      prev = page
    }

    return result
  }

  const pageNumbers = getPageNumbers()

  // Handler that prevents clicking on the current page
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex justify-center mt-4">
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === -1 ? (
            // Ellipsis
            <span key={`ellipsis-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            // Page number button
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageClick(pageNumber)}
              disabled={disabled || pageNumber === currentPage}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          )
        )}

        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  )
}
