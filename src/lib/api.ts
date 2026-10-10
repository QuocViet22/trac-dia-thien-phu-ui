export interface ImageDto {
  id: string
  name: string
  imageUrl: string
  sortOrder: number
}

export interface ProductResponse {
  id: string
  name: string
  skuCode: string | null
  description: string | null
  shortDescription: string | null
  seoAlias: string | null
  brand: string | null
  categoryId: string | null
  images: ImageDto[]
}

export interface CategoryResponse {
  id: string
  name: string
  seoAlias: string | null
  parentCategoryId: string | null
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const API_BASE: string = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080'
).replace(/\/+$/, '')

async function fetchData<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status}`)
  }
  const body = (await response.json()) as ApiResponse<T>
  if (!body.success) {
    throw new ApiError(response.status, body.message)
  }
  return body.data
}

export interface ProductQuery {
  page: number
  size: number
  categoryId?: string
  brand?: string
  sort?: string
}

export function listProducts(query: ProductQuery): Promise<Page<ProductResponse>> {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('size', String(query.size))
  if (query.categoryId) {
    params.set('categoryId', query.categoryId)
  }
  if (query.brand) {
    params.set('brand', query.brand)
  }
  if (query.sort) {
    params.set('sort', query.sort)
  }
  return fetchData<Page<ProductResponse>>(`/api/products?${params.toString()}`)
}

export function listCategories(): Promise<CategoryResponse[]> {
  return fetchData<CategoryResponse[]>('/api/categories')
}

export function getProductByAlias(alias: string): Promise<ProductResponse> {
  return fetchData<ProductResponse>(`/api/products/by-alias/${encodeURIComponent(alias)}`)
}

function sortedImages(product: ProductResponse): ImageDto[] {
  return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function productImage(product: ProductResponse): string {
  const images = sortedImages(product)
  return images.length > 0 ? images[0].imageUrl : ''
}

export function productImages(product: ProductResponse): string[] {
  return sortedImages(product).map((image) => image.imageUrl)
}
