import { useEffect, useState } from 'react'
import Img from '../../../components/Img.tsx'
import type { SlideData } from '../useHomepage.ts'

interface HeroSliderProps {
  slides: SlideData[]
}

const ACTIVE_DOT = 'w-2.5 h-2.5 bg-sky-500 rounded-sm cursor-pointer shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'w-2.5 h-2.5 bg-sky-600 rounded-sm cursor-pointer opacity-50 hover:opacity-100 transition-opacity border border-white'

function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div id="hero-slider" className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md">
      {slides.map((slide, i) => (
        <div key={slide.id} className={`hero-slide absolute inset-0 ${current === i ? '' : 'hidden'}`}>
          <Img src={slide.image} fallback={`https://placehold.co/1200x400?text=Banner+${i + 1}`} alt={slide.alt} className="w-full h-full object-cover" />
        </div>
      ))}

      <div id="hero-dots" className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((slide, i) => (
          <button key={slide.id} aria-label={`Slide ${i + 1}`} data-slide={i} onClick={() => setCurrent(i)} className={i === current ? ACTIVE_DOT : INACTIVE_DOT}></button>
        ))}
      </div>
    </div>
  )
}

export function HeroSliderSkeleton() {
  return <div className="w-full h-[300px] md:h-[400px] rounded-xl bg-gray-100 animate-pulse" aria-label="Đang tải banner" />
}

export default HeroSlider
