// import { Link } from 'react-router'
// import Img from '../../../components/Img.tsx'
// import { formatNewsDate, newsImage, type NewsResponse } from '../../../lib/api.ts'

// interface NewsSectionProps {
//   items: NewsResponse[]
// }

// function basePath(newsType: string): string {
//   return newsType === 'HIRING_PRODUCT' ? '/thue-san-pham' : '/tin-tuc'
// }

// function NewsSection({ items }: NewsSectionProps) {
//   if (items.length === 0) return null

//   return (
//     <section id="news">
//       <h2 className="text-lg md:text-xl font-bold text-gray-800 border-b-2 border-brand pb-2 mb-4">Tin tức</h2>
//       <div className="grid md:grid-cols-3 gap-4">
//         {items.map((item) => (
//           <Link key={item.id} to={`${basePath(item.newsType)}/${item.seoAlias}`} className="bg-white rounded-xl border overflow-hidden hover:border-brand">
//             <Img src={newsImage(item)} fallback="https://placehold.co/400x150?text=Tin+tuc" alt={item.title} loading="lazy" className="w-full h-36 object-cover" />
//             <div className="p-3">
//               <p className="text-[11px] text-gray-400">{formatNewsDate(item.updatedAt)}</p>
//               <p className="text-[13px] font-medium line-clamp-2">{item.title}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }

// export function NewsSectionSkeleton() {
//   return (
//     <div aria-label="Đang tải tin tức">
//       <div className="h-7 w-32 bg-gray-100 rounded animate-pulse" />
//       <div className="grid md:grid-cols-3 gap-4 mt-4">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="bg-white rounded-xl border overflow-hidden">
//             <div className="w-full h-36 bg-gray-100 animate-pulse" />
//             <div className="p-3">
//               <div className="h-4 bg-gray-100 rounded animate-pulse" />
//               <div className="h-4 w-2/3 bg-gray-100 rounded mt-1 animate-pulse" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default NewsSection
import { Link } from 'react-router'
import Img from '../../../components/Img.tsx'
import { formatNewsDate, newsImage, type NewsResponse } from '../../../lib/api.ts'

interface NewsSectionProps {
  items: NewsResponse[]
}

// Shared by the card image and the skeleton so layout doesn't jump while loading.
const IMAGE_SHAPE = 'w-full aspect-[2/1]'

function basePath(newsType: string): string {
  if (newsType === 'HIRING_PRODUCT') return '/thue-san-pham'
  if (newsType === 'CUSTOMER_NEWS') return '/khach-hang'
  if (newsType === 'REPAIR_AND_INSPECTION_NEWS') return '/sua-chua-va-kiem-dinh'
  return '/tin-tuc'
}

function NewsSection({ items }: NewsSectionProps) {
  if (items.length === 0) return null

  return (
    <section id="news">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 border-b-2 border-brand pb-2 mb-4">Tin tức</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const src = newsImage(item)
          const fallback = 'https://placehold.co/640x360?text=Tin+tuc'
          return (
            <Link
              key={item.id}
              to={`${basePath(item.newsType)}/${item.seoAlias}`}
              className="group bg-white rounded-xl border overflow-hidden hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
            >
              <div className={`relative overflow-hidden bg-gray-100 ${IMAGE_SHAPE}`}>
                {/* Blurred copy fills any empty space so the full image can stay uncropped */}
                <div aria-hidden="true" className="absolute inset-0">
                  <Img src={src} fallback={fallback} alt="" loading="lazy" className="w-full h-full object-cover scale-110 blur-2xl brightness-75" />
                </div>
                <Img src={src} fallback={fallback} alt={item.title} loading="lazy" className="relative w-full h-full object-contain" />
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xs text-gray-400">{formatNewsDate(item.updatedAt)}</p>
                <p className="text-sm md:text-base font-medium line-clamp-2 mt-1">{item.title}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function NewsSectionSkeleton() {
  return (
    <div aria-label="Đang tải tin tức">
      <div className="h-7 w-32 bg-gray-100 rounded animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border overflow-hidden">
            <div className={`${IMAGE_SHAPE} bg-gray-100 animate-pulse`} />
            <div className="p-3 md:p-4">
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded mt-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-100 rounded mt-1 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsSection
