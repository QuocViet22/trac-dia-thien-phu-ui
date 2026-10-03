import Img from '../../../components/Img.tsx'
import { featuredCats } from '../data.ts'

function FeaturedCategories() {
  return (
    <section id="featured-cats">
      <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">Danh mục nổi bật</h2>
      <p className="text-center text-sm text-gray-500 mb-4">Các dòng sản phẩm thiết bị đo đạc nổi bật iGeo cung cấp.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {featuredCats.map((cat) => (
          <a key={cat.label} href="#" className="bg-white rounded-xl border border-gray-200 hover:border-brand p-3 text-center transition-colors">
            <Img src={cat.image} fallback="https://placehold.co/276x276?text=No+Image" alt={cat.label} loading="lazy" className="w-full h-32 object-contain mx-auto" />
            <p className="mt-2 text-[13px] font-medium">{cat.label}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories
