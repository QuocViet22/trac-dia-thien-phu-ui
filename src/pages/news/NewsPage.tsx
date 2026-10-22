import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { formatNewsDate, listNews, newsImage, type NewsResponse, type NewsType } from '../../lib/api.ts'
import Img from '../../components/Img.tsx'

const PAGE_SIZE = 10

interface NewsPageProps {
  newsType: NewsType
  title: string
  emptyText: string
  basePath: string
}

function NewsPage({ newsType, title, emptyText, basePath }: NewsPageProps) {
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
    listNews({ page, size: PAGE_SIZE, newsType })
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
  }, [page, newsType, reloadKey])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      {loading ? (
        <div className="flex flex-col gap-4" aria-label="Đang tải tin tức">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-[320px_1fr] animate-pulse">
              <div className="w-full h-48 bg-gray-100 rounded" />
              <div>
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
                <div className="h-4 bg-gray-100 rounded mt-2" />
                <div className="h-4 bg-gray-100 rounded w-5/6 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : failed ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="font-bold text-gray-900 mb-1">Không tải được tin tức. Vui lòng thử lại.</p>
          <button type="button" onClick={retry} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">{emptyText}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <Link key={item.id} to={`${basePath}/${item.seoAlias}`} className="grid gap-4 md:grid-cols-[320px_1fr] items-start group">
              <Img src={newsImage(item)} fallback="https://placehold.co/640x360?text=No+Image" alt={item.title} loading="lazy" className="w-full h-48 object-cover rounded" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{formatNewsDate(item.updatedAt)} - {item.author}{item.location?.trim() ? ` - ${item.location.trim()}` : ''}</p>
                {item.seoDescriptionTag && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.seoDescriptionTag}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      <nav aria-label="Phân trang" className="flex justify-center gap-1.5 mt-6">
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
    </div>
  )
}

export default NewsPage
