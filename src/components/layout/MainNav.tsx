import { Link, useLocation } from 'react-router'

interface MainNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function MainNav({ sidebarOpen, onToggleSidebar }: MainNavProps) {
  const location = useLocation()
  const activeLink = "px-5 py-4 block custom-orange border-b-2 border-custom-orange"
  const idleLink = "px-5 py-4 block hover:text-brand transition-colors"
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row">
        <button
          type="button"
          aria-expanded={sidebarOpen}
          aria-label="Tất cả sản phẩm"
          onClick={onToggleSidebar}
          className="bg-custom-orange text-white w-full lg:w-72 flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-sm rounded-t-md lg:rounded-none"
        >
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bars text-lg"></i>
            <span>TẤT CẢ SẢN PHẨM</span>
          </div>
          <i className="fa-solid fa-caret-down"></i>
        </button>

        <ul className="flex-1 flex flex-wrap lg:flex-nowrap items-center overflow-x-auto hide-scrollbar text-sm font-medium text-gray-700 ml-0 lg:ml-4">
          <li className="whitespace-nowrap"><Link to="/" className={location.pathname === "/" ? activeLink : idleLink}>Trang chủ</Link></li>
          <li className="whitespace-nowrap"><Link to="/gioi-thieu" className={location.pathname === "/gioi-thieu" ? activeLink : idleLink}>Giới thiệu</Link></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Sản phẩm <i className="fa-solid fa-angle-down text-[10px]"></i></a></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Tin tức <i className="fa-solid fa-angle-down text-[10px]"></i></a></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Thuê sản phẩm <i className="fa-solid fa-angle-down text-[10px]"></i></a></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors flex items-center gap-1">Liên hệ <i className="fa-solid fa-angle-down text-[10px]"></i></a></li>
          <li className="whitespace-nowrap"><a href="#" className="px-5 py-4 block hover:text-brand transition-colors">Khách hàng</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default MainNav
