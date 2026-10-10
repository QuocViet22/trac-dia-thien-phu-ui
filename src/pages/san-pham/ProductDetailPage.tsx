import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import { getGalleryImages, getProductBySlug, getRelated } from './detail.ts'
import ProductArticle from './components/ProductArticle.tsx'
import ProductGallery from './components/ProductGallery.tsx'

const highlights: string[] = [
  'Hàng chính hãng, đầy đủ CO/CQ.',
  'Bảo hành 12 tháng, hỗ trợ kỹ thuật trọn đời máy.',
  'Giao hàng toàn quốc, chuyển giao công nghệ tận nơi.',
  'Giá tốt nhất cho dự án và đại lý.',
]

function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [quantity, setQuantity] = useState(1)
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</p>
        <Link to="/san-pham" className="text-brand hover:underline">Quay lại Tất cả sản phẩm</Link>
      </div>
    )
  }

  const related = getRelated(product, 8)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/san-pham" className="hover:text-brand">Tất cả sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <ProductGallery images={getGalleryImages(product)} name={product.name} />
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-600 mt-2">Nhà cung cấp: <span className="font-medium text-gray-900">TRẮC ĐỊA THIÊN PHÚ</span></p>
          <p className="text-sm text-gray-600 mt-1">Mã sản phẩm: (Đang cập nhật...)</p>
          <p className="text-sm mt-1">Tình trạng: <span className="font-medium text-emerald-700">Còn hàng</span></p>
          <p className="font-bold text-brand text-2xl mt-3">Liên hệ</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-3">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Hotline: <a href="tel:0983927945" className="font-bold text-gray-900 hover:text-brand">0983.927.945</a>
            {' - '}<a href="tel:0979778945" className="font-bold text-gray-900 hover:text-brand">0979.778.945</a>
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button type="button" aria-label="Giảm số lượng" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 text-gray-600 hover:text-brand">−</button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 text-gray-600 hover:text-brand">+</button>
            </div>
            <a href="tel:0983927945" className="bg-brand text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90">MUA NGAY</a>
          </div>
        </div>
      </div>
      <ProductArticle product={product} />
      <section className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {related.map((item) => (
            <ProductCard key={item.name} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
