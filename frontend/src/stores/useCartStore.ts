import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

export interface CartItem {
  productId: string
  quantity: number
  name: string
  price: number
  image: string | null
}

interface CartState {
  items: CartItem[]

  // Cart actions
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void

  // Cart calculations
  getItemCount: () => number
  getSubtotal: () => number
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        set((state) => {
          // Check if the item already exists in the cart
          const existingItemIndex = state.items.findIndex((item) => item.productId === product.id)

          // If item exists, update its quantity
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += quantity
            return { items: updatedItems }
          }

          // Otherwise, add new item to cart
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                name: product.name,
                price: product.sellingPrice || product.originalPrice,
                image: product.thumbnailImage,
              },
            ],
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          // If quantity is 0 or less, remove the item
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            }
          }

          // Otherwise, update the quantity
          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'shopping-cart', // name of the item in localStorage
      skipHydration: false, // ensure cart is loaded on page load
    }
  )
)

export default useCartStore
