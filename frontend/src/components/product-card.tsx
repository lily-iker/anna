import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

// Create a memoized component to prevent unnecessary re-renders
function ProductCard({ product }: ProductCardProps) {
  const salePrice = 100000
  const isDiscounted = product.originalPrice > salePrice

  return (
    <Card className="h-full flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
          <img
            src={product.thumbnailImage || '/placeholder.svg?height=300&width=400'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy" // Add lazy loading
            decoding="async" // Add async decoding
          />
        </div>
        <div className="pt-2 lg:pt-4 text-center">
          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1 sm:gap-2">
            <span className="text-red-600 text-lg font-bold">{formatCurrency(salePrice)}</span>
            {isDiscounted && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 justify-center">
        <Button
          variant="outline"
          size="sm"
          className="text-sm font-medium sm:w-30 lg:w-50 hover:cursor-pointer hover:bg-[#9DE25C]"
        >
          Mua ngay
        </Button>
      </CardFooter>
    </Card>
  )
}

// Export the memoized version
export default memo(ProductCard)
