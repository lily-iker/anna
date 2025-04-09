'use client'

import { useRef, useState, useEffect, useCallback, memo } from 'react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import type { Banner } from '@/types'

interface HeroCarouselProps {
  items: Banner[]
}

// Create a memoized dot component to prevent unnecessary re-renders
const CarouselDot = memo(
  ({ index, current, onClick }: { index: number; current: number; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`size-2 rounded-full transition-colors duration-300 ${
        current === index ? 'bg-white' : 'bg-white/50'
      } hover:bg-white/80`}
    />
  )
)

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Use a ref for autoplay to prevent re-creation on each render
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  // Memoize the scrollTo function to prevent re-creation on each render
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  useEffect(() => {
    if (!api) return

    // Use a single function for all event handlers to reduce closures
    const handleSelect = () => setCurrent(api.selectedScrollSnap())

    // Set up event listeners
    api.on('select', handleSelect)
    api.on('reInit', handleSelect)
    api.on('init', handleSelect)

    // Set initial value
    handleSelect()

    // Clean up
    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
      api.off('init', handleSelect)
    }
  }, [api])

  // Don't render if no items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <Carousel
        className="w-full"
        opts={{ align: 'center', loop: true }}
        plugins={[autoplayRef.current]}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="w-full">
              <section
                className="relative bg-cover bg-center h-[500px] grid grid-cols-12 items-center px-4"
                style={{
                  backgroundImage: `url('${item.thumbnailImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Button only for the first item */}
                {index === 0 && (
                  <div className="absolute top-[64%] left-[28%] transform -translate-x-1/2 z-20">
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-4xl w-48">
                      Khám phá
                    </Button>
                  </div>
                )}
              </section>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots navigation */}
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
