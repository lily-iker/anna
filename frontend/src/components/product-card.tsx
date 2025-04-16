import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'
import { Link, useNavigate } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const isDiscounted = product.originalPrice > product.sellingPrice
  const salePrice = product.sellingPrice

  const navigate = useNavigate()

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/checkout`)
  }

  return (
    <Link to={`/product/${product.id}`} className="block h-full group">
      <Card className="h-full flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
            {isDiscounted && (
              <div className="absolute top-0 left-0 bg-red-600 text-white rounded-xs px-2 py-1 z-10 font-medium">
                -{product.discountPercentage}%
              </div>
            )}
            <img
              src={product.thumbnailImage || '/placeholder.svg?height=300&width=400'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-3 text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">Xuất xứ: {product.origin}</p>

            <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-red-600 text-lg font-bold">{formatCurrency(salePrice)}</span>
              {isDiscounted && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 justify-center">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-[#9DE25C] hover:bg-[#8bc74e] text-black font-medium hover:cursor-pointer"
            onClick={handleBuyNow}
          >
            Mua ngay
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ProductCard
