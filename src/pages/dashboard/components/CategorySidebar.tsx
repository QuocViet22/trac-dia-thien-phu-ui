import { categories } from '../data.ts'

interface CategorySidebarProps {
  open: boolean
}

function CategorySidebar({ open }: CategorySidebarProps) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 relative z-30 lg:-mt-4">
      <div id="sidebar-menu" className={`bg-white border-l border-r border-b border-gray-200 shadow-sm rounded-b-md sidebar-scroll overflow-y-auto ${open ? 'block' : 'hidden'} lg:block`}>
        <ul className="text-[13px] text-gray-600 font-medium">
          {categories.map((cat, i) => (
            <li
              key={cat.label}
              className={`flex items-center justify-between px-4 py-2.5 ${i < categories.length - 1 ? 'border-b border-gray-100' : ''} hover:text-[#f37021] hover:bg-orange-50 cursor-pointer group transition-colors`}
            >
              <div className="flex items-center gap-3">
                <i className={`${cat.icon} w-4 text-center text-gray-400 group-hover:text-[#f37021]`}></i>
                <span className="truncate">{cat.label}</span>
              </div>
              <i className="fa-solid fa-caret-right text-gray-300 group-hover:text-[#f37021]"></i>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default CategorySidebar
