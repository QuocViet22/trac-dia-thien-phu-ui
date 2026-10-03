import { useEffect, useState } from 'react'
import Img from '../../../components/Img.tsx'
import type { Slide } from '../data.ts'

interface HeroSliderProps {
  slides: Slide[]
}

const ACTIVE_DOT = 'w-2.5 h-2.5 bg-orange-500 rounded-sm cursor-pointer shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'w-2.5 h-2.5 bg-orange-600 rounded-sm cursor-pointer opacity-50 hover:opacity-100 transition-opacity border border-white'

function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <div id="hero-slider" className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md">
      <div className={`hero-slide absolute inset-0 bg-gradient-to-r from-[#7a6a57] via-[#b67332] to-[#e47e25] flex items-center px-6 md:px-12 ${current === 0 ? '' : 'hidden'}`}>
        <div className="relative z-10 w-full md:w-1/2 text-white">
          <p className="text-sm md:text-base font-light tracking-wide mb-2 opacity-90 uppercase">IGEO SYSTEM</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-1 leading-tight">ĐỘC QUYỀN</h2>
          <h1 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-md">MÁY GNSS RTK</h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">HI-TARGET</h2>
          <p className="text-sm md:text-lg mb-6 font-medium text-yellow-200 uppercase tracking-widest">FIX TỐT CẢ BUỔI CHIỀU</p>

          <div className="flex items-center gap-0">
            <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-2.5 px-6 rounded-l-full shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all">MUA NGAY</button>
            <div className="bg-white text-gray-700 py-2.5 px-6 rounded-r-full font-medium shadow-lg flex items-center">
              igeostore.vn <i className="fa-solid fa-chevron-right ml-2 text-xs text-orange-500"></i>
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 bottom-0 top-0 w-1/2 h-full">
          <Img src="https://igeostore.vn/storage/may-gnss-rtk-efix-1.png" fallback="https://placehold.co/600x400?text=GNSS+RTK" alt="Máy GNSS RTK" className="absolute w-full h-full object-contain object-right-bottom pb-4 pr-4 z-10" />
        </div>
      </div>

      {slides.slice(1).map((slide, i) => (
        <div key={slide.image} className={`hero-slide absolute inset-0 ${current === i + 1 ? '' : 'hidden'}`}>
          <Img src={slide.image} fallback={`https://placehold.co/1200x400?text=Banner+${i + 1}`} alt={slide.alt} className="w-full h-full object-cover" />
        </div>
      ))}

      <div id="hero-dots" className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((slide, i) => (
          <button key={slide.image || `slide-${i}`} aria-label={`Slide ${i + 1}`} data-slide={i} onClick={() => setCurrent(i)} className={i === current ? ACTIVE_DOT : INACTIVE_DOT}></button>
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
