import Img from '../../../components/Img.tsx'
import type { SlideData } from '../useHomepage.ts'

interface ServiceBannersProps {
  banners: SlideData[]
}

function ServiceBanners({ banners }: ServiceBannersProps) {
  if (banners.length === 0) return null

  return (
    <section id="service-banners" className="grid md:grid-cols-3 gap-4">
      {banners.map((banner) => (
        <Img key={banner.id} src={banner.image} fallback="https://placehold.co/400x130?text=Dich+vu" alt={banner.alt} loading="lazy" className="w-full h-32 object-cover rounded-xl" />
      ))}
    </section>
  )
}

export function ServiceBannersSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-4" aria-label="Đang tải dịch vụ">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full h-32 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

export default ServiceBanners
