'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { Search } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import useCustomerStore from '@/stores/useCustomerStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/format'

export default function CustomerPage() {
  const {
    customers,
    totalPages,
    totalCustomers,
    currentPage,
    pageSize,
    isLoading,
    fetchCustomers,
    deleteCustomers,
    setSearchName,
  } = useCustomerStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // Pagination state
  const [pageSizeOptions] = useState([1, 5, 10, 20])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Handle search submission
  const handleSearch = () => {
    setSearchName(searchTerm)
    fetchCustomers({
      name: searchTerm,
      page: 1,
    })
  }

  const handlePageChange = useCallback(
    (page: number) => {
      // Only fetch if the requested page is different from the current page
      if (page !== currentPage) {
        fetchCustomers({ page })
      }
    },
    [currentPage, fetchCustomers]
  )

  const handlePageSizeChange = (size: string) => {
    fetchCustomers({ page: 1, size: Number.parseInt(size) })
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id))
    }
  }

  const handleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id))
    } else {
      setSelectedCustomers([...selectedCustomers, id])
    }
  }

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các khách hàng đã chọn?')) {
      await deleteCustomers(selectedCustomers)
      setSelectedCustomers([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedCustomers.length === 0}
          >
            Xóa khách hàng
          </Button>
        </div>
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {customers.length} / {totalCustomers} khách hàng
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

      {/* Customers Table with optimistic UI */}
      <div className="border rounded-md relative">
        {/* Search */}
        <div className="p-4 flex justify-end">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm tên khách hàng"
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
                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Số đơn hàng đã mua</TableHead>
              <TableHead>Thời gian đơn hàng mua gần nhất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => handleSelectCustomer(customer.id)}
                  />
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell className="p-4">{formatDate(customer.lastOrderDate)}</TableCell>
              </TableRow>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không tìm thấy khách hàng nào
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
