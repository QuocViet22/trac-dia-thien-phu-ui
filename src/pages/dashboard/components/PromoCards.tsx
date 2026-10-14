import Img from '../../../components/Img.tsx'

interface PromoCardsProps {
  images: string[]
}

function PromoCards({ images }: PromoCardsProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image, i) => (
        <Img key={image || `promo-${i}`} src={image} fallback="https://placehold.co/300x150?text=Quang+cao" alt={`Quảng cáo ${i + 1}`} loading="lazy" className="w-full h-36 object-cover rounded-xl shadow-sm" />
      ))}
    </div>
  )
}

export function PromoCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Đang tải quảng cáo">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full h-36 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

export default PromoCards
