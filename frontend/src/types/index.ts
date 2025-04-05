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
  id: number
  title: string
  thumbnailImage: string
  sapo: string
  content: string
  author: string
}
