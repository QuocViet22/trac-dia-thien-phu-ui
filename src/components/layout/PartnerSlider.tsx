import { useEffect, useState } from 'react'
import chcnav from '../../assets/footer_slider/CHCNAV.webp'
import foif from '../../assets/footer_slider/FOIF.webp'
import geomax from '../../assets/footer_slider/GEOMAX.webp'
import hiTarget from '../../assets/footer_slider/Hi-Target.webp'
import leica from '../../assets/footer_slider/Leica.webp'
import meridian from '../../assets/footer_slider/Meridian.webp'
import nikon from '../../assets/footer_slider/Nikon.webp'
import sokkia from '../../assets/footer_slider/Sokkia.webp'

const partners = [
  { name: 'CHCNAV', src: chcnav },
  { name: 'FOIF', src: foif },
  { name: 'GEOMAX', src: geomax },
  { name: 'Hi-Target', src: hiTarget },
  { name: 'Leica', src: leica },
  { name: 'Meridian', src: meridian },
  { name: 'Nikon', src: nikon },
  { name: 'Sokkia', src: sokkia },
]

// 4 logos per page: 8 logos -> 2 evenly filled pages (`grid-cols-2` on mobile, 4 in one row on desktop).
const CHUNK = 4
const AUTOPLAY_MS = 5000
const TOTAL_PAGES = Math.ceil(partners.length / CHUNK)

const ACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-500 rounded-sm shadow-[0_0_0_1px_white]'
const INACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-600 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity border border-white'

const pages = Array.from({ length: TOTAL_PAGES }, (_, page) => page)

function PartnerSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // Guard against `current` pointing past the end, same as HeroSlider.
  const active = current < TOTAL_PAGES ? current : 0

  useEffect(() => {
    if (TOTAL_PAGES < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // setTimeout re-armed whenever `active` changes: a dot click restarts the 5s countdown.
    const id = setTimeout(() => {
      setCurrent((active + 1) % TOTAL_PAGES)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [paused, active])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Đối tác"
      className="bg-white py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 className="text-center text-base font-bold uppercase tracking-widest text-gray-700 mb-6">ĐỐI TÁC</h2>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {pages.map((page) => (
          <div
            key={page}
            role="group"
            aria-roledescription="slide"
            aria-label={`${page + 1} / ${TOTAL_PAGES}`}
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 items-center ${page === active ? '' : 'hidden'}`}
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
        <div className="flex justify-center mt-6">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Đối tác ${page + 1}`}
              aria-current={page === active ? 'true' : undefined}
              onClick={() => setCurrent(page)}
              // p-1.5 enlarges the tap target well beyond the 10px dot itself
              className="group p-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className={page === active ? ACTIVE_DOT : INACTIVE_DOT} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default PartnerSlider
