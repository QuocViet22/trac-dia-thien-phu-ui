import { Link } from 'react-router'
import type { CategoryResponse } from '../../lib/api.ts'

interface CategoryFlyoutProps {
  cat: CategoryResponse
  subcategories: CategoryResponse[]
  id: string
  className: string
  onNavigate?: () => void
}

function CategoryFlyout({ cat, subcategories, id, className, onNavigate }: CategoryFlyoutProps) {
  return (
    <div id={id} className={className}>
      <ul aria-label={`Danh mục con của ${cat.name}`}>
        {subcategories.map((child) => (
          <li key={child.id}>
            <Link
              to={child.seoAlias ? `/danh-muc/${child.seoAlias}` : `/san-pham?categoryId=${encodeURIComponent(child.id)}`}
              onClick={onNavigate}
              className="block px-4 py-2 text-[17px] text-gray-700 hover:text-brand hover:bg-sky-50 transition-colors truncate"
            >
              {child.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to={cat.seoAlias ? `/danh-muc/${cat.seoAlias}` : `/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
            onClick={onNavigate}
            className="block px-4 py-2.5 border-t border-gray-100 text-[0.8125rem] font-medium text-brand hover:bg-sky-50"
          >
            Xem tất cả {cat.name}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default CategoryFlyout
