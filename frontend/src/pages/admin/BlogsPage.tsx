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
import { formatDate } from '@/lib/format'
import { Pagination } from '@/components/ui/pagination'
import useBlogStore from '@/stores/useBlogStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BlogsPage() {
  const navigate = useNavigate()
  const {
    blogs,
    totalPages,
    totalBlogs,
    currentPage,
    pageSize,
    isLoading,
    fetchBlogs,
    deleteBlogs,
    setSearchTitle,
  } = useBlogStore()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])

  // Pagination state
  const [pageSizeOptions] = useState([1, 5, 10, 20])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  // Handle search and filter submission
  const handleSearch = () => {
    setSearchTitle(searchTerm)
    fetchBlogs(1, pageSize, searchTerm)
  }

  const handlePageChange = useCallback(
    (page: number) => {
      // Only fetch if the requested page is different from the current page
      if (page !== currentPage) {
        fetchBlogs(page, pageSize)
      }
    },
    [currentPage, pageSize, fetchBlogs]
  )

  const handlePageSizeChange = (size: string) => {
    fetchBlogs(1, Number.parseInt(size))
  }

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([])
    } else {
      setSelectedBlogs(blogs.map((blog) => blog.id))
    }
  }

  const handleSelectBlog = (id: string) => {
    if (selectedBlogs.includes(id)) {
      setSelectedBlogs(selectedBlogs.filter((blogId) => blogId !== id))
    } else {
      setSelectedBlogs([...selectedBlogs, id])
    }
  }

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa các bài viết đã chọn?')) {
      await deleteBlogs(selectedBlogs)
      setSelectedBlogs([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bài viết</h1>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedBlogs.length === 0}
          >
            Xóa bài viết
          </Button>
          <Button onClick={() => navigate('/admin/blogs/add')}>Thêm bài viết</Button>
        </div>
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {blogs.length} / {totalBlogs} bài viết
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

      {/* Blogs Table */}
      <div className="border rounded-md relative">
        {/* Search */}
        <div className="p-4 flex justify-end">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm bài viết"
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
                  checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Ngày tạo</TableHead>
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
                <TableCell>
                  <div className="h-10 w-10 rounded overflow-hidden">
                    <img
                      src={blog.thumbnailImage || '/placeholder.svg?height=40&width=40'}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{formatDate(blog.createdAt || '')}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                    className="hover:cursor-pointer"
                  >
                    <Edit className="h-4 w-4 text-orange-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {blogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Không tìm thấy bài viết nào
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
