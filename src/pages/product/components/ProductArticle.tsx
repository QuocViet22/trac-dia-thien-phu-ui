interface ProductArticleProps {
  name: string
  description: string | null
  categoryName: string | null
}

function ProductArticle({ description }: ProductArticleProps) {
  if (description) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4" dangerouslySetInnerHTML={{ __html: description }} />
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
    </section>
  )
}

export default ProductArticle
