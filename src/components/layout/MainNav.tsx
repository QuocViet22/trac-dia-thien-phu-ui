import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { categoryImage } from '../../lib/api.ts'
import { useSidebarCategories } from '../../hooks/useSidebarCategories.ts'
import { useCategoryFlyout } from '../../hooks/useCategoryFlyout.ts'
import CategoryFlyout from './CategoryFlyout.tsx'

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
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false)
  const { flyoutId, flyoutData, openFlyout, closeFlyout } = useCategoryFlyout()

  const [prevShowOverlay, setPrevShowOverlay] = useState(showOverlay)
  if (prevShowOverlay !== showOverlay) {
    setPrevShowOverlay(showOverlay)
    closeFlyout()
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

  const [prevPathname, setPrevPathname] = useState(location.pathname)
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setMobileLinksOpen(false)
  }

  useEffect(() => {
    if (showOverlay && location.pathname !== '/') {
      onToggleSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  const activeLink = "px-4 py-3 lg:py-4 block custom-orange border-l-2 lg:border-l-0 lg:border-b-2 border-custom-orange"
  const idleLink = "px-4 py-3 lg:py-4 block hover:text-brand transition-colors"
  const navItems: { to: string; label: string; spa: boolean }[] = [
    { to: '/', label: 'Trang chủ', spa: true },
    { to: '/thue-san-pham', label: 'Thuê sản phẩm', spa: false },
    { to: '/sua-chua-va-kiem-dinh', label: 'Sửa chữa & Kiểm định', spa: false },
    { to: '/gioi-thieu', label: 'Giới thiệu', spa: true },
    { to: '/tin-tuc', label: 'Tin tức', spa: false },
    { to: '/lien-he', label: 'Liên hệ', spa: false },
    { to: '/khach-hang', label: 'Khách hàng', spa: true },
  ]
  const flyoutCategory = categories.find((cat) => cat.id === flyoutId) ?? null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row">
        <div className="flex items-center gap-2 py-2 lg:py-0 lg:contents">
        <div ref={menuRef} className="relative flex-1 min-w-0 lg:flex-none lg:w-72" onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') {
            closeFlyout()
          }
        }}>
          <button
            type="button"
            aria-expanded={sidebarOpen}
            aria-label="Tất cả sản phẩm"
            onClick={onToggleSidebar}
            className={`bg-custom-orange text-white w-full flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-sm sm:text-base lg:rounded-none ${showOverlay ? 'rounded-t-md' : 'rounded-md'}`}
          >
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bars text-lg"></i>
              <span>TẤT CẢ SẢN PHẨM</span>
            </div>
            <i className="fa-solid fa-caret-down"></i>
          </button>
          {showOverlay && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-l border-r border-b border-gray-200 shadow-sm rounded-b-md overflow-y-auto max-h-96">
              <ul className="text-base text-gray-600 font-medium">
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
                            onError={(event) => {
                              event.currentTarget.style.display = 'none'
                            }}
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
                    {flyoutId === cat.id && (
                      <CategoryFlyout
                        cat={cat}
                        entry={flyoutData[cat.id]}
                        id={`flyout-${cat.id}`}
                        className="lg:hidden border-t border-gray-100 bg-gray-50 pl-4"
                        onNavigate={onToggleSidebar}
                      />
                    )}
                  </li>
                  )
                })}
              </ul>
            </div>
          )}
          {showOverlay && flyoutCategory && (
            <CategoryFlyout
              cat={flyoutCategory}
              entry={flyoutData[flyoutCategory.id]}
              id="flyout-desktop"
              className="hidden lg:block absolute left-full top-full w-64 z-50 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto text-[0.8125rem] text-gray-600 font-medium"
              onNavigate={onToggleSidebar}
            />
          )}
        </div>

        <button
          type="button"
          aria-expanded={mobileLinksOpen}
          aria-controls="main-links"
          aria-label={mobileLinksOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setMobileLinksOpen((open) => !open)}
          className="lg:hidden shrink-0 w-11 h-11 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 cursor-pointer"
        >
          <i className={`fa-solid ${mobileLinksOpen ? 'fa-xmark' : 'fa-ellipsis-vertical'} text-lg`}></i>
        </button>
        </div>

        <ul
          id="main-links"
          className={`${mobileLinksOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row lg:flex-wrap lg:items-center flex-1 text-base font-medium text-gray-700 ml-0 lg:ml-4 border-t border-gray-100 lg:border-t-0 pb-2 lg:pb-0`}
        >
          {navItems.map((item) => (
            <li key={item.to} className="whitespace-nowrap text-base lg:text-[19px]">
              {item.spa ? (
                <Link to={item.to} className={location.pathname === item.to ? activeLink : idleLink}>{item.label}</Link>
              ) : (
                <a href={item.to} className={idleLink}>{item.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default MainNav