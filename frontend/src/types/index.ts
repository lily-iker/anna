export interface ApiResponse {
  status: number
  message: string
  result: any
}

export interface Product {
  id: string
  name: string
  origin: string
  description: string
  thumbnailImage: string
  originalPrice: number
  sellingPrice: number
  discountPercentage: number
  unit: string
  stock: number
  minUnitToOrder: number
  createdAt: string
  updatedAt: string
  productImages: ProductImage[]
  categoryName: string
}

export interface ProductImage {
  id: string
  imageUrl: string
}

export interface Category {
  id: number
  name: string
  thumbnailImage: string
}

export interface Banner {
  id: number
  title: string
  thumbnailImage: string
  bannerType: string
}

export interface Blog {
  id: string
  title: string
  thumbnailImage: string
  sapo: string
  content: string
  author: string
  createdAt: string
}

export type Customer = {
  id: string
  name: string
  phoneNumber: string
  address: string
  email: string
  totalOrders: number
}

export interface OrderItem {
  id: string
  productId: string
  productThumbnailImage: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  estimatedDeliveryDate: string
  note: string
  totalPrice: number
  status: OrderStatus
  customerName: string
  createdAt: string
  items: OrderItem[]
}

export type OrderStatus = 'NEW' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
