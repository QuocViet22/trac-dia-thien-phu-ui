import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  listCategories,
  productImage,
  type CategoryResponse,
  type ProductResponse,
} from '../../lib/api.ts'
import { sanitizeHtml } from '../../lib/sanitize.ts'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import { getGalleryImages, getRelated, resolveProduct } from './detail.ts'
import ProductArticle from './components/ProductArticle.tsx'
import ProductGallery from './components/ProductGallery.tsx'

type LoadStatus = 'loading' | 'missing' | 'error' | 'ready'

interface Snapshot {
  key: string
  status: LoadStatus
  product: ProductResponse | null
}

function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [snapshot, setSnapshot] = useState<Snapshot>({ key: '', status: 'loading', product: null })
  const [related, setRelated] = useState<ProductResponse[]>([])
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const key = `${slug}#${reloadKey}`

  useEffect(() => {
    if (snapshot.key === key) {
      return
    }
    let cancelled = false
    resolveProduct(slug)
      .then((found) => {
        if (cancelled) {
          return
        }
        if (!found) {
          setSnapshot({ key, status: 'missing', product: null })
          return
        }
        setSnapshot({ key, status: 'ready', product: found })
        getRelated(found, 8)
          .then((items) => {
            if (!cancelled) {
              setRelated(items)
            }
          })
          .catch(() => {
            if (!cancelled) {
              setRelated([])
            }
          })
        if (found.categoryId) {
          const categoryId = found.categoryId
          listCategories()
            .then((categories: CategoryResponse[]) => {
              if (!cancelled) {
                setCategoryName(categories.find((category) => category.id === categoryId)?.name ?? null)
              }
            })
            .catch(() => {
              if (!cancelled) {
                setCategoryName(null)
              }
            })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshot({ key, status: 'error', product: null })
        }
      })
    return () => {
      cancelled = true
    }
  }, [slug, reloadKey, key, snapshot.key])

  const current: Snapshot = snapshot.key === key ? snapshot : { key, status: 'loading', product: null }
  const product = current.product

  if (current.status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 animate-pulse" aria-label="Đang tải sản phẩm">
        <div className="h-4 w-2/3 sm:w-1/3 bg-gray-100 rounded mb-3" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 items-start">
          <div className="aspect-square lg:aspect-auto lg:h-80 bg-gray-100 rounded-xl" />
          <div className="h-48 lg:h-80 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (current.status === 'missing') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</p>
        <Link to="/san-pham" className="inline-flex items-center min-h-11 text-brand hover:underline">Quay lại Tất cả sản phẩm</Link>
      </div>
    )
  }

  if (current.status === 'error' || !product) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Không tải được sản phẩm. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 min-h-11 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 pb-[max(2rem,env(safe-area-inset-bottom))] overflow-x-clip">
      <nav aria-label="Breadcrumb" className="flex items-center min-w-0 whitespace-nowrap text-xs sm:text-sm text-gray-500 mb-3">
        <Link to="/" className="shrink-0 hover:text-brand">Trang chủ</Link>
        <span className="mx-1.5 sm:mx-2 shrink-0">/</span>
        <Link to="/san-pham" className="shrink-0 hover:text-brand">
          <span className="sm:hidden">Sản phẩm</span>
          <span className="hidden sm:inline">Tất cả sản phẩm</span>
        </Link>
        <span className="mx-1.5 sm:mx-2 shrink-0">/</span>
        <span className="min-w-0 truncate text-gray-800 font-medium" title={product.name}>{product.name}</span>
      </nav>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 items-start [&>*]:min-w-0">
        <ProductGallery key={slug} images={getGalleryImages(product)} name={product.name} />
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug break-words">{product.name}</h1>
          {product.shortDescription && (
            <div
              className="text-sm text-gray-600 mt-3 space-y-1 break-words [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_a]:break-all"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }}
            />
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-6 w-full min-w-0 max-w-full overflow-x-hidden break-words [&_*]:!max-w-full [&_*]:!min-w-0 [&_*]:box-border [&_img]:!h-auto [&_video]:!h-auto [&_iframe]:!w-full [&_table]:!block [&_table]:!w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap">
        <ProductArticle key={product.id} name={product.name} description={product.description} categoryName={categoryName} />
      </div>
      <section className="mt-5 sm:mt-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 [&>*]:min-w-0">
          {related.map((item) => (
            <ProductCard key={item.id} name={item.name} image={productImage(item)} seoAlias={item.seoAlias ?? undefined} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
