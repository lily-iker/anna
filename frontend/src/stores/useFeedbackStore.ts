import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import { toast } from 'react-hot-toast'
import { Feedback } from '@/types'

interface FeedbackStoreState {
  isLoading: boolean
  error: string | null

  feedbacks: Feedback[]
  totalFeedbacks: number
  totalPages: number
  currentPage: number
  pageSize: number

  searchName: string

  setSearchName: (name: string) => void
  fetchFeedbacks: (params?: { page?: number; size?: number; name?: string }) => Promise<void>
  createFeedback: (formData: FormData) => Promise<void>
  deleteFeedbacks: (ids: number[]) => Promise<void>
}

const useFeedbackStore = create<FeedbackStoreState>((set, get) => ({
  isLoading: false,
  error: null,

  feedbacks: [],
  totalFeedbacks: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,

  searchName: '',

  setSearchName: (name: string) => {
    set({ searchName: name })
  },

  fetchFeedbacks: async (params) => {
    set({ isLoading: true, error: null })

    try {
      const state = get()
      const page = params?.page ?? state.currentPage
      const size = params?.size ?? state.pageSize
      const name = params?.name ?? state.searchName

      const res = await axios.get('/api/feedback/search', {
        params: {
          page: page - 1,
          size,
          name,
        },
      })

      set({
        feedbacks: res.data.result.content,
        totalFeedbacks: res.data.result.page.totalElements,
        totalPages: res.data.result.page.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      set({ isLoading: false, error: 'Lỗi khi tải đánh giá.' })
    }
  },

  createFeedback: async (formData: FormData) => {
    set({ isLoading: true, error: null })

    try {
      await axios.post('/api/feedback/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Gửi đánh giá thành công!')
      set({ isLoading: false })

      await get().fetchFeedbacks()
    } catch (error: any) {
      console.error('Error creating feedback:', error)
      toast.error(
        'Gửi đánh giá thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định')
      )
      set({ isLoading: false, error: 'Failed to create feedback' })
    }
  },

  deleteFeedbacks: async (ids: number[]) => {
    set({ isLoading: true, error: null })

    try {
      await axios.delete('/api/feedback/delete-by-ids', {
        data: { feedbackIds: ids },
      })

      set((state) => ({
        feedbacks: state.feedbacks.filter((fb) => !ids.includes(fb.id)),
        isLoading: false,
      }))

      toast.success('Xóa đánh giá thành công!')
    } catch (error: any) {
      console.error('Error deleting feedbacks:', error)
      toast.error(
        'Xóa đánh giá thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định')
      )
      set({ isLoading: false, error: 'Failed to delete feedbacks' })
    }
  },
}))

export default useFeedbackStore
