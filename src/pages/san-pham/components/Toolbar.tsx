import { sortOptions } from '../data.ts'

function Toolbar() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="font-bold text-sm text-gray-900">Xếp theo:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option, index) => (
          <button
            key={option}
            type="button"
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${index === 0 ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <span className="ml-auto flex items-center gap-2 text-sm text-gray-600">
        Xem:
        <button type="button" aria-label="Xem dạng lưới" className="text-brand"><i className="fa-solid fa-table-cells-large"></i></button>
        <button type="button" aria-label="Xem dạng cột" className="text-gray-400 hover:text-brand"><i className="fa-solid fa-list"></i></button>
      </span>
    </div>
  )
}

export default Toolbar
