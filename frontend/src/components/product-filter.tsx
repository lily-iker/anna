import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCategoryStore from '@/stores/useCategoryStore'

interface ProductFilterProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  onResetFilters: () => void
  isLoading: boolean
}

export default function ProductFilter({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  onResetFilters,
  isLoading,
}: ProductFilterProps) {
  const { categories, isLoading: isCategoriesLoading } = useCategoryStore()

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end p-4">
      {/* Category Filter */}
      <div className="flex-1 w-full">
        <h3 className="text-xs md:text-sm font-medium mb-2">Danh mục</h3>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
          disabled={isCategoriesLoading || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="flex-1 w-full">
        <h3 className="text-xs md:text-sm font-medium mb-2">Khoảng giá</h3>
        <Select
          value={
            priceRange[0] === 0 && priceRange[1] === 10000000
              ? 'all'
              : `${priceRange[0]}-${priceRange[1]}`
          }
          onValueChange={(value) => {
            if (value === 'all') {
              setPriceRange([0, 10000000])
            } else {
              const [min, max] = value.split('-').map(Number)
              setPriceRange([min, max])
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả khoảng giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khoảng giá</SelectItem>
            <SelectItem value="0-100000">Dưới 100.000₫</SelectItem>
            <SelectItem value="100000-300000">100.000 - 300.000₫</SelectItem>
            <SelectItem value="300000-500000">300.000 - 500.000₫</SelectItem>
            <SelectItem value="500000-1000000">500.000 - 1.000.000₫</SelectItem>
            <SelectItem value="1000000-2000000">1.000.000 - 2.000.000₫</SelectItem>
            <SelectItem value="2000000-10000000">Trên 2.000.000₫</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filters */}
      <div className="w-full md:w-auto">
        <Button
          variant="ghost"
          onClick={onResetFilters}
          className="w-full md:w-auto text-gray-500 h-10"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          Xóa lọc
        </Button>
      </div>
    </div>
  )
}
