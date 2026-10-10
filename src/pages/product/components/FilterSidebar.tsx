import { useState } from 'react'
import type { CategoryResponse } from '../../../lib/api.ts'
import { brands } from '../data.ts'

interface FilterSidebarProps {
  categories: CategoryResponse[]
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
  selectedBrand: string | null
  onSelectBrand: (brand: string | null) => void
}

function FilterSidebar({ categories, selectedCategoryId, onSelectCategory, selectedBrand, onSelectBrand }: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState('')
  const visibleBrands = brands.filter((brand) => brand.toLowerCase().includes(brandSearch.trim().toLowerCase()))
  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-900">Bộ lọc sản phẩm</p>
        <button type="button" onClick={() => { onSelectCategory(null); onSelectBrand(null) }} className="text-sm text-gray-500 hover:text-brand">Bỏ hết</button>
      </div>
      <p className="font-bold text-sm text-gray-900 mb-2">Thương hiệu</p>
      <input
        type="search"
        value={brandSearch}
        onChange={(event) => setBrandSearch(event.target.value)}
        placeholder="Tìm thương hiệu..."
        aria-label="Tìm thương hiệu"
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 mb-2 outline-none focus:border-brand"
      />
      {visibleBrands.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">Không tìm thấy thương hiệu</p>
      ) : (
      <ul className="space-y-1.5 mb-4 max-h-[420px] overflow-y-auto overscroll-contain pr-1">
        {visibleBrands.map((brand) => (
          <li key={brand}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="brand-filter"
                checked={selectedBrand === brand}
                onChange={() => onSelectBrand(brand)}
                onClick={() => { if (selectedBrand === brand) onSelectBrand(null) }}
                className="accent-[#22abff]"
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>
      )}
      <p className="font-bold text-sm text-gray-900 mb-2">Danh mục</p>
      <ul className="space-y-1.5">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onSelectCategory(category.id === selectedCategoryId ? null : category.id)}
              className={`text-sm hover:text-brand ${category.id === selectedCategoryId ? 'text-brand font-bold' : 'text-gray-600'}`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default FilterSidebar
