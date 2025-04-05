'use client'

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Filter, Search, X } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Pagination } from '@/components/ui/pagination'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export default function ProductsPage() {
  const navigate = useNavigate()
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

  const { categories, fetchCategories } = useCategoryStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 800000])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Pagination state
  const [pageSizeOptions] = useState([1, 5, 10, 20])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle search and filter submission
  const handleSearch = () => {
    setSearchFilters(searchTerm, priceRange[0], priceRange[1], selectedCategory)
    fetchProducts({
      page: 1,
      name: searchTerm,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryName: selectedCategory ?? undefined,
    })
  }

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 800000])
    setSelectedCategory(null)
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
      // Only fetch if the requested page is different from the current page
      if (page !== currentPage) {
        fetchProducts({ page })
      }
    },
    [currentPage, fetchProducts]
  )

  const handlePageSizeChange = (size: string) => {
    fetchProducts({ page: 1, size: Number.parseInt(size) })
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product.id))
    }
  }

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?')) {
      // await useProductStore.getState().deleteMultipleProducts(selectedProducts)
      setSelectedProducts([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedProducts.length === 0}
          >
            Xóa sản phẩm
          </Button>
          <Button onClick={() => navigate('/admin/products/add')}>Thêm sản phẩm</Button>
        </div>
      </div>

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
            <Button onClick={handleSearch}>Tìm kiếm</Button>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>

            <Button variant="ghost" onClick={handleResetFilters} className="text-gray-500">
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
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {products.length} / {totalProducts} sản phẩm
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
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

      {/* Products Table with optimistic UI */}
      <div className="border rounded-md relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Giá gốc</TableHead>
              <TableHead>Giá khuyến mãi</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="h-10 w-10 rounded overflow-hidden">
                    <img
                      src={product.thumbnailImage || '/placeholder.svg?height=40&width=40'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categoryName || 'Chưa phân loại'}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{formatCurrency(product.originalPrice)}</TableCell>
                <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                    className="hover:cursor-pointer"
                  >
                    <Edit className="h-4 w-4 text-orange-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={isLoading}
      />
    </div>
  )
}
