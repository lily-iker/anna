import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Blog } from '@/types'

interface BlogStoreState {
  isLoading: boolean
  error: string | null
  blogs: Blog[]
  fetchBlogs: () => Promise<void>
}

const useBlogStore = create<BlogStoreState>((set) => ({
  isLoading: false,
  error: null,
  blogs: [],

  fetchBlogs: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/blog/all')
      set({ blogs: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch blogs' })
    }
  },
}))

export default useBlogStore
