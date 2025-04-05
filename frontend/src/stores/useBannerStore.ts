import { create } from 'zustand'
import axios from '@/lib/axios-custom'
import type { Banner } from '@/types'

interface BannerStoreState {
  isLoading: boolean
  error: string | null
  topBanners: Banner[]
  aboutUsBanners: Banner[]
  contactBanners: Banner[]
  fetchTopBanners: () => Promise<void>
  fetchAboutUsBanners: () => Promise<void>
  fetchContactBanners: () => Promise<void>
}

const useBannerStore = create<BannerStoreState>((set) => ({
  isLoading: false,
  error: null,
  topBanners: [],
  aboutUsBanners: [],
  contactBanners: [],

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

  fetchContactBanners: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get('/api/banner/contact')
      set({ contactBanners: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: 'Failed to fetch contact banners' })
    }
  },
}))

export default useBannerStore
