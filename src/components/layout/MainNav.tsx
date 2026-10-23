import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { listProducts, categoryImage, type CategoryResponse, type ProductResponse } from '../../lib/api.ts'
import { useSidebarCategories } from '../../hooks/useSidebarCategories.ts'

interface MainNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function MainNav({ sidebarOpen, onToggleSidebar }: MainNavProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolledDown, setScrolledDown] = useState(false)
  const showOverlay = sidebarOpen && (!isHome || scrolledDown)
  const { categories, loading: categoriesLoading } = useSidebarCategories(showOverlay)
  const menuRef = useRef<HTMLDivElement>(null)
  const [flyoutId, setFlyoutId] = useState<string | null>(null)
  const [flyoutData, setFlyoutData] = useState<Record<string, ProductResponse[] | 'failed'>>({})

  const openFlyout = (id: string) => {
    setFlyoutId(id)
    if (flyoutData[id] !== undefined) {
      return
    }
    listProducts({ page: 0, size: 10, categoryId: id, sort: 'createdAt,desc' })
      .then((data) => {
        setFlyoutData((current) => ({ ...current, [id]: data.content }))
      })
      .catch(() => {
        setFlyoutData((current) => ({ ...current, [id]: 'failed' }))
      })
  }

  const closeFlyout = () => {
    setFlyoutId(null)
  }

  const [prevShowOverlay, setPrevShowOverlay] = useState(showOverlay)
  if (prevShowOverlay !== showOverlay) {
    setPrevShowOverlay(showOverlay)
    setFlyoutId(null)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolledDown(window.scrollY > 150)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!showOverlay) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onToggleSidebar()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggleSidebar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [showOverlay, onToggleSidebar])

  useEffect(() => {
    if (showOverlay && location.pathname !== '/') {
      onToggleSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  const activeLink = "px-5 py-4 block custom-orange border-b-2 border-custom-orange"
  const idleLink = "px-5 py-4 block hover:text-brand transition-colors"
  const flyoutCategory = categories.find((cat) => cat.id === flyoutId) ?? null

  const renderFlyout = (cat: CategoryResponse, className: string, id: string) => {
    const entry = flyoutData[cat.id]
    return (
    <div id={id} className={className}>
      {entry === undefined ? (
        <div aria-label="Đang tải sản phẩm">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="px-4 py-2.5">
              <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : entry === 'failed' ? (
        <p className="px-4 py-2.5 text-gray-500">Không tải được sản phẩm.</p>
      ) : entry.length === 0 ? (
        <p className="px-4 py-2.5 text-gray-500">Chưa có sản phẩm.</p>
      ) : (
        <ul>
          {entry.map((product) => (
            <li key={product.id}>
              <Link
                to={product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham'}
                onClick={onToggleSidebar}
                className="block px-4 py-2 text-[13px] text-gray-700 hover:text-brand hover:bg-sky-50 transition-colors truncate"
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
        onClick={onToggleSidebar}
        className="block px-4 py-2.5 border-t border-gray-100 text-[13px] font-medium text-brand hover:bg-sky-50"
      >
        Xem tất cả {cat.name}
      </Link>
    </div>
    )
  }
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row">
        <div ref={menuRef} className="relative w-full lg:w-72" onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') {
            closeFlyout()
          }
        }}>
          <button
            type="button"
            aria-expanded={sidebarOpen}
            aria-label="Tất cả sản phẩm"
            onClick={onToggleSidebar}
            className="bg-custom-orange text-white w-full flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-sm rounded-t-md lg:rounded-none"
          >
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bars text-lg"></i>
              <span>TẤT CẢ SẢN PHẨM</span>
            </div>
            <i className="fa-solid fa-caret-down"></i>
          </button>
          {showOverlay && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-l border-r border-b border-gray-200 shadow-sm rounded-b-md overflow-y-auto max-h-96">
              <ul className="text-[13px] text-gray-600 font-medium">
                {categoriesLoading ? null : categories.length === 0 ? (
                  <li className="px-4 py-2.5 text-gray-500">Chưa có danh mục nào</li>
                ) : categories.map((cat, i) => {
                  const img = categoryImage(cat)
                  return (
                  <li key={cat.id} className={`relative ${i < categories.length - 1 ? 'border-b border-gray-100' : ''}`} onPointerEnter={(event) => {
                    if (event.pointerType !== 'touch') {
                      openFlyout(cat.id)
                    }
                  }}>
                    <div className="flex items-center" onFocus={() => openFlyout(cat.id)}>
                    <Link
                      to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
                      onClick={onToggleSidebar}
                      className="flex-1 min-w-0 flex items-center px-4 py-2.5 hover:text-brand hover:bg-sky-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {img && (
                          <img
                            src={img}
                            alt=""
                            loading="lazy"
                            className="w-6 h-6 object-cover rounded-sm flex-shrink-0"
                          />
                        )}
                        <span className="truncate">{cat.name}</span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      aria-expanded={flyoutId === cat.id}
                      aria-controls={`flyout-${cat.id} flyout-desktop`}
                      aria-label={`Sản phẩm của ${cat.name}`}
                      onClick={() => openFlyout(cat.id)}
                      className="px-3 py-2.5 text-gray-300 hover:text-brand cursor-pointer"
                    >
                      <i className={`fa-solid fa-caret-right transition-transform ${flyoutId === cat.id ? 'rotate-90 lg:rotate-0' : ''}`}></i>
                    </button>
                    </div>
                    {flyoutId === cat.id && renderFlyout(cat, 'lg:hidden border-t border-gray-100 bg-gray-50 pl-4', `flyout-${cat.id}`)}
                  </li>
                  )
                })}
              </ul>
            </div>
          )}
          {showOverlay && flyoutCategory && renderFlyout(flyoutCategory, 'hidden lg:block absolute left-full top-full w-64 z-50 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto text-[13px] text-gray-600 font-medium', 'flyout-desktop')}
        </div>

        <ul className="flex-1 flex flex-wrap lg:flex-nowrap items-center overflow-x-auto hide-scrollbar text-sm font-medium text-gray-700 ml-0 lg:ml-4">
          <li className="whitespace-nowrap"><Link to="/" className={location.pathname === "/" ? activeLink : idleLink}>Trang chủ</Link></li>
          <li className="whitespace-nowrap"><a href="/thue-san-pham" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Thuê sản phẩm</a></li>
          <li className="whitespace-nowrap"><a href="/sua-chua-va-kiem-dinh" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Sửa chữa & Kiểm định</a></li>
          <li className="whitespace-nowrap"><Link to="/gioi-thieu" className={location.pathname === "/gioi-thieu" ? activeLink : idleLink}>Giới thiệu</Link></li>
          <li className="whitespace-nowrap"><a href="/tin-tuc" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Tin tức</a></li>
          <li className="whitespace-nowrap"><a href="/lien-he" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Liên hệ</a></li>
          <li className="whitespace-nowrap"><Link to="/khach-hang" className={location.pathname === "/khach-hang" ? activeLink : idleLink}>Khách hàng</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default MainNav
