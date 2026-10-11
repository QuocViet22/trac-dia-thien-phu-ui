import { sortOptions, sortParams } from '../data.ts'

interface ToolbarProps {
  sort: string
  onSelectSort: (sort: string) => void
}

function Toolbar({ sort, onSelectSort }: ToolbarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="font-bold text-sm text-gray-900">Xếp theo:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectSort(sortParams[option])}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${sortParams[option] === sort ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Toolbar
