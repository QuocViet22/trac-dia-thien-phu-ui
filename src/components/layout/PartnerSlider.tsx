import { useEffect, useState } from 'react'
import cem from '../../assets/footer_slider/Cem.png'
import garmin from '../../assets/footer_slider/Garmin.jpg'
import hiTarget from '../../assets/footer_slider/Hi-Target.jpg'
import sokkia from '../../assets/footer_slider/Sokkia.jpg'
import leica from '../../assets/footer_slider/Leica.png'
import nikon from '../../assets/footer_slider/Nikon.png'
import trimble from '../../assets/footer_slider/Trimble.png'

// Order matches the source screenshot.
const partners = [
  { name: 'Leica', src: leica },
  { name: 'Sokkia', src: sokkia },
  { name: 'Hi-Target', src: hiTarget },
  { name: 'Nikon', src: nikon },
  { name: 'Trimble', src: trimble },
  { name: 'Garmin', src: garmin },
  { name: 'CEM', src: cem },
]

// One page = one full grid: a single row of 2 logos on mobile, 5 in a row on desktop.
const DESKTOP_QUERY = '(min-width: 768px)'
const MOBILE_CHUNK = 2
const DESKTOP_CHUNK = 5
const AUTOPLAY_MS = 5000
const chunkFor = (desktop: boolean) => (desktop ? DESKTOP_CHUNK : MOBILE_CHUNK)

const ACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-500 rounded-sm shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-600 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity border border-white'

function PartnerSlider() {
  const [current, setCurrent] = useState(0)
  // Two sources, because hovering a dot must not clear a pause the user asked for.
  const [hovered, setHovered] = useState(false)
  const [chunk, setChunk] = useState(() => chunkFor(window.matchMedia(DESKTOP_QUERY).matches))

  const totalPages = Math.ceil(partners.length / chunk)
  const pages = Array.from({ length: totalPages }, (_, page) => page)
  // Guard against `current` pointing past the end, same as HeroSlider.
  const active = current < totalPages ? current : 0

  // Page size follows the breakpoint, so a resize re-slices instead of stretching one page.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setChunk(chunkFor(mql.matches))
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (totalPages < 2 || hovered) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // setTimeout re-armed whenever `active` changes: a dot click restarts the 5s countdown.
    const id = setTimeout(() => {
      setCurrent((active + 1) % totalPages)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [hovered, active, totalPages])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Các thương hiệu lớn"
      className="bg-white py-6"
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
            aria-label={`${page + 1} / ${totalPages}`}
            // `hidden` must win over `grid`: Tailwind emits .grid before .hidden, so the order below is load-bearing.
            className={`grid grid-cols-2 md:grid-cols-5 gap-6 items-center ${page === active ? '' : 'hidden'}`}
          >
            {partners.slice(page * chunk, page * chunk + chunk).map((partner) => (
              <img
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                loading="lazy"
                className="h-20 md:h-22 w-auto max-w-full object-contain mx-auto"
              />
            ))}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
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
          {/* <button
            type="button"
            aria-label={stopped ? 'Chạy tiếp logo thương hiệu' : 'Tạm dừng logo thương hiệu'}
            aria-pressed={stopped}
            onClick={() => setStopped((value) => !value)}
            className="p-1.5 cursor-pointer text-gray-400 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
          >
            <i className={`fa-solid ${stopped ? 'fa-play' : 'fa-pause'} text-xs`} aria-hidden="true"></i>
          </button> */}
        </div>
      )}
    </section>
  )
}

export default PartnerSlider
