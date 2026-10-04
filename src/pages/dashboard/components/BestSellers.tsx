import { useEffect, useRef, useState } from 'react'
import { bestSellers } from '../data.ts'
import ProductCard from './ProductCard.tsx'

function BestSellers() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = trackRef.current
      if (el && el.clientWidth > 0) setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const onScroll = () => {
    const el = trackRef.current
    if (el && el.clientWidth > 0) setPage(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (i: number) => {
    trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    if (paused || pages <= 1) return
    const id = setInterval(() => {
      goTo((page + 1) % pages)
    }, 5000)
    return () => clearInterval(id)
  }, [paused, page, pages])

  return (
    <section
      id="best-sellers"
      className="bg-brand rounded-xl p-4 md:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <h2 className="text-center text-white text-xl md:text-2xl font-bold">SẢN PHẨM BÁN CHẠY</h2>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-4 mt-4 overflow-x-auto snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bestSellers.map((product) => (
          <div key={product.name} className="shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/5 snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Trang ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full border border-white ${i === page ? 'bg-white' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </section>
  )
}

export default BestSellers
