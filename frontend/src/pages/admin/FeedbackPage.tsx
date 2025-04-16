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
import { Eye, Search } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import useFeedbackStore from '@/stores/useFeedbackStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/format'

export default function FeedbackPage() {
  const navigate = useNavigate()
  const {
    feedbacks,
    totalPages,
    totalFeedbacks,
    currentPage,
    pageSize,
    isLoading,
    fetchFeedbacks,
    deleteFeedbacks,
    setSearchName,
  } = useFeedbackStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<number[]>([])

  // Pagination state
  const [pageSizeOptions] = useState([1, 5, 10, 20])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  // Handle search submission
  const handleSearch = () => {
    setSearchName(searchTerm)
    fetchFeedbacks({
      page: 1,
      name: searchTerm,
    })
  }

  const handlePageChange = useCallback(
    (page: number) => {
      // Only fetch if the requested page is different from the current page
      if (page !== currentPage) {
        fetchFeedbacks({ page })
      }
    },
    [currentPage, fetchFeedbacks]
  )

  const handlePageSizeChange = (size: string) => {
    fetchFeedbacks({ page: 1, size: Number.parseInt(size) })
  }

  const handleSelectAll = () => {
    if (selectedFeedbacks.length === feedbacks.length) {
      setSelectedFeedbacks([])
    } else {
      setSelectedFeedbacks(feedbacks.map((feedback) => feedback.id))
    }
  }

  const handleSelectFeedback = (id: number) => {
    if (selectedFeedbacks.includes(id)) {
      setSelectedFeedbacks(selectedFeedbacks.filter((feedbackId) => feedbackId !== id))
    } else {
      setSelectedFeedbacks([...selectedFeedbacks, id])
    }
  }

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các góp ý đã chọn?')) {
      await deleteFeedbacks(selectedFeedbacks)
      setSelectedFeedbacks([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Góp ý</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedFeedbacks.length === 0}
          >
            Xóa góp ý
          </Button>
        </div>
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {feedbacks.length} / {totalFeedbacks} góp ý
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

      {/* Feedbacks Table */}
      <div className="border rounded-md relative">
        {/* Search */}
        <div className="p-4 flex justify-end">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm"
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
                  checked={selectedFeedbacks.length === feedbacks.length && feedbacks.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Góp ý</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ngày góp ý</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFeedbacks.includes(feedback.id)}
                    onCheckedChange={() => handleSelectFeedback(feedback.id)}
                  />
                </TableCell>
                <TableCell>{feedback.customerName}</TableCell>
                <TableCell>{feedback.productName}</TableCell>
                <TableCell className="max-w-xs truncate">{feedback.content}</TableCell>
                <TableCell>{feedback.customerPhoneNumber}</TableCell>
                <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/feedbacks/view/${feedback.id}`)}
                    className="hover:cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-green-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {feedbacks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không tìm thấy góp ý nào
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
