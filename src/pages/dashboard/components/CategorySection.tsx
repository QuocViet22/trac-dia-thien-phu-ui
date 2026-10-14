import { productImage, type ProductResponse } from '../../../lib/api.ts'
import ProductCard from './ProductCard.tsx'

interface CategorySectionProps {
  id: string
  title: string
  brands: string[]
  products: ProductResponse[]
}

function CategorySection({ id, title, brands, products }: CategorySectionProps) {
  return (
    <section id={id}>
      <div className="flex items-center gap-3 border-b-2 border-brand pb-2 mb-4 mt-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">{title}</h2>
        <div className="hidden md:flex gap-3 text-[12px] text-gray-500 overflow-x-auto">
          {brands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
        <a href="#" className="ml-auto text-[12px] text-brand font-medium whitespace-nowrap">Xem tất cả →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={productImage(product)}
            brand={product.brand ?? undefined}
            seoAlias={product.seoAlias ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}

export function CategorySectionSkeleton() {
  return (
    <div aria-label="Đang tải danh mục">
      <div className="h-7 w-48 bg-gray-100 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="w-full h-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySection
