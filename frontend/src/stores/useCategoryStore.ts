import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Category, UpdateCategoryImageRequest } from '@/types'
import toast from 'react-hot-toast'

interface CategoryStoreState {
  isLoading: boolean
  error: string | null
  categories: Category[]
  fetchCategories: () => Promise<void>
  updateCategoryImage: (categoryId: number, imageFile: File) => Promise<void | null>
  updateCategoryImages: (categoryIds: number[], imageFiles: File[]) => Promise<void | null>
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

  updateCategoryImage: async (categoryId, imageFile) => {
    try {
      set({ isLoading: true, error: null })

      const formData = new FormData()
      formData.append('imageFile', imageFile)

      await axios.put(`/api/category/${categoryId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Cập nhật ảnh danh mục thành công!')
      set({ isLoading: false })
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật ảnh thất bại. Vui lòng thử lại.')
      set({ isLoading: false, error: 'Failed to update category image' })
      return null
    }
  },
  updateCategoryImages: async (categoryIds, imageFiles) => {
    try {
      set({ isLoading: true, error: null })

      // Create the requests array based on categoryIds
      const requests: UpdateCategoryImageRequest[] = categoryIds.map((categoryId) => ({
        categoryId,
      }))

      // Create FormData and append the requests as JSON and the imageFiles
      const formData = new FormData()
      formData.append(
        'requests',
        new Blob([JSON.stringify(requests)], {
          type: 'application/json',
        })
      )

      // Append each image file to the formData
      imageFiles.forEach((file) => {
        formData.append('imageFiles', file)
      })

      // Make the API call
      await axios.put('/api/category/update-images-by-ids', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Cập nhật ảnh danh mục thành công!')
      set({ isLoading: false })
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật ảnh danh mục thất bại. Vui lòng thử lại.')
      set({ isLoading: false, error: 'Failed to update category images' })
      return null
    }
  },
}))

export default useCategoryStore
