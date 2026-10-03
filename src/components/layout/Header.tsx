import { useState } from 'react'
import Img from '../Img.tsx'

function Header() {
  const [query, setQuery] = useState('')

  return (
    <header className="bg-white py-3 px-4 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-2xl tracking-tighter">
            <span className="text-[#f37021]">iGeo</span><span className="text-gray-800"> System</span><br />
            <span className="text-[0.6rem] text-gray-500 uppercase tracking-widest relative -top-2 block">igeostore.vn</span>
          </div>
        </div>

        <div className="w-full lg:w-1/2 order-3 lg:order-none relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#f37021] text-sm shadow-sm transition-colors"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f37021]">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>

        <div className="flex items-center gap-6 order-2 lg:order-none">
          <div className="hidden md:flex items-center gap-2">
            <i className="fa-solid fa-phone-volume custom-orange text-xl"></i>
            <a href="tel:0972819598" className="font-bold text-gray-800 text-lg">0972.819.598</a>
          </div>

          <a href="#" aria-label="Tài khoản" className="text-gray-600 hover:text-[#f37021]"><i className="fa-regular fa-user text-xl"></i></a>

          <div className="flex items-center gap-1 cursor-pointer text-sm font-medium">
            <Img src="https://placehold.co/20x15/red/yellow?text=VN" fallback="https://placehold.co/20x15?text=VN" alt="VN Flag" className="w-5 h-4 object-cover border border-gray-200 shadow-sm" />
            <span>VI</span>
            <i className="fa-solid fa-caret-down text-xs text-gray-500"></i>
          </div>

          <div className="relative cursor-pointer">
            <i className="fa-solid fa-shopping-cart text-gray-600 text-xl hover:text-[#f37021] transition-colors"></i>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">0</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
