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
import { Edit, Search } from 'lucide-react'
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
    deleteProducts,
    setSearchFilters,
  } = useProductStore()

  const { fetchCategories } = useCategoryStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

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
    setSearchFilters(searchTerm, 0, 10000000, null)
    fetchProducts({
      page: 1,
      name: searchTerm,
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
      await deleteProducts(selectedProducts)
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
        {/* Search */}
        <div className="p-4 flex justify-end">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 h-5 w-5" /> {/* Icon on the left */}
            <Input
              placeholder="Tìm kiếm tên sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="border border-gray-200"></div>

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
              <TableHead>Giá bán</TableHead>
              <TableHead>Tình trạng hàng</TableHead>
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
