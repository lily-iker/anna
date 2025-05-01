'use client'

import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useBlogStore from '@/stores/useBlogStore'
import { BlogCard } from '@/components/blog/blog-card'
import { Pagination } from '@/components/ui/pagination'

export default function BlogPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const {
    blogs,
    totalPages,
    totalBlogs,
    currentPage,
    pageSize,
    isLoading,
    fetchBlogs,
    setSearchTitle,
  } = useBlogStore()

  // Local state for form inputs
  const [searchValue, setSearchValue] = useState(queryParams.get('q') || '')
  const [tableLoading, setTableLoading] = useState(false)
  const [localPageSize, setLocalPageSize] = useState(pageSize)

  // Initial data fetch based on URL params
  useEffect(() => {
    const initialSearch = queryParams.get('q') || ''
    const page = Number(queryParams.get('page') || 1)
    const size = Number(queryParams.get('size') || pageSize)

    setSearchValue(initialSearch)
    setLocalPageSize(size)

    setSearchTitle(initialSearch)
    fetchBlogs(page, size, initialSearch)
  }, [location.search, fetchBlogs, setSearchTitle, pageSize])

  // Update loading state with a small delay for smoother transitions
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search params
    const params = new URLSearchParams()
    if (searchValue) params.set('q', searchValue)
    params.set('page', '1')
    params.set('size', localPageSize.toString())

    navigate(`/blogs?${params.toString()}`)

    setSearchTitle(searchValue)
    fetchBlogs(1, localPageSize, searchValue)
  }

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        setTableLoading(true)

        // Update URL with page param
        const params = new URLSearchParams(location.search)
        params.set('page', page.toString())
        navigate(`/blogs?${params.toString()}`)

        fetchBlogs(page, localPageSize, searchValue)
      }
    },
    [currentPage, fetchBlogs, location.search, navigate, localPageSize, searchValue]
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

    // Fetch blogs with the new size
    fetchBlogs(1, sizeNum, searchValue)

    // Update URL after fetching to avoid race conditions
    navigate(`/blogs?${params.toString()}`)
  }

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-24 pb-8 pt-24">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">BLOG</h1>

      <form onSubmit={handleSearch} className="mb-8 flex justify-center md:justify-end md:pr-4">
        <div className="relative w-full max-w-2xs md:max-w-sx lg:max-w-sm">
          <Input
            type="text"
            placeholder="Nhập từ khóa tiêu đề"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pr-10 rounded-md border-gray-300"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Search"
          >
            <Search className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </form>

      <div className="relative">
        {tableLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
              <span className="mt-2 text-sm text-gray-600">Đang tải...</span>
            </div>
          </div>
        )}

        {blogs.length === 0 && !tableLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm
            </p>
            {searchValue && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchValue('')
                  setSearchTitle('')
                  navigate('/blogs')
                  fetchBlogs(1, localPageSize, '')
                }}
                className="mt-2"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
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
