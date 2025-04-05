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
import { Pagination } from '@/components/ui/pagination'
import useBlogStore from '@/stores/useBlogStore'

export default function BlogPage() {
  const navigate = useNavigate()
  const {
    blogs,
    totalPages,
    totalBlogs,
    currentPage,
    pageSize,
    isLoading,
    error,
    fetchBlogs,
    deleteMultipleBlogs,
  } = useBlogStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([])
  const [pageSizeOptions] = useState([5, 10, 20, 50])

  // Initial data fetch
  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  // Handle search
  const handleSearch = () => {
    fetchBlogs({ page: 1, title: searchTerm })
  }

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        fetchBlogs({ page })
      }
    },
    [currentPage, fetchBlogs]
  )

  // Handle page size change
  const handlePageSizeChange = (size: string) => {
    fetchBlogs({ page: 1, size: Number.parseInt(size) })
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([])
    } else {
      setSelectedBlogs(blogs.map((blog) => blog.id))
    }
  }

  // Handle select blog
  const handleSelectBlog = (id: number) => {
    if (selectedBlogs.includes(id)) {
      setSelectedBlogs(selectedBlogs.filter((blogId) => blogId !== id))
    } else {
      setSelectedBlogs([...selectedBlogs, id])
    }
  }

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các bài viết đã chọn?')) {
      await deleteMultipleBlogs(selectedBlogs)
      setSelectedBlogs([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedBlogs.length === 0}
          >
            Xóa bài viết
          </Button>
          <Button onClick={() => navigate('/admin/blog/add')}>Thêm bài viết</Button>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-4 bg-white p-4 rounded-md border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Tìm kiếm tên bài blog"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>

          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {blogs.length} / {totalBlogs} bài viết
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="border rounded-md relative">
        {isLoading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Tên blog</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBlogs.includes(blog.id)}
                      onCheckedChange={() => handleSelectBlog(blog.id)}
                    />
                  </TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                      className="hover:cursor-pointer"
                    >
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {blogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Không tìm thấy bài viết nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
