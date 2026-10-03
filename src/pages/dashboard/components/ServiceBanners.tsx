import Img from '../../../components/Img.tsx'
import { serviceBanners } from '../data.ts'

function ServiceBanners() {
  return (
    <section id="service-banners" className="grid md:grid-cols-3 gap-4">
      {serviceBanners.map((banner) => (
        <Img key={banner.image} src={banner.image} fallback="https://placehold.co/400x130?text=Dich+vu" alt={banner.alt} loading="lazy" className="w-full h-32 object-cover rounded-xl" />
      ))}
    </section>
  )
}

export default ServiceBanners
