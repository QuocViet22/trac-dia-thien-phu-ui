import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Img from '../Img.tsx'
import { listProducts, productImage, type ProductResponse } from '../../lib/api.ts'

const MAX_SUGGESTIONS = 6
const MIN_CHARS = 2
const DEBOUNCE_MS = 300
const FALLBACK_IMAGE = 'https://placehold.co/80x80?text=No+Image'

function ProductSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductResponse[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    const keyword = query.trim()
    if (keyword.length < MIN_CHARS) {
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      setFailed(false)
      listProducts({ page: 0, size: MAX_SUGGESTIONS, name: keyword, sort: 'name,asc' })
        .then((data) => {
          if (!cancelled) {
            setResults(data.content)
            setLoading(false)
            setOpen(true)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([])
            setLoading(false)
            setFailed(true)
            setOpen(true)
          }
        })
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const [prevLocationKey, setPrevLocationKey] = useState(location.pathname + location.search)
  if (location.pathname + location.search !== prevLocationKey) {
    setPrevLocationKey(location.pathname + location.search)
    setOpen(false)
    setActiveIndex(-1)
  }

  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (activeIndex >= 0) {
      document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, listId])

  const openProduct = (product: ProductResponse) => {
    setOpen(false)
    navigate(product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = query.trim()
    const active = results[activeIndex]
    if (active) {
      openProduct(active)
      return
    }
    if (!keyword) {
      return
    }
    setOpen(false)
    navigate(`/san-pham?name=${encodeURIComponent(keyword)}`)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    if (!open || results.length === 0) {
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1))
    }
  }

  const onQueryChange = (value: string) => {
    setQuery(value)
    setActiveIndex(-1)
    if (value.trim().length < MIN_CHARS) {
      setResults([])
      setOpen(false)
      setLoading(false)
      setFailed(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full lg:w-1/2 order-3 lg:order-none relative">
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (query.trim().length >= MIN_CHARS && (results.length > 0 || failed)) {
              setOpen(true)
            }
          }}
          placeholder="Tìm kiếm sản phẩm..."
          aria-label="Tìm kiếm sản phẩm"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-brand text-sm shadow-sm transition-colors"
        />
        <button type="submit" aria-label="Tìm kiếm" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand">
          <i className="fa-solid fa-search"></i>
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <p className="px-4 py-3 text-sm text-gray-500">Đang tìm sản phẩm...</p>
          ) : failed ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm được sản phẩm. Vui lòng thử lại.</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-80 overflow-y-auto">
              {results.map((product, index) => (
                <li key={product.id} role="presentation">
                  <Link
                    to={product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham'}
                    role="option"
                    id={`${listId}-option-${index}`}
                    aria-selected={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm ${index === activeIndex ? 'bg-sky-50 text-brand' : 'text-gray-700'}`}
                  >
                    <Img
                      src={productImage(product) || FALLBACK_IMAGE}
                      fallback={FALLBACK_IMAGE}
                      alt=""
                      loading="lazy"
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium line-clamp-2">{product.name}</span>
                      {product.brand && <span className="block text-[11px] uppercase text-gray-500">{product.brand}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
