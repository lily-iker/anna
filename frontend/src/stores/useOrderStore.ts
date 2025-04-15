import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import { toast } from 'react-hot-toast'
import { OrderPaginationParams } from '@/types/pagination'
import { ApiResponse, Order, OrderStatus } from '@/types'

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
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>
  deleteOrders: (ids: string[]) => Promise<void>
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

  updateOrderStatus: async (orderId: string, newStatus: OrderStatus) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.put(`/api/order/${orderId}/status`, {
        newStatus,
      })

      const updatedOrder: Order = res.data.result

      // Update the current order if it's the one we just updated
      set((state) => ({
        orders: state.orders.map((order) => (order.id === orderId ? updatedOrder : order)),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isLoading: false,
      }))

      toast.success('Cập nhật trạng thái đơn hàng thành công!')
    } catch (error: any) {
      console.error('Error updating order status:', error)
      toast.error(
        'Cập nhật trạng thái thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định')
      )
      set({ isLoading: false, error: 'Failed to update order status.' })
    }
  },

  deleteOrders: async (ids: string[]) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete('/api/order/delete-by-ids', {
        data: { orderIds: ids },
      })

      set((state) => ({
        orders: state.orders.filter((o) => !ids.includes(o.id)),
        isLoading: false,
      }))

      toast.success('Xóa đơn hàng đã chọn thành công!')
    } catch (error: any) {
      console.error('Error deleting multiple orders:', error)
      toast.error('Xóa đơn hàng thất bại: ' + error.response?.data?.message || 'Lỗi không xác định')
      set({ isLoading: false, error: 'Failed to delete orders.' })
    }
  },
}))

export default useOrderStore
