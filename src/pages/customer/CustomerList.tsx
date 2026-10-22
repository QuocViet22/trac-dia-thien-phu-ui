import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Img from '../../components/Img.tsx'
import { listNews, newsImage, type NewsResponse } from '../../lib/api.ts'
import './CustomerList.css'

const PAGE_SIZE = 12
const PHONE = '0972.819.598'
const WEBSITE = 'https://igeostore.vn/'
const IMAGE_FALLBACK = 'https://placehold.co/300x300?text=No+Image'

/* ---------- icons ---------- */

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5V6.5z" />
    <path d="M9 4v13.5M15 6.5V20" />
    <circle cx="12" cy="10.5" r="1.3" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </svg>
);

/* ---------- card ---------- */

function CustomerCard({ news }: { news: NewsResponse }) {
  const location = news.location?.trim() ?? ''
  const photo = newsImage(news)
  const bannerTitle = location ? `Bàn giao máy RTK tại tỉnh ${location}` : 'Bàn giao máy RTK'

  return (
    <li className="cl-card">
      <Link className="cl-card__link" to={`/khach-hang/${news.seoAlias}`}>
        <div className="cl-card__banner">
          <div className="cl-card__accent" />
          <div className="cl-card__banner-text">
            <p className="cl-card__banner-title">{bannerTitle}</p>
            <div className="cl-card__banner-meta">
              <PhoneIcon />
              <span>{PHONE}</span>
            </div>
            <div className="cl-card__banner-meta">
              <GlobeIcon />
              <span>{WEBSITE}</span>
            </div>
          </div>
          {photo ? (
            <Img
              className="cl-card__photo"
              src={photo}
              fallback={IMAGE_FALLBACK}
              alt=""
              loading="lazy"
            />
          ) : (
            <div className="cl-card__photo" aria-hidden="true" />
          )}
        </div>

        <div className="cl-card__body">
          {location && (
            <span className="cl-card__province">
              <MapIcon />
              {location}
            </span>
          )}
          <h3 className="cl-card__name">{news.title}</h3>
        </div>
      </Link>
    </li>
  )
}

/* ---------- page ---------- */

export default function CustomerList() {
  const [items, setItems] = useState<NewsResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const goToPage = (next: number) => {
    setPage(next)
    setLoading(true)
    setFailed(false)
  }

  const retry = () => {
    setReloadKey((key) => key + 1)
    setLoading(true)
    setFailed(false)
  }

  useEffect(() => {
    let cancelled = false
    listNews({ page, size: PAGE_SIZE, newsType: 'CUSTOMER_NEWS' })
      .then((data) => {
        if (cancelled) return
        setItems(data.content)
        setTotalPages(Math.max(1, data.totalPages))
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setFailed(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, reloadKey])

  return (
    <section className="cl">
      <header className="cl__header">
        <h2 className="cl__title">Khách hàng</h2>
        <p className="cl__subtitle">Hình ảnh bàn giao sản phẩm tới khách hàng trên toàn quốc</p>
      </header>

      {loading ? (
        <ul className="cl__grid" aria-label="Đang tải khách hàng">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="cl-card cl__skeleton">
              <div className="cl__skeleton-banner" />
              <div className="cl__skeleton-body">
                <div className="cl__skeleton-line cl__skeleton-line--short" />
                <div className="cl__skeleton-line" />
              </div>
            </li>
          ))}
        </ul>
      ) : failed ? (
        <div className="cl__state">
          <p className="cl__state-title">Không tải được khách hàng. Vui lòng thử lại.</p>
          <button type="button" onClick={retry} className="cl__retry">
            Tải lại
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="cl__state">
          <p>Chưa có khách hàng nào.</p>
        </div>
      ) : (
        <>
          <ul className="cl__grid">
            {items.map((news) => (
              <CustomerCard key={news.id} news={news} />
            ))}
          </ul>
          <nav aria-label="Phân trang" className="flex justify-center gap-1.5 mt-8">
            <button type="button" aria-label="Trang trước" disabled={page === 0} onClick={() => goToPage(Math.max(0, page - 1))} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">«</button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Trang ${index + 1}`}
                aria-current={index === page ? 'page' : undefined}
                onClick={() => goToPage(index)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm ${index === page ? 'border-brand text-brand font-bold' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" aria-label="Trang tiếp" disabled={page >= totalPages - 1} onClick={() => goToPage(page + 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">»</button>
          </nav>
        </>
      )}
    </section>
  )
}
