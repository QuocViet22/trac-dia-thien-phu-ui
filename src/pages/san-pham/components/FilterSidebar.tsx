import { brands, categories, priceRanges } from '../data.ts'

function FilterSidebar() {
  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-900">Bộ lọc sản phẩm</p>
        <a href="#" className="text-sm text-gray-500 hover:text-brand">Bỏ hết</a>
      </div>
      <p className="font-bold text-sm text-gray-900 mb-2">Thương hiệu</p>
      <ul className="space-y-1.5 mb-4">
        {brands.map((brand) => (
          <li key={brand}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#22abff]" />
              {brand}
            </label>
          </li>
        ))}
      </ul>
      <p className="font-bold text-sm text-gray-900 mb-2">Giá bán</p>
      <ul className="space-y-1.5 mb-4">
        {priceRanges.map((range) => (
          <li key={range}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#22abff]" />
              {range}
            </label>
          </li>
        ))}
      </ul>
      <p className="font-bold text-sm text-gray-900 mb-2">Danh mục</p>
      <ul className="space-y-1.5">
        {categories.map((category) => (
          <li key={category}>
            <a href="#" className="text-sm text-gray-600 hover:text-brand">{category}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default FilterSidebar
