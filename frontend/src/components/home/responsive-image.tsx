'use client'

import { useState, useEffect, memo } from 'react'

interface ResponsiveImageProps {
  src: string
  alt: string
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  className?: string
  fallbackSrc?: string
  sizes?: string
}

const ResponsiveImage = memo(
  ({
    src,
    alt,
    aspectRatio = '16/9',
    objectFit = 'cover',
    className = '',
    fallbackSrc = '/placeholder.svg',
    sizes = '100vw',
  }: ResponsiveImageProps) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      setImgSrc(src || fallbackSrc)
      setIsLoaded(false)
    }, [src, fallbackSrc])

    const handleError = () => {
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc)
      }
    }

    const handleLoad = () => {
      setIsLoaded(true)
    }

    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
        <img
          src={imgSrc || '/placeholder.svg'}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit }}
        />
        {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      </div>
    )
  }
)

ResponsiveImage.displayName = 'ResponsiveImage'

export default ResponsiveImage
