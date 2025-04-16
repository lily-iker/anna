import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Banner } from '@/types'
import toast from 'react-hot-toast'

interface BannerStoreState {
  isLoading: boolean
  error: string | null
  banners: Banner[]
  topBanners: Banner[]
  aboutUsBanners: Banner[]
  fetchTopBanners: () => Promise<void>
  fetchAboutUsBanners: () => Promise<void>
  updateBannerImage: (bannerId: number, imageFile: File) => Promise<void | null>
}

const useBannerStore = create<BannerStoreState>((set) => ({
  isLoading: false,
  error: null,
  banners: [],
  topBanners: [],
  aboutUsBanners: [],

  fetchTopBanners: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/banner/top')
      set({ topBanners: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch top banners' })
    }
  },

  fetchAboutUsBanners: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/banner/about-us')
      set({ aboutUsBanners: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch about us banners' })
    }
  },

  updateBannerImage: async (bannerId, imageFile) => {
    try {
      set({ isLoading: true, error: null })

      const formData = new FormData()
      formData.append('imageFile', imageFile)

      await axios.put(`/api/banner/${bannerId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const refreshed = await axios.get('/api/banner/all')
      set({ banners: refreshed.data.result, isLoading: false })

      toast.success('Cập nhật hình ảnh banner thành công')
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Không thể cập nhật hình ảnh banner' })
      toast.error('Cập nhật hình ảnh banner thất bại')
      return null
    }
  },
}))

export default useBannerStore
