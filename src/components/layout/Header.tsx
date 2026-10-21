import { Link } from 'react-router'
import logo from '../../assets/logo.jpg'
import ProductSearch from './ProductSearch.tsx'

function Header() {
  return (
    <header className="bg-white py-3 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Về trang chủ Trắc Địa Thiên Phú">
          <img src={logo} alt="Trắc Địa Thiên Phú" className="h-12 w-auto object-contain" />
        </Link>

        <ProductSearch />

        <div className="flex items-center gap-6 order-2 lg:order-none">
          <div className="hidden md:flex items-center gap-2">
            <i className="fa-solid fa-phone-volume custom-orange text-xl"></i>
            <a href="tel:0972819598" className="font-bold text-gray-800 text-lg">0983.927.945 <br />0979.778.945</a>
          </div>

          <a href="#" aria-label="Tài khoản" className="text-gray-600 hover:text-brand"><i className="fa-regular fa-user text-xl"></i></a>
        </div>
      </div>
    </header>
  )
}

export default Header
