import { useState } from 'react'
import logo from '../../assets/logo.jpg'

function Header() {
  const [query, setQuery] = useState('')

  return (
    <header className="bg-white py-3 px-4 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="iGeo System" className="h-12 w-auto object-contain" />
        </div>

        <div className="w-full lg:w-1/2 order-3 lg:order-none relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-brand text-sm shadow-sm transition-colors"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>

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
