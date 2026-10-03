import { useState } from 'react'

interface ImgProps {
  src: string
  fallback: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

function Img({ src, fallback, alt, className, loading }: ImgProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (!failed) {
          setFailed(true)
          setCurrentSrc(fallback)
        }
      }}
    />
  )
}

export default Img
