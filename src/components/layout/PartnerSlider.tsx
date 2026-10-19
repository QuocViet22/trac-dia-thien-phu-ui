import { useEffect, useState } from 'react'
import cem from '../../assets/footer_slider/Cem.png'
import garmin from '../../assets/footer_slider/Garmin.jpg'
import hiTarget from '../../assets/footer_slider/Hi-Target.jpg'
import precise from '../../assets/footer_slider/Precise.png'
import sokkia from '../../assets/footer_slider/Sokkia.jpg'

// Order matches the source screenshot: Sokkia, Hi-Target, Precise, Garmin, CEM.
const partners = [
  { name: 'Garmin', src: garmin },
  { name: 'CEM', src: cem },
  { name: 'Precise', src: precise },
  { name: 'Hi-Target', src: hiTarget },
  { name: 'Sokkia', src: sokkia },
]

// 5 logos fill one row (`grid-cols-2` on mobile, 5 on desktop), so a 5-logo set is a
// static band: the dots, autoplay and pause control only render once a 6th logo appears.
const CHUNK = 5
const AUTOPLAY_MS = 5000
const TOTAL_PAGES = Math.ceil(partners.length / CHUNK)

const ACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-500 rounded-sm shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-600 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity border border-white'

const pages = Array.from({ length: TOTAL_PAGES }, (_, page) => page)

function PartnerSlider() {
  const [current, setCurrent] = useState(0)
  // Two sources, because hovering a dot must not clear a pause the user asked for.
  const [hovered, setHovered] = useState(false)
  const [stopped, setStopped] = useState(false)

  // Guard against `current` pointing past the end, same as HeroSlider.
  const active = current < TOTAL_PAGES ? current : 0

  useEffect(() => {
    if (TOTAL_PAGES < 2 || hovered || stopped) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // setTimeout re-armed whenever `active` changes: a dot click restarts the 5s countdown.
    const id = setTimeout(() => {
      setCurrent((active + 1) % TOTAL_PAGES)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [hovered, stopped, active])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Các thương hiệu lớn"
      className="bg-white py-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ background: '#EBF3F9' }}
    >
      <h2 className="text-center text-base font-bold uppercase tracking-widest text-gray-700 mb-6">CÁC THƯƠNG HIỆU LỚN</h2>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {pages.map((page) => (
          <div
            key={page}
            role="group"
            aria-roledescription="slide"
            aria-label={`${page + 1} / ${TOTAL_PAGES}`}
            // `hidden` must win over `grid`: Tailwind emits .grid before .hidden, so the order below is load-bearing.
            className={`grid grid-cols-2 md:grid-cols-5 gap-6 items-center ${page === active ? '' : 'hidden'}`}
          >
            {partners.slice(page * CHUNK, page * CHUNK + CHUNK).map((partner) => (
              <img
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                loading="lazy"
                className="h-10 md:h-12 w-auto max-w-full object-contain mx-auto"
              />
            ))}
          </div>
        ))}
      </div>
      {TOTAL_PAGES > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Thương hiệu ${page + 1}`}
              aria-current={page === active ? 'true' : undefined}
              onClick={() => setCurrent(page)}
              // p-1.5 enlarges the tap target well beyond the 10px dot itself
              className="group p-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className={page === active ? ACTIVE_DOT : INACTIVE_DOT} />
            </button>
          ))}
          {/* WCAG 2.2.2: auto-rotating content needs a control that works for keyboard and AT users, not just hover. */}
          <button
            type="button"
            aria-label={stopped ? 'Chạy tiếp logo thương hiệu' : 'Tạm dừng logo thương hiệu'}
            aria-pressed={stopped}
            onClick={() => setStopped((value) => !value)}
            className="p-1.5 cursor-pointer text-gray-400 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
          >
            <i className={`fa-solid ${stopped ? 'fa-play' : 'fa-pause'} text-xs`} aria-hidden="true"></i>
          </button>
        </div>
      )}
    </section>
  )
}

export default PartnerSlider
