'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Filter, Loader2, Search, X } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Pagination } from '@/components/ui/pagination'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import ProductCard from '@/components/product-card'
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

  const { categories, fetchCategories, isLoading: isCategoriesLoading } = useCategoryStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '')
  const [priceRange, setPriceRange] = useState([
    Number(queryParams.get('minPrice') || 0),
    Number(queryParams.get('maxPrice') || 800000),
  ])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    queryParams.get('category')
  )
  const [showFilters, setShowFilters] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)

  // Pagination state
  const [pageSizeOptions] = useState([10, 12, 16, 24])

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0)
  }, [])

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Initial data fetch based on URL params
  useEffect(() => {
    const initialSearch = queryParams.get('q') || ''
    const initialCategory = queryParams.get('category') || null
    const minPrice = Number(queryParams.get('minPrice') || 0)
    const maxPrice = Number(queryParams.get('maxPrice') || 800000)
    const page = Number(queryParams.get('page') || 1)

    setSearchTerm(initialSearch)
    setSelectedCategory(initialCategory)
    setPriceRange([minPrice, maxPrice])

    setSearchFilters(initialSearch, minPrice, maxPrice, initialCategory)
    fetchProducts({
      page,
      name: initialSearch,
      minPrice,
      maxPrice,
      categoryName: initialCategory || undefined,
    })
  }, [location.search, fetchProducts, setSearchFilters])

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

  // Handle search and filter submission
  const handleSearch = () => {
    setTableLoading(true)

    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())

    navigate(`/search?${params.toString()}`)

    setSearchFilters(searchTerm, priceRange[0], priceRange[1], selectedCategory)
    fetchProducts({
      page: 1,
      name: searchTerm,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryName: selectedCategory || undefined,
    })
  }

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 800000])
    setSelectedCategory(null)
    setTableLoading(true)

    navigate('/search')

    setSearchFilters('', 0, 800000, null)
    fetchProducts({
      page: 1,
      name: '',
      minPrice: 0,
      maxPrice: 800000,
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

        fetchProducts({ page })
      }
    },
    [currentPage, fetchProducts, location.search, navigate]
  )

  const handlePageSizeChange = (size: string) => {
    setTableLoading(true)

    // Update URL with size param
    const params = new URLSearchParams(location.search)
    params.set('size', size)
    navigate(`/search?${params.toString()}`)

    fetchProducts({ page: 1, size: Number.parseInt(size) })
  }

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">SẢN PHẨM</h1>

      {/* Search and Filters */}
      <div className="space-y-4 bg-white p-4 rounded-md border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Tìm kiếm tên sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Tìm kiếm
            </Button>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>

            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="text-gray-500"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Xóa lọc
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="pt-4 border-t">
            <div className="space-y-6 md:space-y-0 md:flex md:items-top md:gap-8">
              {/* Category Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Danh mục</h3>
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
                  disabled={isCategoriesLoading}
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
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Khoảng giá</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={1000000}
                    step={10000}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-gray-500">
          Hiển thị {products.length} / {totalProducts} sản phẩm
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={pageSize.toString()} />
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
      </div>

      {/* Products Grid with loading state */}
      {tableLoading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
          <div className="flex flex-col items-center">
            <Loader2 className="size-8 text-green-500 animate-spin" />
            <span className="mt-2 text-sm text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}

      {products.length === 0 && !tableLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm
          </p>
          {(searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 800000) && (
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
