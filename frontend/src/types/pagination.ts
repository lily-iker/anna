// Custom Spring Boot pagination response interface matching your backend
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
