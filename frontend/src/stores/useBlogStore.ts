import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { ApiResponse, Blog } from '@/types'
import toast from 'react-hot-toast'

interface BlogStoreState {
  isLoading: boolean
  error: string | null
  blogs: Blog[]
  totalBlogs: number
  totalPages: number
  currentPage: number
  pageSize: number
  currentBlog: Blog | null
  searchTitle: string

  setSearchTitle: (title: string) => void

  fetchBlogs: (page?: number, size?: number, title?: string) => Promise<void>
  fetchBlogById: (id: string) => Promise<Blog | null>
  addBlog: (formData: FormData) => Promise<Blog | null>
  updateBlog: (id: string, formData: FormData) => Promise<Blog | null>
  deleteBlogs: (ids: string[]) => Promise<void>
}

const useBlogStore = create<BlogStoreState>((set, get) => ({
  isLoading: false,
  error: null,
  blogs: [],
  totalBlogs: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5,
  currentBlog: null,
  searchTitle: '',

  setSearchTitle: (title) => set({ searchTitle: title }),

  fetchBlogs: async (page = get().currentPage, size = get().pageSize, title?: string) => {
    set({ isLoading: true, error: null })
    try {
      const state = get()
      const res = await axios.get<ApiResponse>('/api/blog/search', {
        params: {
          page: page - 1,
          size,
          title: title ?? state.searchTitle,
        },
      })
      set({
        blogs: res.data.result.content,
        totalBlogs: res.data.result.page.totalElements,
        totalPages: res.data.result.page.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch blogs.' })
    }
  },

  fetchBlogById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.get(`/api/blog/${id}`)
      set({ currentBlog: res.data.result, isLoading: false })
      return res.data.result
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch blog by ID' })
      return null
    }
  },

  addBlog: async (formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.post('/api/blog/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      set((state) => ({
        blogs: [res.data.result, ...state.blogs],
        isLoading: false,
      }))
      toast.success('Thêm blog thành công!')
      return res.data.result
    } catch (error: any) {
      console.error(error)
      toast.error('Thêm blog thất bại: ' + error.response?.data?.message || 'Lỗi không xác định')
      set({ isLoading: false, error: 'Failed to add blog.' })
      return null
    }
  },

  updateBlog: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.put(`/api/blog/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? res.data.result : b)),
        isLoading: false,
      }))
      toast.success('Cập nhật blog thành công!')
      return res.data.result
    } catch (error: any) {
      console.error(error)
      toast.error(
        'Cập nhật blog thất bại: ' + error.response?.data?.message || 'Lỗi không xác định'
      )
      set({ isLoading: false, error: 'Failed to update blog.' })
      return null
    }
  },

  deleteBlogs: async (ids: string[]) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete('/api/blog/delete-by-ids', {
        data: { blogIds: ids },
      })

      set((state) => ({
        blogs: state.blogs.filter((b) => !ids.includes(b.id)),
        isLoading: false,
      }))

      toast.success('Xóa blog thành công!')
    } catch (error: any) {
      console.error(error)
      toast.error('Xóa blog thất bại: ' + error.response?.data?.message || 'Lỗi không xác định')
      set({ isLoading: false, error: 'Failed to delete blogs.' })
    }
  },
}))

export default useBlogStore
