import { bestSellers, categorySections, type Product } from '../dashboard/data.ts'
import { toSlug } from '../../utils/slug.ts'
import { products } from './data.ts'

const allProducts: Product[] = [
  ...products,
  ...bestSellers,
  ...categorySections.flatMap((section) => section.products),
]

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => toSlug(product.name) === slug)
}

export function getRelated(product: Product, count: number): Product[] {
  const slug = toSlug(product.name)
  const others = allProducts.filter((item) => toSlug(item.name) !== slug)
  const sameBrand = others.filter((item) => item.brand === product.brand)
  const rest = others.filter((item) => item.brand !== product.brand)
  const deduped = [...sameBrand, ...rest].filter(
    (item, index, list) => list.findIndex((other) => toSlug(other.name) === toSlug(item.name)) === index,
  )
  return deduped.slice(0, count)
}

export function getGalleryImages(product: Product): string[] {
  const siblings = allProducts
    .filter((item) => item.image !== product.image)
    .map((item) => item.image)
    .filter((image, index, list) => list.indexOf(image) === index)
  return [product.image, ...siblings].slice(0, 5)
}
