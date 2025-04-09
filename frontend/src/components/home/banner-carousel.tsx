'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import type { Banner } from '@/types'
import Autoplay from 'embla-carousel-autoplay'

interface BannerCarouselProps {
  items: Banner[]
}

// Create a memoized dot component to prevent unnecessary re-renders
const CarouselDot = memo(
  ({ index, current, onClick }: { index: number; current: number; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`size-2 rounded-full transition-colors duration-300 ${
        current === index ? 'bg-white' : 'bg-white/50'
      } hover:bg-white/80 focus:outline-none`}
    />
  )
)

export default function BannerCarousel({ items }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Use a ref for autoplay to prevent re-creation on each render
  const autoplayRef = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  )

  // Memoize the scrollTo function to prevent re-creation on each render
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  useEffect(() => {
    if (!api || items.length === 0) {
      return
    }

    // Use a single function for all event handlers to reduce closures
    const handleApiChange = () => {
      setCurrent(api.selectedScrollSnap())
    }

    // Set initial value
    handleApiChange()

    // Set up event listeners
    api.on('select', handleApiChange)
    api.on('reInit', handleApiChange)
    api.on('init', handleApiChange)

    // Clean up
    return () => {
      api.off('select', handleApiChange)
      api.off('reInit', handleApiChange)
      api.off('init', handleApiChange)
    }
  }, [api, items])

  // Make sure we have items before rendering
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="relative select-none">
      <Carousel
        className="w-full"
        opts={{
          align: 'center',
          loop: true,
        }}
        plugins={[autoplayRef.current]}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className="w-full">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="relative h-64 md:h-111 w-full bg-pink-200 rounded-2xl overflow-hidden">
                    <img
                      src={item.thumbnailImage || '/placeholder.svg'}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy" // Add lazy loading
                      decoding="async" // Add async decoding
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Enhanced dot navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <CarouselDot
            key={index}
            index={index}
            current={current}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
