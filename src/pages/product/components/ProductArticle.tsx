import { useEffect, useRef, useState } from 'react'

const COLLAPSED_HEIGHT = 300

interface ProductArticleProps {
  name: string
  description: string | null
  categoryName: string | null
}

function ProductArticle({ description }: ProductArticleProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const bodyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el && el.scrollHeight > COLLAPSED_HEIGHT) {
      setOverflows(true)
    }
  }, [description])

  if (description) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
        <div className="relative">
          <section
            ref={bodyRef}
            className={`bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4 ${expanded ? '' : 'max-h-[300px] overflow-hidden'}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {!expanded && overflows && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
        {overflows && (
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="text-sm font-bold text-brand hover:underline"
            >
              {expanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
    </section>
  )
}

export default ProductArticle
