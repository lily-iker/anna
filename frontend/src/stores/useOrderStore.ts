import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import { toast } from 'react-hot-toast'
import { OrderPaginationParams } from '@/types/pagination'
import { ApiResponse, Order } from '@/types'

interface OrderStoreState {
  isLoading: boolean
  error: string | null

  // Pagination state
  currentOrder: Order | null
  orders: Order[]
  totalOrders: number
  totalPages: number
  currentPage: number
  pageSize: number

  // Filter state
  searchCustomerName: string
  status: string | null
  fromDate: string | null
  toDate: string | null

  setSearchFilters: (
    customerName: string,
    status: string | null,
    fromDate: string | null,
    toDate: string | null
  ) => void

  fetchOrderById: (orderId: string) => Promise<Order | null>
  fetchOrders: (params?: Partial<OrderPaginationParams>) => Promise<void>
  updateOrder: (id: string, orderData: Partial<Order>) => Promise<Order | null>
  deleteOrder: (id: string) => Promise<void>
  deleteMultipleOrders: (ids: string[]) => Promise<void>
}

const useOrderStore = create<OrderStoreState>((set, get) => ({
  isLoading: false,
  error: null,

  currentOrder: null,
  orders: [],
  totalOrders: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,

  searchCustomerName: '',
  status: null,
  fromDate: null,
  toDate: null,

  setSearchFilters: (customerName, status, fromDate, toDate) => {
    set({
      searchCustomerName: customerName,
      status: status,
      fromDate: fromDate,
      toDate: toDate,
    })
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get(`/api/order/${orderId}`)
      set({ currentOrder: res.data.result, isLoading: false })
      return res.data.result
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch order by ID' })
      return null
    }
  },

  fetchOrders: async (params?: Partial<OrderPaginationParams>) => {
    set({ isLoading: true, error: null })
    try {
      // Get current state
      const state = get()

      // Default pagination params
      const page = params?.page !== undefined ? params.page : state.currentPage
      const size = params?.size !== undefined ? params.size : state.pageSize
      const customerName =
        params?.customerName !== undefined ? params.customerName : state.searchCustomerName
      const status = params?.status !== undefined ? params.status : state.status
      const fromDate = params?.fromDate !== undefined ? params.fromDate : state.fromDate
      const toDate = params?.toDate !== undefined ? params.toDate : state.toDate

      // Spring Boot expects 0-based page index
      const response = await axios.get<ApiResponse>('/api/order/search', {
        params: {
          page: page - 1, // Convert to 0-based for Spring
          size,
          customerName,
          status,
          fromDate,
          toDate,
        },
      })

      set({
        orders: response.data.result.content,
        totalOrders: response.data.result.page.totalElements,
        totalPages: response.data.result.page.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
      set({
        isLoading: false,
        error: 'Failed to fetch orders. Please try again.',
      })
    }
  },

  updateOrder: async (id: string, orderData: Partial<Order>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.put(`/api/order/${id}`, orderData)

      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? response.data.result : o)),
        isLoading: false,
      }))

      toast.success('Cập nhật đơn hàng thành công!')
      return response.data.result
    } catch (error: any) {
      console.error('Error updating order:', error)
      toast.error(
        'Cập nhật đơn hàng thất bại: ' + error.response?.data?.message || 'Lỗi không xác định'
      )
      set({ isLoading: false, error: 'Failed to update order.' })
      return null
    }
  },

  deleteOrder: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/order/${id}`)

      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        isLoading: false,
      }))

      toast.success('Xóa đơn hàng thành công!')
    } catch (error: any) {
      console.error('Error deleting order:', error)
      toast.error('Xóa đơn hàng thất bại: ' + error.response?.data?.message || 'Lỗi không xác định')
      set({ isLoading: false, error: 'Failed to delete order.' })
    }
  },

  deleteMultipleOrders: async (ids: string[]) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete('/api/order/delete-multiple', { data: { ids } })

      set((state) => ({
        orders: state.orders.filter((o) => !ids.includes(o.id)),
        isLoading: false,
      }))

      toast.success('Xóa các đơn hàng đã chọn thành công!')
    } catch (error: any) {
      console.error('Error deleting multiple orders:', error)
      toast.error(
        'Xóa các đơn hàng thất bại: ' + error.response?.data?.message || 'Lỗi không xác định'
      )
      set({ isLoading: false, error: 'Failed to delete orders.' })
    }
  },
}))

export default useOrderStore
