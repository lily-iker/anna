import { create } from "zustand"
import axios from "@/lib/axios-custom"
import type { Product, Category, Banner, Blog } from "@/types"

interface ProductStoreState {
  // State
  isLoading: boolean
  error: string | null

  // Data
  newProducts: Product[]
  bestSellingProducts: Product[]
  categories: Category[]
  banners: Banner[]
  blogs: Blog[]

  // Actions
  fetchNewProducts: () => Promise<void>
  fetchBestSellingProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchBanners: () => Promise<void>
  fetchBlogs: () => Promise<void>
}

const useProductStore = create<ProductStoreState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,

  newProducts: [],
  bestSellingProducts: [],
  categories: [],
  banners: [],
  blogs: [],

  // Actions
  fetchNewProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/product/all")
      set({ newProducts: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching new products:", error)
      set({
        isLoading: false,
        error: "Failed to fetch new products. Please try again.",
      })
    }
  },

  fetchBestSellingProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/products/best-selling")
      set({ bestSellingProducts: response.data, isLoading: false })
    } catch (error) {
      console.error("Error fetching best selling products:", error)
      set({
        isLoading: false,
        error: "Failed to fetch best selling products. Please try again.",
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

  fetchBanners: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await axios.get("/api/banner/all")
      set({ banners: response.data.result, isLoading: false })
    } catch (error) {
      console.error("Error fetching banners:", error)
      set({
        isLoading: false,
        error: "Failed to fetch banners. Please try again.",
      })
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
