import { Link } from 'react-router'
import Img from '../../../components/Img.tsx'
import type { FeaturedData } from '../useHomepage.ts'

interface FeaturedCategoriesProps {
  items: FeaturedData[]
}

function FeaturedCategories({ items }: FeaturedCategoriesProps) {
  if (items.length === 0) return null

  return (
    <section id="featured-cats">
      <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">Danh mục nổi bật</h2>
      <p className="text-center text-sm text-gray-500 mb-4">Các dòng sản phẩm thiết bị đo đạc nổi bật Trắc Địa Thiên Phú cung cấp.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((cat) => (
          <Link key={cat.id} to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`} className="bg-white rounded-xl border border-gray-200 hover:border-brand p-3 text-center transition-colors">
            <Img src={cat.imageUrl} fallback="https://placehold.co/276x276?text=No+Image" alt={cat.name} loading="lazy" className="w-full h-32 object-contain mx-auto" />
            <p className="mt-2 text-[13px] font-medium">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function FeaturedCategoriesSkeleton() {
  return (
    <div aria-label="Đang tải danh mục nổi bật">
      <div className="h-7 w-56 bg-gray-100 rounded mx-auto animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedCategories
