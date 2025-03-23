"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import type { Banner } from "@/types"
import Autoplay from "embla-carousel-autoplay"

interface BannerCarouselProps {
  items: Banner[]
}

export default function BannerCarousel({ items }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

    // Create a ref for the autoplay plugin
    const autoplayRef = useRef(
      Autoplay({ 
        delay: 3000, 
        stopOnInteraction: false, 
        stopOnMouseEnter: true, 
        playOnInit: true 
      }),
    )

  // Use callback for scrollTo to prevent recreation on each render
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  // Initialize and update carousel state
  useEffect(() => {
    if (!api || items.length === 0) {
      return
    }

    // Set initial count based on items length if API isn't ready yet
    if (count === 0 && items.length > 0) {
      setCount(items.length)
    }

    const onReady = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    // Run once on initialization
    onReady()

    // Set up event listeners
    api.on("select", onSelect)
    api.on("reInit", onReady)
    api.on("init", onReady)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReady)
      api.off("init", onReady)
    }
  }, [api, items, count])

  // Make sure we have items before rendering
  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      {/* <div className="relative w-fit mb-6">
        <h2 className="text-2xl font-bold">Khuyến Mãi</h2>
        <div className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-gradient-to-r from-gray-500 via-gray-300 to-transparent"></div>
      </div> */}
      <div className="relative select-none">
        <Carousel
          className="w-full"
          opts={{
            align: "center",
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
                    <div className="relative h-64 md:h-100 w-full bg-pink-200 rounded-2xl overflow-hidden">
                      <img
                        src={
                          item.thumbnailImage
                            ? item.thumbnailImage
                            : "https://res.cloudinary.com/dr4kiyshe/image/upload/v1738244776/dam_vinh_hung_kkvsgx.jpg"
                        }
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex flex-col justify-center p-8">
                        <div className="max-w-md">
                          <h3 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">{item.title}</h3>
                          <div className="flex items-center mb-4">
                            <span className="text-gray-500 mr-2">GIẢM GIÁ</span>
                            <span className="text-4xl font-bold text-red-500">{item.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Enhanced dot navigation - will persist after refresh */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`size-2 rounded-full transition-colors duration-300 ${
                current === index ? "bg-white" : "bg-white/50"
              } hover:bg-white/80 focus:outline-none`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

