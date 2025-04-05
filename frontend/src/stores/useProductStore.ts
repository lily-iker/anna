import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Product } from '@/types'
import type { Page, ProductPaginationParams } from '@/types/pagination'
import toast from 'react-hot-toast'

interface ProductStoreState {
  isLoading: boolean
  error: string | null
  newProducts: Product[]
  random12Products: Product[]

  // Pagination state
  currenetProduct: Product | null
  products: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
  pageSize: number

  // Filter state
  searchName: string
  minPrice: number
  maxPrice: number
  categoryName: string | null

  setSearchFilters: (
    name: string,
    minPrice: number,
    maxPrice: number,
    categoryName: string | null
  ) => void

  fetchNewProducts: () => Promise<void>
  fetchRandom12Products: () => Promise<void>
  fetchProductById: (productId: string) => Promise<Product | null>
  fetchProducts: (params?: Partial<ProductPaginationParams>) => Promise<void>
  addProduct: (formData: FormData) => Promise<Product | null>
  updateProduct: (id: string, formData: FormData) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<void>
}

const useProductStore = create<ProductStoreState>((set, get) => ({
  isLoading: false,
  error: null,
  newProducts: [],
  random12Products: [],

  currenetProduct: null,
  products: [],
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  searchName: '',
  minPrice: 0,
  maxPrice: 1000000,
  categoryName: '',

  setSearchFilters: (name, minPrice, maxPrice, categoryName) => {
    set({
      searchName: name,
      minPrice: minPrice,
      maxPrice: maxPrice,
      categoryName: categoryName,
    })
  },

  fetchNewProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/product/newest-8')
      set({ newProducts: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch new products' })
    }
  },

  fetchRandom12Products: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/product/random-12')
      set({ random12Products: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch random products' })
    }
  },

  fetchProductById: async (productId: string) => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get(`/api/product/${productId}`)
      set({ currenetProduct: res.data.result, isLoading: false })
      return res.data.result
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch product by ID' })
      return null
    }
  },

  fetchProducts: async (params?: Partial<ProductPaginationParams>) => {
    set({ isLoading: true, error: null })
    try {
      // Get current state
      const state = get()

      // Default pagination params
      const page = params?.page !== undefined ? params.page : state.currentPage
      const size = params?.size !== undefined ? params.size : state.pageSize
      const name = params?.name !== undefined ? params.name : state.searchName
      const minPrice = params?.minPrice !== undefined ? params.minPrice : state.minPrice
      const maxPrice = params?.maxPrice !== undefined ? params.maxPrice : state.maxPrice
      const categoryName =
        params?.categoryName !== undefined ? params.categoryName : state.categoryName

      // Spring Boot expects 0-based page index
      const response = await axios.get<Page<Product>>('/api/product/search', {
        params: {
          page: page - 1, // Convert to 0-based for Spring
          size,
          name,
          minPrice,
          maxPrice,
          categoryName,
        },
      })

      set({
        products: response.data.content,
        totalProducts: response.data.page.totalElements,
        totalPages: response.data.page.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      set({
        isLoading: false,
        error: 'Failed to fetch products. Please try again.',
      })
    }
  },

  addProduct: async (formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      set((state) => ({
        products: [response.data.result, ...state.products],
        isLoading: false,
      }))

      toast.success('Thêm sản phẩm thành công!')
      return response.data.result
    } catch (error: any) {
      console.error('Error adding product:', error)
      toast.error(
        'Thêm sản phẩm thất bại: ' + error.response?.data?.message || 'Lỗi không xác định'
      )
      set({ isLoading: false, error: 'Failed to add product.' })
      return null
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.put(`/api/product/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data.result : p)),
        isLoading: false,
      }))

      toast.success('Cập nhật sản phẩm thành công!')
      return response.data.result
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast.error(
        'Cập nhật sản phẩm thất bại: ' + error.response?.data?.message || 'Lỗi không xác định'
      )
      set({ isLoading: false, error: 'Failed to update product.' })
      return null
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/product/${id}`)

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }))

      toast.success('Xóa sản phẩm thành công!')
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('Xóa sản phẩm thất bại: ' + error.response?.data?.message || 'Lỗi không xác định')
      set({ isLoading: false, error: 'Failed to delete product.' })
    }
  },
}))

export default useProductStore
