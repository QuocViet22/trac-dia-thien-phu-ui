import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  listCategories,
  listProducts,
  productImage,
  type CategoryResponse,
  type ProductResponse,
} from '../../lib/api.ts'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import FilterSidebar from './components/FilterSidebar.tsx'
import Toolbar from './components/Toolbar.tsx'

const PAGE_SIZE = 12

interface ProductQueryState {
  page: number
  categoryId: string | null
  brand: string | null
  sort: string
}

function SanPhamPage() {
  const [searchParams] = useSearchParams()
  const paramCategoryId = searchParams.get('categoryId') ?? null
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState<ProductQueryState>({ page: 0, categoryId: paramCategoryId, brand: null, sort: 'createdAt,desc' })
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [prevParamCategoryId, setPrevParamCategoryId] = useState<string | null>(paramCategoryId)
  if (paramCategoryId !== prevParamCategoryId) {
    setPrevParamCategoryId(paramCategoryId)
    setQuery((current) => ({ ...current, categoryId: paramCategoryId, page: 0 }))
    setLoading(true)
    setFailed(false)
  }

  const updateQuery = (patch: Partial<ProductQueryState>) => {
    setQuery((current) => ({ ...current, ...patch }))
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
    listCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    listProducts({ page: query.page, size: PAGE_SIZE, categoryId: query.categoryId ?? undefined, brand: query.brand ?? undefined, sort: query.sort })
      .then((data) => {
        if (!cancelled) {
          setProducts(data.content)
          setTotalPages(Math.max(1, data.totalPages))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [query, reloadKey])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr] items-start">
        <FilterSidebar
          categories={categories}
          selectedCategoryId={query.categoryId}
          onSelectCategory={(id) => updateQuery({ categoryId: id, page: 0 })}
          selectedBrand={query.brand}
          onSelectBrand={(brand) => updateQuery({ brand, page: 0 })}
        />
        <div className="flex flex-col gap-4">
          <Toolbar sort={query.sort} onSelectSort={(value) => updateQuery({ sort: value, page: 0 })} />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3" aria-label="Đang tải sản phẩm">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 pt-8 animate-pulse">
                  <div className="w-full h-40 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded mt-2" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded mt-1" />
                </div>
              ))}
            </div>
          ) : failed ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="font-bold text-gray-900 mb-1">Không tải được sản phẩm. Vui lòng thử lại.</p>
              <button type="button" onClick={retry} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Chưa có sản phẩm trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} name={product.name} image={productImage(product)} seoAlias={product.seoAlias ?? undefined} />
              ))}
            </div>
          )}
          <nav aria-label="Phân trang" className="flex justify-center gap-1.5">
            <button type="button" aria-label="Trang trước" disabled={query.page === 0} onClick={() => updateQuery({ page: Math.max(0, query.page - 1) })} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">«</button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Trang ${index + 1}`}
                aria-current={index === query.page ? 'page' : undefined}
                onClick={() => updateQuery({ page: index })}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm ${index === query.page ? 'border-brand text-brand font-bold' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" aria-label="Trang tiếp" disabled={query.page >= totalPages - 1} onClick={() => updateQuery({ page: query.page + 1 })} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">»</button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default SanPhamPage
