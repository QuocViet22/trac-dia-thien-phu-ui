import { useEffect, useState } from 'react'
import Img from '../../../components/Img.tsx'
import type { SlideData } from '../useHomepage.ts'

interface HeroSliderProps {
  slides: SlideData[]
}

const AUTOPLAY_MS = 5000

// Shared by the slider and the skeleton so the layout never jumps while loading.
// Mobile: 4:3, desktop: 16:9. Change these two values to make it taller/shorter.
const SLIDER_SHAPE = 'w-full aspect-[4/3] md:aspect-[16/9] rounded-xl'

const ACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-500 rounded-sm shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-600 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity border border-white'

function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // Guard against `slides` shrinking while `current` points past the end.
  const active = current < slides.length ? current : 0

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // setTimeout (re-armed whenever `active` changes) means a manual dot click
    // restarts the 5s countdown instead of advancing again a moment later.
    const id = setTimeout(() => {
      setCurrent((active + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [slides.length, paused, active])

  if (slides.length === 0) return null

  return (
    <section
      id="hero-slider"
      aria-roledescription="carousel"
      aria-label="Banner"
      className={`relative overflow-hidden shadow-md bg-gray-100 ${SLIDER_SHAPE}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const fallback = `https://placehold.co/1280x720?text=Banner+${i + 1}`
        const isActive = active === i
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
            className={`hero-slide absolute inset-0 ${isActive ? '' : 'hidden'}`}
          >
            {/* Blurred copy fills the letterbox bars so the full image can stay uncropped */}
            <Img
              src={slide.image}
              fallback={fallback}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-75"
            />
            <Img
              src={slide.image}
              fallback={fallback}
              alt={slide.alt}
              className="relative w-full h-full object-contain"
            />
          </div>
        )
      })}

      {slides.length > 1 && (
        <div id="hero-dots" className="absolute bottom-2 left-1/2 -translate-x-1/2 flex z-20">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              data-slide={i}
              onClick={() => setCurrent(i)}
              // p-1.5 enlarges the tap target well beyond the 10px dot itself
              className="group p-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className={i === active ? ACTIVE_DOT : INACTIVE_DOT} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export function HeroSliderSkeleton() {
  return <div className={`${SLIDER_SHAPE} bg-gray-100 animate-pulse`} aria-label="Đang tải banner" />
}

export default HeroSlider
