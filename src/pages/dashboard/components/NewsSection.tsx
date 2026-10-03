import Img from '../../../components/Img.tsx'
import { news } from '../data.ts'

function NewsSection() {
  return (
    <section id="news">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 border-b-2 border-[#f37021] pb-2 mb-4">Tin tức</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {news.map((item) => (
          <a key={item.title} href="#" className="bg-white rounded-xl border overflow-hidden hover:border-[#f37021]">
            <Img src={item.image} fallback="https://placehold.co/400x150?text=Tin+tuc" alt={item.title} loading="lazy" className="w-full h-36 object-cover" />
            <div className="p-3">
              <p className="text-[11px] text-gray-400">{item.date}</p>
              <p className="text-[13px] font-medium line-clamp-2">{item.title}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default NewsSection
