export interface Page<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Pagination parameters for requests
export interface ProductPaginationParams {
  page: number
  size: number
  name?: string
  origin?: string
  minPrice?: number
  maxPrice?: number
  categoryName?: string
  sort?: string
}

export interface OrderPaginationParams {
  page: number
  size: number
  status?: string
  customerName?: string
  fromDate?: string
  toDate?: string
  sort?: string
}
