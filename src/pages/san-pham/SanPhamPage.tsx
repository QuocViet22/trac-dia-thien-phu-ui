import { Link } from 'react-router'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import FilterSidebar from './components/FilterSidebar.tsx'
import Toolbar from './components/Toolbar.tsx'
import { products } from './data.ts'

function SanPhamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr] items-start">
        <FilterSidebar />
        <div className="flex flex-col gap-4">
          <Toolbar />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
          <nav aria-label="Phân trang" className="flex justify-center gap-1.5">
            <a href="#" aria-label="Trang trước" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand">«</a>
            {[1, 2, 3].map((page) => (
              <a
                key={page}
                href="#"
                aria-label={`Trang ${page}`}
                aria-current={page === 1 ? 'page' : undefined}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm ${page === 1 ? 'border-brand text-brand font-bold' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
              >
                {page}
              </a>
            ))}
            <a href="#" aria-label="Trang tiếp" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand">»</a>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default SanPhamPage
