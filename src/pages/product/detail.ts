import {
  ApiError,
  getProductByAlias,
  listProducts,
  productImages,
  type ProductResponse,
} from '../../lib/api.ts'

export async function resolveProduct(seoAlias: string): Promise<ProductResponse | null> {
  try {
    return await getProductByAlias(seoAlias)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }
  }
  const firstPage = await listProducts({ page: 0, size: 100 })
  return (
    firstPage.content.find((product) => product.seoAlias === seoAlias) ?? null
  )
}

export async function getRelated(product: ProductResponse, count: number): Promise<ProductResponse[]> {
  if (!product.categoryId) {
    return []
  }
  const page = await listProducts({ page: 0, size: count + 1, categoryId: product.categoryId })
  return page.content.filter((item) => item.id !== product.id).slice(0, count)
}

export function getGalleryImages(product: ProductResponse): string[] {
  const images = productImages(product)
  return images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image']
}
