import { create } from "zustand"
import axios from "@/lib/axios-custom"
import type { Product, Category, Banner, Blog } from "@/types"

interface ProductStoreState {
  // State
  isLoading: boolean
  error: string | null

  // Data
  newProducts: Product[]
  random12Products: Product[]
  categories: Category[]
  topBanners: Banner[]
  aboutUsBanners: Banner[]
  contactBanners: Banner[]
  blogs: Blog[]

  // Actions
  fetchNewProducts: () => Promise<void>
  fetchRandom12Products: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchTopBanners: () => Promise<void>
  fetchAboutUsBanners: () => Promise<void>
  fetchContactBanners: () => Promise<void>
  fetchBlogs: () => Promise<void>
}

const useProductStore = create<ProductStoreState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,

  newProducts: [],
  random12Products: [],
  categories: [],
  topBanners: [],
  aboutUsBanners: [],
  contactBanners: [],
  blogs: [],

  // Actions
  fetchNewProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/product/newest-8")
      set({ newProducts: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching new products:", error)
      set({
        isLoading: false,
        error: "Failed to fetch new products. Please try again.",
      })
    }
  },

  fetchRandom12Products: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/product/random-12")
      set({ random12Products: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching random products:", error)
      set({
        isLoading: false,
        error: "Failed to fetch random products. Please try again.",
      })
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/category/all")
      set({ categories: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching categories:", error)
      set({
        isLoading: false,
        error: "Failed to fetch categories. Please try again.",
      })
    }
  },

    fetchTopBanners: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axios.get("/api/banner/top")
        set({ topBanners: response.data.result, isLoading: false })
      } catch (error) {
        console.error("Error fetching top banners:", error)
        set({ isLoading: false, error: "Failed to fetch top banners." })
      }
    },
  
    fetchAboutUsBanners: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axios.get("/api/banner/about-us")
        set({ aboutUsBanners: response.data.result, isLoading: false })
      } catch (error) {
        console.error("Error fetching about us banners:", error)
        set({ isLoading: false, error: "Failed to fetch about us banners." })
      }
    },
  
    fetchContactBanners: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axios.get("/api/banner/contact")
        set({ contactBanners: response.data.result, isLoading: false })
      } catch (error) {
        console.error("Error fetching contact banners:", error)
        set({ isLoading: false, error: "Failed to fetch contact banners." })
      }
    },

  fetchBlogs: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/blog/all")
      set({ blogs: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching blogs:", error)
      set({
        isLoading: false,
        error: "Failed to fetch blogs. Please try again.",
      })
    }
  },
}))

export default useProductStore
