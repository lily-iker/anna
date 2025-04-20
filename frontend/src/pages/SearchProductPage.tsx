'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import ProductCard from '@/components/product-card'
import ProductFilter from '@/components/product-filter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SearchProductPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const {
    products,
    totalPages,
    totalProducts,
    currentPage,
    pageSize,
    isLoading,
    fetchProducts,
    setSearchFilters,
  } = useProductStore()

  const { fetchCategories } = useCategoryStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(queryParams.get('minPrice') || 0),
    Number(queryParams.get('maxPrice') || 10000000),
  ])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    queryParams.get('category')
  )
  const [tableLoading, setTableLoading] = useState(false)
  const [localPageSize, setLocalPageSize] = useState(pageSize)

  // Pagination state
  const [pageSizeOptions] = useState([10, 12, 16, 24])

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Initial data fetch based on URL params
  useEffect(() => {
    const initialSearch = queryParams.get('q') || ''
    const initialCategory = queryParams.get('category') || null
    const minPrice = Number(queryParams.get('minPrice') || 0)
    const maxPrice = Number(queryParams.get('maxPrice') || 10000000)
    const page = Number(queryParams.get('page') || 1)
    const size = Number(queryParams.get('size') || pageSize)

    setSearchTerm(initialSearch)
    setSelectedCategory(initialCategory)
    setPriceRange([minPrice, maxPrice])
    setLocalPageSize(size)

    setSearchFilters(initialSearch, minPrice, maxPrice, initialCategory)
    fetchProducts({
      page,
      size,
      name: initialSearch,
      minPrice,
      maxPrice,
      categoryName: initialCategory || undefined,
    })
  }, [location.search, fetchProducts, setSearchFilters, pageSize])

  // Update table loading state when isLoading changes
  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to make transitions smoother
      const timer = setTimeout(() => {
        setTableLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setTableLoading(true)
    }
  }, [isLoading])

  // Apply filters
  const handleApplyFilters = () => {
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())
    params.set('size', localPageSize.toString())

    navigate(`/search?${params.toString()}`)

    setSearchFilters(searchTerm, priceRange[0], priceRange[1], selectedCategory)
    fetchProducts({
      page: 1,
      size: localPageSize,
      name: searchTerm,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryName: selectedCategory || undefined,
    })
  }

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 10000000]) // Reset to "Tất cả khoảng giá"
    setSelectedCategory(null)

    navigate(`/search?size=${localPageSize}`)

    setSearchFilters('', 0, 10000000, null)
    fetchProducts({
      page: 1,
      size: localPageSize,
      name: '',
      minPrice: 0,
      maxPrice: 10000000,
      categoryName: '',
    })
  }

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        setTableLoading(true)

        // Update URL with page param
        const params = new URLSearchParams(location.search)
        params.set('page', page.toString())
        navigate(`/search?${params.toString()}`)

        fetchProducts({ page, size: localPageSize })
      }
    },
    [currentPage, fetchProducts, location.search, navigate, localPageSize]
  )

  const handlePageSizeChange = (size: string) => {
    // Convert size to number immediately
    const sizeNum = Number.parseInt(size)
    setLocalPageSize(sizeNum)

    // Update URL with size param
    const params = new URLSearchParams(location.search)
    params.set('size', size)

    // Set loading state
    setTableLoading(true)

    // Fetch products with the new size
    fetchProducts({
      page: 1,
      size: sizeNum,
      name: searchTerm,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryName: selectedCategory || undefined,
    })

    // Update URL after fetching to avoid race conditions
    navigate(`/search?${params.toString()}`)
  }

  // Effect to apply filters when URL changes
  useEffect(() => {
    // Check if filters have changed
    const urlSearchTerm = queryParams.get('q') || ''
    const urlCategory = queryParams.get('category') || null
    const urlMinPrice = Number(queryParams.get('minPrice') || 0)
    const urlMaxPrice = Number(queryParams.get('maxPrice') || 10000000)

    if (
      urlSearchTerm !== searchTerm ||
      urlCategory !== selectedCategory ||
      urlMinPrice !== priceRange[0] ||
      urlMaxPrice !== priceRange[1]
    ) {
      handleApplyFilters()
    }
  }, [searchTerm, selectedCategory, priceRange])

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
      <h1 className="text-2xl font-bold text-green-600 text-center mb-6">SẢN PHẨM</h1>

      {/* Simplified Filters */}
      <ProductFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
      />

      {/* Results per page selector */}
      {/* <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-gray-500">
          Hiển thị {products.length} / {totalProducts} sản phẩm
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select
            defaultValue={pageSize.toString()}
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Products Grid with loading state */}
      <div className="relative border rounded-md">
        {tableLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
              <span className="mt-2 text-sm text-gray-600">Đang tải...</span>
            </div>
          </div>
        )}

        {products.length === 0 && !tableLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm
            </p>
            {(searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000000) && (
              <Button variant="outline" onClick={handleResetFilters} className="mt-2">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
