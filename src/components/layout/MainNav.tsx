import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { listCategories, type CategoryResponse } from '../../lib/api.ts'
import { categoryIcon } from '../../pages/dashboard/data.ts'

interface MainNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function MainNav({ sidebarOpen, onToggleSidebar }: MainNavProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolledDown, setScrolledDown] = useState(false)
  const showOverlay = sidebarOpen && (!isHome || scrolledDown)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

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
  }, [showOverlay])

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
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row">
        <div ref={menuRef} className="relative w-full lg:w-72">
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
                {categories.map((cat, i) => (
                  <li key={cat.id} className={i < categories.length - 1 ? 'border-b border-gray-100' : ''}>
                    <Link
                      to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
                      onClick={onToggleSidebar}
                      className="flex items-center justify-between px-4 py-2.5 hover:text-brand hover:bg-sky-50 group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <i className={`${categoryIcon(cat.name)} w-4 text-center text-gray-400 group-hover:text-brand`}></i>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <i className="fa-solid fa-caret-right text-gray-300 group-hover:text-brand"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <ul className="flex-1 flex flex-wrap lg:flex-nowrap items-center overflow-x-auto hide-scrollbar text-sm font-medium text-gray-700 ml-0 lg:ml-4">
          <li className="whitespace-nowrap"><Link to="/" className={location.pathname === "/" ? activeLink : idleLink}>Trang chủ</Link></li>
          <li className="whitespace-nowrap"><Link to="/gioi-thieu" className={location.pathname === "/gioi-thieu" ? activeLink : idleLink}>Giới thiệu</Link></li>
          <li className="whitespace-nowrap"><Link to="/san-pham" className={location.pathname === "/san-pham" ? activeLink : idleLink}>Sản phẩm</Link></li>
          <li className="whitespace-nowrap"><a href="/tin-tuc" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Tin tức</a></li>
          <li className="whitespace-nowrap"><a href="/thue-san-pham" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Thuê sản phẩm</a></li>
          <li className="whitespace-nowrap"><a href="/lien-he" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Liên hệ</a></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors">Khách hàng</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default MainNav
