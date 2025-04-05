import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Category } from '@/types'

interface CategoryStoreState {
  isLoading: boolean
  error: string | null
  categories: Category[]
  fetchCategories: () => Promise<void>
}

const useCategoryStore = create<CategoryStoreState>((set) => ({
  isLoading: false,
  error: null,
  categories: [],

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/category/all')
      set({ categories: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch categories' })
    }
  },
}))

export default useCategoryStore
