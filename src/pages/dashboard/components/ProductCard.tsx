import Img from '../../../components/Img.tsx'
import type { Product } from '../data.ts'

function ProductCard({ brand, name, image, badge }: Product) {
  return (
    <div className="product-card relative group bg-white rounded-xl border border-gray-200 hover:border-brand p-3 transition-colors">
      {badge && (
        <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded ${badge === 'Mới' ? 'bg-green-600' : 'bg-red-600'}`}>{badge}</span>
      )}
      <Img src={image} fallback="https://placehold.co/276x276?text=No+Image" alt={name} loading="lazy" className="w-full h-40 object-contain" />
      <p className="text-[11px] uppercase text-gray-500 mt-2">{brand}</p>
      <p className="text-[13px] font-medium line-clamp-2 h-10">{name}</p>
      <p className="font-bold text-brand text-[15px] mt-1">Liên hệ</p>
    </div>
  )
}

export default ProductCard
