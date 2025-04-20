import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import { toast } from 'react-hot-toast'
import type { Customer } from '@/types'

interface CustomerStoreState {
  isLoading: boolean
  error: string | null
  customers: Customer[]
  totalCustomers: number
  totalPages: number
  currentPage: number
  pageSize: number
  searchName: string

  setSearchName: (name: string) => void
  fetchCustomers: (params?: {
    name?: string
    page?: number
    size?: number
    sortBy?: string
    direction?: string
  }) => Promise<void>
  deleteCustomers: (ids: string[]) => Promise<void>
}

const useCustomerStore = create<CustomerStoreState>((set, get) => ({
  isLoading: false,
  error: null,
  customers: [],
  totalCustomers: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  searchName: '',

  setSearchName: (name) => {
    set({ searchName: name })
  },

  fetchCustomers: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const state = get()
      const page = params?.page ?? state.currentPage
      const size = params?.size ?? state.pageSize
      const name = params?.name ?? state.searchName
      const sortBy = params?.sortBy ?? 'createdAt'
      const direction = params?.direction ?? 'desc'

      const res = await axios.get('/api/customer/search', {
        params: {
          name,
          page: page - 1, // Convert to 0-based index
          size,
          sortBy,
          direction,
        },
      })

      set({
        customers: res.data.result.content,
        totalCustomers: res.data.result.page.totalElements,
        totalPages: res.data.result.page.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (error) {
      console.error('Lỗi lấy danh sách khách hàng:', error)
      set({ isLoading: false, error: 'Không thể tải danh sách khách hàng.' })
    }
  },

  deleteCustomers: async (ids) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete('/api/customer/delete-by-ids', {
        data: { customerIds: ids },
      })

      set((state) => ({
        customers: state.customers.filter((c) => !ids.includes(c.id)),
        isLoading: false,
      }))

      toast.success('Xóa khách hàng thành công!')
    } catch (error: any) {
      console.error('Lỗi xóa khách hàng:', error)
      toast.error('Xóa khách hàng thất bại.')
      set({ isLoading: false, error: 'Không thể xóa khách hàng.' })
    }
  },
}))

export default useCustomerStore
