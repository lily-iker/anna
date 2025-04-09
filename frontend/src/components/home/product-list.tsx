'use client'

import { useState, useEffect, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import ProductCard from '@/components/product-card'

interface ProductListProps {
  title: string
  products: Product[]
}

// Memoize the ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard)

export default function ProductList({ title, products }: ProductListProps) {
  // Initialize with a default, will be updated in useEffect
  const [visibleProducts, setVisibleProducts] = useState(4)
  const [screenSize, setScreenSize] = useState('lg')

  // Set initial screen size and update when window resizes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setScreenSize('lg')
        setVisibleProducts((prev) => (prev <= 4 ? 4 : prev)) // Only reset if smaller than default
      } else if (width >= 768) {
        setScreenSize('md')
        setVisibleProducts((prev) => (prev <= 3 ? 3 : prev))
      } else {
        setScreenSize('sm')
        setVisibleProducts((prev) => (prev <= 2 ? 2 : prev))
      }
    }

    // Set initial value
    handleResize()

    // Debounce resize event for better performance
    let timeoutId: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    // Add event listener
    window.addEventListener('resize', debouncedResize)

    // Clean up
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Memoize the displayed products to prevent recalculation on every render
  const displayedProducts = useMemo(() => {
    return products.slice(0, visibleProducts)
  }, [products, visibleProducts])

  // Memoize this value to prevent recalculation on every render
  const showViewMoreButton = useMemo(() => {
    return products.length > visibleProducts && visibleProducts < 12
  }, [products.length, visibleProducts])

  const handleViewMore = () => {
    // Add products based on current screen size
    const increment = screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2

    // Increase by the appropriate amount, up to a maximum of 12
    setVisibleProducts((prev) => Math.min(prev + increment, 12))
  }

  return (
    <div className="space-y-6">
      <div className="flex relative justify-between items-center">
        <div className="relative w-fit">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-gradient-to-r from-gray-500 via-gray-300 to-transparent"></div>
        </div>
        <Link
          to="/search"
          className="text-sm font-bold text-gray-600 hover:underline absolute top-0 right-0 flex items-center"
        >
          Xem thêm
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <MemoizedProductCard key={product.id} product={product} />
        ))}
      </div>

      {showViewMoreButton && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleViewMore}
            variant="outline"
            className="rounded-full px-6 py-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            Xem thêm sản phẩm
          </Button>
        </div>
      )}
    </div>
  )
}
