export interface Product {
    id: string
    name: string
    originalPrice: number
    thumbnailImage: string
    discountPrice?: number
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
  