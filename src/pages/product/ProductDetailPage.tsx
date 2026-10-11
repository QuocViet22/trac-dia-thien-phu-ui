import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  listCategories,
  productImage,
  type CategoryResponse,
  type ProductResponse,
} from '../../lib/api.ts'
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
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 animate-pulse" aria-label="Đang tải sản phẩm">
        <div className="h-4 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="grid gap-4 lg:grid-cols-2 items-start">
          <div className="h-80 bg-gray-100 rounded-xl" />
          <div className="h-80 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (current.status === 'missing') {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</p>
        <Link to="/san-pham" className="text-brand hover:underline">Quay lại Tất cả sản phẩm</Link>
      </div>
    )
  }

  if (current.status === 'error' || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Không tải được sản phẩm. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/san-pham" className="hover:text-brand">Tất cả sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <ProductGallery key={slug} images={getGalleryImages(product)} name={product.name} />
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
          {product.shortDescription && (
            <div
              className="text-sm text-gray-600 mt-3 space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}
        </div>
      </div>
      <ProductArticle key={product.id} name={product.name} description={product.description} categoryName={categoryName} />
      <section className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {related.map((item) => (
            <ProductCard key={item.id} name={item.name} image={productImage(item)} seoAlias={item.seoAlias ?? undefined} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
