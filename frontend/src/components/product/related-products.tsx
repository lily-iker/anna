'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/types'
import { Button } from '@/components/ui/button'
import ProductCard from '../product-card'

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  // Initialize with null, will be set properly in useEffect
  const [visibleCount, setVisibleCount] = useState<number | null>(null)
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg'>('lg')

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setScreenSize('lg')
        setVisibleCount((prev) => (prev === null ? 4 : prev <= 4 ? 4 : prev))
      } else if (width >= 768) {
        setScreenSize('md')
        setVisibleCount((prev) => (prev === null ? 3 : prev <= 3 ? 3 : prev))
      } else {
        setScreenSize('sm')
        setVisibleCount((prev) => (prev === null ? 2 : prev <= 2 ? 2 : prev))
      }
    }

    updateScreenSize()

    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateScreenSize, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const displayedProducts = useMemo(() => {
    // Default to appropriate number if visibleCount is null
    const count = visibleCount ?? (screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2)
    return products.slice(0, count)
  }, [products, visibleCount, screenSize])

  const showViewMore = useMemo(() => {
    const count = visibleCount ?? (screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2)
    return products.length > count && count < 12
  }, [products.length, visibleCount, screenSize])

  const handleViewMore = () => {
    const increment = screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2

    // Get current count, defaulting to screen-appropriate value if null
    const currentCount = visibleCount ?? (screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2)

    setVisibleCount(Math.min(currentCount + increment, 12))
  }

  if (!products || products.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium border-b pb-2 mb-6 text-green-600">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showViewMore && (
        <div className="my-8 flex justify-center">
          <Button
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={handleViewMore}
          >
            Xem thêm sản phẩm
          </Button>
        </div>
      )}
    </div>
  )
}
