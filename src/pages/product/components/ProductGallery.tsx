import { useState } from 'react'
import Img from '../../../components/Img.tsx'

interface ProductGalleryProps {
  images: string[]
  name: string
}

function ProductGallery({ images, name }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="relative overflow-hidden group rounded-lg">
        <Img src={images[index]} fallback="https://placehold.co/600x600?text=No+Image" alt={name} className="w-full h-80 object-contain transition-transform duration-300 motion-safe:group-hover:scale-110" />
        <button type="button" aria-label="Yêu thích" className="absolute top-2 right-2 w-9 h-9 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 bg-white">
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {images.map((image, thumbIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(thumbIndex)}
            aria-label={`Xem ảnh ${thumbIndex + 1}`}
            className={`shrink-0 rounded-lg border p-1 transition-colors ${thumbIndex === index ? 'border-brand' : 'border-gray-200 hover:border-brand'}`}
          >
            <Img src={image} fallback="https://placehold.co/100x100?text=No+Image" alt="" className="w-16 h-16 object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
