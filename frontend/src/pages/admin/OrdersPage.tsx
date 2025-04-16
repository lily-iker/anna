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
import { Search, Edit } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import { Pagination } from '@/components/ui/pagination'
import useOrderStore from '@/stores/useOrderStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Helper function to get status badge class
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-600'
    case 'SHIPPING':
      return 'bg-yellow-100 text-yellow-600'
    case 'DELIVERED':
      return 'bg-green-100 text-green-600'
    case 'CANCELLED':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// Helper function to get status label
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'Mới'
    case 'SHIPPING':
      return 'Đang giao hàng'
    case 'DELIVERED':
      return 'Đã vận chuyển'
    case 'CANCELLED':
      return 'Đã hủy'
    default:
      return status
  }
}

export default function OrderPage() {
  const navigate = useNavigate()
  const {
    orders,
    totalPages,
    totalOrders,
    currentPage,
    pageSize,
    isLoading,
    fetchOrders,
    setSearchFilters,
    deleteOrders,
  } = useOrderStore()

  // Local state for form inputs
  const [searchCustomer, setSearchCustomer] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Pagination state
  const [pageSizeOptions] = useState([1, 5, 10, 20])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Handle search and filter submission
  const handleSearch = () => {
    setSearchFilters(searchCustomer, selectedStatus, null, null)
    fetchOrders({
      page: 1,
      customerName: searchCustomer,
      status: selectedStatus ?? undefined,
    })
  }

  const handlePageChange = useCallback(
    (page: number) => {
      // Only fetch if the requested page is different from the current page
      if (page !== currentPage) {
        fetchOrders({
          page,
          customerName: searchCustomer || undefined,
          status: selectedStatus || undefined,
        })
      }
    },
    [currentPage, fetchOrders, searchCustomer, selectedStatus]
  )

  const handlePageSizeChange = (size: string) => {
    fetchOrders({
      page: 1,
      size: Number.parseInt(size),
      customerName: searchCustomer || undefined,
      status: selectedStatus || undefined,
    })
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order.id))
    }
  }

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các đơn hàng đã chọn?')) {
      await deleteOrders(selectedOrders)
      setSelectedOrders([])
    }
  }

  const handleFilterByStatus = (status: string | null) => {
    setSelectedStatus(status)
    fetchOrders({
      page: 1,
      status: status === 'all' || status === null ? undefined : status,
      customerName: searchCustomer,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedOrders.length === 0}
          >
            Xóa đơn hàng
          </Button>
        </div>
      </div>

      {/* Search */}
      {/* <div className="relative flex-1">
        <Input
          placeholder="Tìm kiếm theo tên khách hàng"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          className="pl-10"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div> */}

      {/* Order status tabs */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center">
          <div className="inline-flex gap-2 rounded-md p-2 border min-w-max">
            {[
              { key: null, label: 'Tất cả', color: 'bg-gray-200 text-gray-600' },
              { key: 'NEW', label: 'Mới', color: 'bg-blue-100 text-blue-600' },
              { key: 'SHIPPING', label: 'Đang giao hàng', color: 'bg-yellow-100 text-yellow-600' },
              { key: 'DELIVERED', label: 'Đã vận chuyển', color: 'bg-green-100 text-green-600' },
              { key: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-600' },
            ].map(({ key, label, color }) => {
              const isSelected = selectedStatus === key
              return (
                <Button
                  key={key ?? 'all'}
                  variant="ghost"
                  className={`rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap ${
                    isSelected ? `${color} pointer-events-none` : ''
                  }`}
                  onClick={() => handleFilterByStatus(key)}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {orders.length} / {totalOrders} đơn hàng
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

      {/* Orders Table */}
      <div className="border rounded-md relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá đơn hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => handleSelectOrder(order.id)}
                  />
                </TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
                    className="hover:cursor-pointer hover:text-orange-500 text-orange-500"
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không tìm thấy đơn hàng nào
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
