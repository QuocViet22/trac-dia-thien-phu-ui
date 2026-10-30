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

export function getGalleryImages(product: ProductResponse): string[] {
  const images = productImages(product)
  return images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image']
}
