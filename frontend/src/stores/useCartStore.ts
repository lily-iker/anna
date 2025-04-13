import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'
import axios from '@/lib/axios-custom'

// Minimal cart item structure for localStorage
export interface CartItemMinimal {
  productId: string
  quantity: number
}

// Full cart item with product details
export interface CartItem {
  productId: string
  quantity: number
  name: string
  price: number
  image: string | null
  unit: string
  stock: number
  minUnitToOrder: number
}

interface CartState {
  // Store only minimal data in localStorage
  cartItems: CartItemMinimal[]

  // Full product details (not persisted)
  items: CartItem[]
  isLoading: boolean
  error: string | null

  // Cart actions
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void

  // Fetch product details from API
  fetchCartItems: () => Promise<void>

  // Cart calculations
  getItemCount: () => number
  getSubtotal: () => number
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      items: [],
      isLoading: false,
      error: null,

      addItem: (product, quantity) => {
        set((state) => {
          // Check if the item already exists in the cart
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.productId === product.id
          )

          let newCartItems: CartItemMinimal[]

          // If item exists, update its quantity
          if (existingItemIndex !== -1) {
            newCartItems = [...state.cartItems]
            newCartItems[existingItemIndex].quantity += quantity
          } else {
            // Otherwise, add new item to cart
            newCartItems = [
              ...state.cartItems,
              {
                productId: product.id,
                quantity,
              },
            ]
          }

          // Update the full items array as well for immediate UI update
          const existingFullItemIndex = state.items.findIndex(
            (item) => item.productId === product.id
          )
          const newItems = [...state.items]

          if (existingFullItemIndex !== -1) {
            newItems[existingFullItemIndex].quantity += quantity
          } else {
            newItems.push({
              productId: product.id,
              quantity,
              name: product.name,
              price: product.sellingPrice || product.originalPrice,
              image: product.thumbnailImage,
              unit: product.unit,
              stock: product.stock,
              minUnitToOrder: product.minUnitToOrder,
            })
          }

          return {
            cartItems: newCartItems,
            items: newItems,
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          // If quantity is 0 or less, remove the item
          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter((item) => item.productId !== productId),
              items: state.items.filter((item) => item.productId !== productId),
            }
          }

          // Otherwise, update the quantity in both arrays
          return {
            cartItems: state.cartItems.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId),
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      clearCart: () => {
        set({ cartItems: [], items: [] })
      },

      fetchCartItems: async () => {
        const { cartItems } = get()

        // If cart is empty, no need to fetch
        if (cartItems.length === 0) {
          set({ items: [], isLoading: false })
          return
        }

        set({ isLoading: true, error: null })

        try {
          // Extract product IDs from cart items
          const productIds = cartItems.map((item) => item.productId)
          console.log('Product IDs:', productIds)

          // Fetch product details from API
          const response = await axios.post('/api/product/by-ids', {
            productIds, // Send as request body
          })

          // Map API response to cart items with quantities
          const fetchedProducts = response.data.result
          const fullCartItems = fetchedProducts.map((product: Product) => {
            // Find quantity from cartItems
            const cartItem = cartItems.find((item) => item.productId === product.id)
            const quantity = cartItem ? cartItem.quantity : 0

            return {
              productId: product.id,
              quantity,
              name: product.name,
              price: product.sellingPrice || product.originalPrice,
              image: product.thumbnailImage,
              unit: product.unit,
              stock: product.stock,
              minUnitToOrder: product.minUnitToOrder,
            }
          })

          set({ items: fullCartItems, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch cart items:', error)
          set({ error: 'Failed to load cart items. Please try again.', isLoading: false })
        }
      },

      getItemCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'shopping-cart', // name of the item in localStorage
      skipHydration: false, // ensure cart is loaded on page load
      partialize: (state) => ({ cartItems: state.cartItems }), // Only persist cartItems to localStorage
    }
  )
)

export default useCartStore
