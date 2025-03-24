"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { Banner } from "@/types"

interface HeroCarouselProps {
  items: Banner[]
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())

    api.on("select", onSelect)
    api.on("reInit", onSelect)
    api.on("init", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
      api.off("init", onSelect)
    }
  }, [api])

  return (
    <div className="relative">
      <Carousel
        className="w-full"
        opts={{ align: "center", loop: true }}
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
                  backgroundPosition: "center right",
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
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`size-2 rounded-full transition-colors duration-300 ${
              current === index ? "bg-white" : "bg-white/50"
            } hover:bg-white/80`}
          />
        ))}
      </div>
    </div>
  )
}
