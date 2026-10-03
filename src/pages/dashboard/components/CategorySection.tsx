import Img from '../../../components/Img.tsx'
import type { CategorySectionData } from '../data.ts'
import ProductCard from './ProductCard.tsx'

function CategorySection({ id, title, brands, banners, products }: CategorySectionData) {
  return (
    <section id={id}>
      <div className="flex items-center gap-3 border-b-2 border-[#f37021] pb-2 mb-4 mt-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">{title}</h2>
        <div className="hidden md:flex gap-3 text-[12px] text-gray-500 overflow-x-auto">
          {brands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
        <a href="#" className="ml-auto text-[12px] text-[#f37021] font-medium whitespace-nowrap">Xem tất cả →</a>
      </div>
      {banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {banners.map((banner) => (
            <Img key={banner.image} src={banner.image} fallback="https://placehold.co/400x120?text=Banner" alt={banner.alt} loading="lazy" className="w-full h-28 object-cover rounded-xl" />
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection
