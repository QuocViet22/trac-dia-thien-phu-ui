import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError, formatNewsDate, getNewsByAlias, newsImage, type NewsDetailResponse, type NewsType } from '../../lib/api.ts'
import { sanitizeHtml } from '../../lib/sanitize.ts'
import Img from '../../components/Img.tsx'

type LoadStatus = 'loading' | 'missing' | 'error' | 'ready'

interface Snapshot {
  key: string
  status: LoadStatus
  news: NewsDetailResponse | null
}

interface NewsDetailPageProps {
  newsType: NewsType
  listTitle: string
  listPath: string
}

function NewsDetailPage({ newsType, listTitle, listPath }: NewsDetailPageProps) {
  const { slug = '' } = useParams()
  const [snapshot, setSnapshot] = useState<Snapshot>({ key: '', status: 'loading', news: null })
  const [reloadKey, setReloadKey] = useState(0)

  const key = `${slug}#${reloadKey}`

  useEffect(() => {
    if (snapshot.key === key) {
      return
    }
    let cancelled = false
    getNewsByAlias(slug)
      .then((data) => {
        if (cancelled) return
        if (data.newsType !== newsType) {
          setSnapshot({ key, status: 'missing', news: null })
          return
        }
        setSnapshot({ key, status: 'ready', news: data })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setSnapshot({ key, status: error instanceof ApiError && error.status === 404 ? 'missing' : 'error', news: null })
      })
    return () => {
      cancelled = true
    }
  }, [slug, newsType, reloadKey, key, snapshot.key])

  const current: Snapshot = snapshot.key === key ? snapshot : { key, status: 'loading', news: null }
  const news = current.news

  const safeHtml = useMemo(() => sanitizeHtml(news?.description ?? null), [news])

  if (current.status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 animate-pulse" aria-label="Đang tải tin tức">
        <div className="h-4 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="h-7 w-2/3 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-100 rounded mb-4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (current.status === 'missing') {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Tin tức không tồn tại</p>
        <Link to={listPath} className="text-brand hover:underline">Quay lại {listTitle}</Link>
      </div>
    )
  }

  if (current.status === 'error' || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Không tải được tin tức. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to={listPath} className="hover:text-brand">{listTitle}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{news.title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{news.title}</h1>
      <p className="text-sm text-gray-500 mt-2">Đăng bởi: {news.author} - Vào lúc {formatNewsDate(news.updatedAt)} </p>
      <Img src={newsImage(news)} fallback="https://placehold.co/1024x576?text=No+Image" alt={news.title} loading="eager" className="w-full rounded-xl mt-4 object-cover" />
      {news.seoDescriptionTag && <p className="text-base text-gray-700 font-medium mt-4">{news.seoDescriptionTag}</p>}
      {safeHtml && (
        <div
          className="text-base text-gray-800 mt-4 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-xl [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      )}
    </article>
  )
}

export default NewsDetailPage
