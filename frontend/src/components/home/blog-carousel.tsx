"use client"

import { useState, useEffect, useCallback } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import { Blog } from "@/types"

interface BlogCarouselProps {
  items: Blog[]
}

export default function BlogCarousel({ items }: BlogCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    api.on("select", onSelect)
    api.on("reInit", onSelect)
    onSelect()

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <div className="relative w-fit mb-6">
          <h2 className="text-2xl font-bold">Tìm Hiểu Thêm Về Anna</h2>
          <div className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-gradient-to-r from-gray-500 via-gray-300 to-transparent"></div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-4 right-0 flex space-x-2 z-10">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="h-8 w-8 rounded-full border border-black bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          aria-label="Previous slide"
        >
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L1 5.5L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="h-8 w-8 rounded-full border border-black bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          aria-label="Next slide"
        >
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 5.5L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Carousel content */}
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/1 sm:basis-1/2 lg:basis-1/3">
              <Link to="#" className="group block">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={item.thumbnailImage || "https://res.cloudinary.com/dr4kiyshe/image/upload/v1738244776/dam_vinh_hung_kkvsgx.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <h3 className="text-white font-medium">{item.title}</h3>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
