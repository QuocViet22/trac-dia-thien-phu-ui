import { Link } from 'react-router'
import Img from '../../../components/Img.tsx'

interface ProductCardProps {
  name: string
  image: string
  brand?: string
  badge?: 'Mới' | 'Hot'
  seoAlias?: string
}

function ProductCard({ brand, name, image, badge, seoAlias }: ProductCardProps) {
  return (
    <Link to={seoAlias ? `/san-pham/${seoAlias}` : '/san-pham'} className="product-card block relative group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-brand p-3 pt-8 transition-colors">
      {badge && (
        <span className={`absolute top-0 left-0 text-white text-[10px] font-bold pl-2 pr-3 py-1 ${badge === 'Mới' ? 'bg-emerald-700' : 'bg-red-600'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>{badge.toUpperCase()}</span>
      )}
      <Img src={image} fallback="https://placehold.co/276x276?text=No+Image" alt={name} loading="lazy" className="w-full h-40 object-contain transition-transform duration-300 motion-safe:group-hover:scale-110" />
      {brand && <p className="text-[11px] uppercase text-gray-500 mt-2">{brand}</p>}
      <br />
      <p className="text-[13px] font-medium line-clamp-2 h-10">{name}</p>
      <p className="font-bold text-brand text-[15px] mt-1">Liên hệ</p>
      <p className="text-gray-300 text-xs tracking-widest">★★★★★</p>
    </Link>
  )
}

export default ProductCard
