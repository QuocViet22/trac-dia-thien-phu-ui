import { Link } from 'react-router'
import type { CategoryResponse } from '../../lib/api.ts'
import type { CategoryProducts } from '../../hooks/useCategoryFlyout.ts'

interface CategoryFlyoutProps {
  cat: CategoryResponse
  entry: CategoryProducts | undefined
  id: string
  className: string
  onNavigate?: () => void
}

function CategoryFlyout({ cat, entry, id, className, onNavigate }: CategoryFlyoutProps) {
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
                onClick={onNavigate}
                className="block px-4 py-2 text-[17px] text-gray-700 hover:text-brand hover:bg-sky-50 transition-colors truncate"
              >
                {product.name}
              </Link>
            </li>
          ))}
          <Link
            to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
            onClick={onNavigate}
            className="block px-4 py-2.5 border-t border-gray-100 text-[0.8125rem] font-medium text-brand hover:bg-sky-50"
          >
            Xem tất cả {cat.name}
          </Link>
        </ul>
      )}
    </div>
  )
}

export default CategoryFlyout
