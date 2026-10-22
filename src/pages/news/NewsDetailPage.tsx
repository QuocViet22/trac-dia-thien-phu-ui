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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 animate-pulse" aria-label="Đang tải tin tức">
        <div className="h-4 w-2/3 sm:w-1/3 bg-gray-100 rounded mb-3" />
        <div className="h-6 sm:h-7 w-full sm:w-2/3 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-1/2 sm:w-1/4 bg-gray-100 rounded mb-4" />
        <div className="aspect-video bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (current.status === 'missing') {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Tin tức không tồn tại</p>
        <Link to={listPath} className="inline-flex items-center min-h-11 text-brand hover:underline">Quay lại {listTitle}</Link>
      </div>
    )
  }

  if (current.status === 'error' || !news) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Không tải được tin tức. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 min-h-11 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 pb-[max(2rem,env(safe-area-inset-bottom))] overflow-x-clip">
      <nav aria-label="Breadcrumb" className="flex items-center min-w-0 whitespace-nowrap text-xs sm:text-sm text-gray-500 mb-3">
        <Link to="/" className="shrink-0 hover:text-brand">Trang chủ</Link>
        <span className="mx-1.5 sm:mx-2 shrink-0">/</span>
        <Link to={listPath} className="shrink-0 hover:text-brand">{listTitle}</Link>
        <span className="mx-1.5 sm:mx-2 shrink-0">/</span>
        <span className="min-w-0 truncate text-gray-800 font-medium" title={news.title}>{news.title}</span>
      </nav>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug break-words">{news.title}</h1>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 break-words">Đăng bởi: {news.author} - Vào lúc {formatNewsDate(news.updatedAt)} </p>
      {news.location && <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">Địa điểm: {news.location}</p>}
      <Img src={newsImage(news)} fallback="https://placehold.co/1024x576?text=No+Image" alt={news.title} loading="eager" className="w-full h-auto rounded-xl mt-3 sm:mt-4 object-cover aspect-video" />
      {news.seoDescriptionTag && <p className="text-[15px] sm:text-base text-gray-700 font-medium mt-3 sm:mt-4 break-words">{news.seoDescriptionTag}</p>}
      {safeHtml && (
        <div
          className="text-[15px] sm:text-base leading-relaxed text-gray-800 mt-3 sm:mt-4 space-y-3 w-full min-w-0 max-w-full overflow-x-hidden break-words [&_*]:!max-w-full [&_*]:!min-w-0 [&_*]:box-border [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-xl [&_img]:!h-auto [&_video]:!h-auto [&_iframe]:!w-full [&_iframe]:aspect-video [&_iframe]:!h-auto [&_table]:!block [&_table]:!w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_a]:break-words"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      )}
    </article>
  )
}

export default NewsDetailPage
