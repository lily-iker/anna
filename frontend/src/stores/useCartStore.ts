import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'
import axios from '@/lib/axios-custom'
import toast from 'react-hot-toast'

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

  // Selected items for checkout
  selectedItemIds: string[]

  // Full product details (not persisted)
  items: CartItem[]
  isLoading: boolean
  error: string | null

  // Cart actions
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setSelectedItems: (productIds: string[]) => void

  // Fetch product details from API
  fetchCartItems: () => Promise<void>

  // Cart calculations
  getItemCount: () => number
  getSubtotal: () => number
  getSelectedItems: () => CartItem[]

  // Get existing quantity in cart
  getExistingQuantity: (productId: string) => number
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      selectedItemIds: [],
      items: [],
      isLoading: false,
      error: null,

      getExistingQuantity: (productId: string) => {
        const existingItem = get().cartItems.find((item) => item.productId === productId)
        return existingItem ? existingItem.quantity : 0
      },

      addItem: (product, quantity) => {
        const existingQuantity = get().getExistingQuantity(product.id)
        const totalQuantity = existingQuantity + quantity

        // Check if adding this quantity would exceed stock
        if (totalQuantity > product.stock) {
          toast.error(
            `Không thể thêm ${quantity} ${product.unit}. Chỉ còn ${
              product.stock - existingQuantity
            } ${product.unit} trong kho.`
          )
          return
        }

        // Check minimum order quantity if this is a new item in cart
        if (existingQuantity === 0 && quantity < product.minUnitToOrder) {
          toast.error(
            `Sản phẩm này yêu cầu đặt tối thiểu ${product.minUnitToOrder} ${product.unit}.`
          )
          return
        }

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

          toast.success(`Đã thêm ${quantity} ${product.unit} ${product.name} vào giỏ hàng!`)

          return {
            cartItems: newCartItems,
            items: newItems,
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        // Get the current item to check minUnitToOrder
        const currentItem = get().items.find((item) => item.productId === productId)

        if (!currentItem) return

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        // Check if the new quantity is below minimum order quantity
        if (quantity < currentItem.minUnitToOrder) {
          toast.error(
            `Sản phẩm này yêu cầu đặt tối thiểu ${currentItem.minUnitToOrder} ${currentItem.unit}.`
          )
          return
        }

        // Check if the new quantity exceeds stock
        if (quantity > currentItem.stock) {
          toast.error(`Không thể thêm. Chỉ còn ${currentItem.stock} ${currentItem.unit} trong kho.`)
          return
        }

        set((state) => {
          // Update the quantity in both arrays
          const newCartItems = state.cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )

          const newItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )

          // If this item is now out of stock, remove it from selected items
          let newSelectedItemIds = [...state.selectedItemIds]
          const updatedItem = newItems.find((item) => item.productId === productId)

          if (updatedItem && updatedItem.stock < updatedItem.quantity) {
            newSelectedItemIds = newSelectedItemIds.filter((id) => id !== productId)
          }

          return {
            cartItems: newCartItems,
            items: newItems,
            selectedItemIds: newSelectedItemIds,
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId),
          items: state.items.filter((item) => item.productId !== productId),
          selectedItemIds: state.selectedItemIds.filter((id) => id !== productId),
        }))
      },

      clearCart: () => {
        set({ cartItems: [], items: [], selectedItemIds: [] })
      },

      setSelectedItems: (productIds) => {
        // Filter out any out-of-stock items
        const { items } = get()
        const validProductIds = productIds.filter((id) => {
          const item = items.find((item) => item.productId === id)
          return item && item.stock >= item.quantity
        })

        console.log('Setting selected items in store:', validProductIds)
        set({ selectedItemIds: validProductIds })
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

          // Fetch product details from API
          const response = await axios.post('/api/product/get-by-ids', {
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

          // Update selected items to remove any out-of-stock items
          const currentSelectedIds = get().selectedItemIds
          const validSelectedIds = currentSelectedIds.filter((id) => {
            const item = fullCartItems.find((item: CartItem) => item.productId === id)
            return item && item.stock >= item.quantity
          })

          set({
            items: fullCartItems,
            isLoading: false,
            selectedItemIds: validSelectedIds,
          })
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

      getSelectedItems: () => {
        const { items, selectedItemIds } = get()
        return items.filter((item) => selectedItemIds.includes(item.productId))
      },
    }),
    {
      name: 'shopping-cart', // name of the item in localStorage
      skipHydration: false, // ensure cart is loaded on page load
      partialize: (state) => ({
        cartItems: state.cartItems,
        selectedItemIds: state.selectedItemIds,
      }), // Persist both cartItems and selectedItemIds to localStorage
    }
  )
)

export default useCartStore
