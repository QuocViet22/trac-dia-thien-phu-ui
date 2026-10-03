import { bestSellers } from '../data.ts'
import ProductCard from './ProductCard.tsx'

function BestSellers() {
  return (
    <section id="best-sellers">
      <h2 className="text-center text-xl md:text-2xl font-bold text-brand">SẢN PHẨM BÁN CHẠY</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  )
}

export default BestSellers
