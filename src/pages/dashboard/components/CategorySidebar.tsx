import { Link } from 'react-router'
import { categoryImage } from '../../../lib/api.ts'
import { useSidebarCategories } from '../../../hooks/useSidebarCategories.ts'
import { categories as fallbackCategories } from '../data.ts'

interface CategorySidebarProps {
  open: boolean
}

function CategorySidebar({ open }: CategorySidebarProps) {
  const { categories, loading, failed } = useSidebarCategories()

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 relative z-30 lg:-mt-4">
      <div id="sidebar-menu" className={`bg-white border-l border-r border-b border-gray-200 shadow-sm rounded-b-md sidebar-scroll overflow-y-auto ${open ? 'block' : 'hidden'} lg:block`}>
        <ul className="text-[13px] text-gray-600 font-medium">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <li key={index} className="px-4 py-2.5 border-b border-gray-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <div className="h-4 flex-1 bg-gray-100 rounded" />
                </div>
              </li>
            ))
          ) : failed ? (
            fallbackCategories.map((cat, i) => (
              <li
                key={cat.label}
                className={`flex items-center justify-between px-4 py-2.5 ${i < fallbackCategories.length - 1 ? 'border-b border-gray-100' : ''} hover:text-brand hover:bg-sky-50 cursor-pointer group transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="truncate">{cat.label}</span>
                </div>
                <i className="fa-solid fa-caret-right text-gray-300 group-hover:text-brand"></i>
              </li>
            ))
          ) : categories.length === 0 ? (
            <li className="px-4 py-2.5 text-gray-500">Chưa có danh mục nào</li>
          ) : (
            categories.map((cat, i) => {
              const img = categoryImage(cat)
              return (
              <li key={cat.id} className={i < categories.length - 1 ? 'border-b border-gray-100' : ''}>
                <Link
                  to={cat.seoAlias ? `/danh-muc/${cat.seoAlias}` : `/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
                  className="flex items-center justify-between px-4 py-2.5 hover:text-brand hover:bg-sky-50 group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {img && ( 
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className="w-6 h-6 object-cover rounded-sm flex-shrink-0"
                      />
                    )}
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <i className="fa-solid fa-caret-right text-gray-300 group-hover:text-brand"></i>
                </Link>
              </li>
              )
            })
          )}
        </ul>
      </div>
    </aside>
  )
}

export default CategorySidebar
