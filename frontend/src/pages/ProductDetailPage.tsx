'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import useProductStore from '@/stores/useProductStore'
import useCartStore from '@/stores/useCartStore'
import { Box, Minus, Phone, Plus, Truck } from 'lucide-react'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import useEmblaCarousel from 'embla-carousel-react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { fetchProductById, isLoading, currenetProduct } = useProductStore()
  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  // Embla carousel setup
  const [mainViewRef, mainEmblaApi] = useEmblaCarousel()
  const [thumbViewRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  // Callbacks for synchronizing the carousels
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmblaApi || !thumbEmblaApi) return
      mainEmblaApi.scrollTo(index)
    },
    [mainEmblaApi, thumbEmblaApi]
  )

  const onSelect = useCallback(() => {
    if (!mainEmblaApi || !thumbEmblaApi) return
    setSelectedIndex(mainEmblaApi.selectedScrollSnap())
    thumbEmblaApi.scrollTo(mainEmblaApi.selectedScrollSnap())
  }, [mainEmblaApi, thumbEmblaApi])

  // Set up the synchronization effect
  useEffect(() => {
    if (!mainEmblaApi || !thumbEmblaApi) return

    onSelect()
    mainEmblaApi.on('select', onSelect)

    return () => {
      mainEmblaApi.off('select', onSelect)
    }
  }, [mainEmblaApi, thumbEmblaApi, onSelect])

  useEffect(() => {
    if (id) {
      fetchProductById(id)
    }
  }, [id, fetchProductById])

  const increaseQuantity = () => {
    if (currenetProduct && quantity < currenetProduct.stock) {
      setQuantity(quantity + 1)
    } else {
      toast.error('Không thể thêm nữa, đã đạt số lượng tối đa')
    }
  }

  const decreaseQuantity = () => {
    if (currenetProduct && quantity > currenetProduct.minUnitToOrder) {
      setQuantity(quantity - 1)
    } else if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = (product: Product) => {
    addItem(product, quantity)
    toast.success(`Đã thêm ${quantity} ${product.unit} ${product.name} vào giỏ hàng`)
  }

  if (isLoading || !currenetProduct) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-lg">Đang tải sản phẩm...</p>
      </div>
    )
  }

  const actualPrice = currenetProduct.sellingPrice || currenetProduct.originalPrice
  const hasDiscount = currenetProduct.discountPercentage > 0

  // Ensure thumbnail image is first in the carousel
  const sortedImages = currenetProduct.images ? [...currenetProduct.images] : []

  // If thumbnail exists and is in the images array, move it to the front
  if (currenetProduct.thumbnailImage) {
    // Remove thumbnail from current position if it exists in the array
    const thumbnailIndex = sortedImages.findIndex((img) => img === currenetProduct.thumbnailImage)
    if (thumbnailIndex !== -1) {
      sortedImages.splice(thumbnailIndex, 1)
    }

    // Add thumbnail to the beginning of the array
    sortedImages.unshift(currenetProduct.thumbnailImage)
  }

  // Fallback if no images
  const images = sortedImages.length > 0 ? sortedImages : [currenetProduct.thumbnailImage]

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 mb-6 text-green-600">
        <Link to="/" className="hover:underline">
          Hoa quả nhập khẩu
        </Link>
        <span className="text-gray-500">&gt;</span>
        <span className="text-gray-700">{currenetProduct.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section with Embla Carousel */}
        <div className="space-y-4">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-md bg-white h-80" ref={mainViewRef}>
            <div className="flex h-full">
              {images.map((image, index) => (
                <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`${currenetProduct.name} ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="overflow-hidden" ref={thumbViewRef}>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`flex-[0_0_20%] min-w-0 cursor-pointer ${
                    selectedIndex === index ? 'opacity-100' : 'opacity-70'
                  }`}
                  onClick={() => onThumbClick(index)}
                >
                  <div
                    className={`border rounded-xl overflow-hidden h-24 ${
                      selectedIndex === index ? 'border-2 border-green-500' : ''
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${currenetProduct.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="text-2xl font-medium text-green-600">{currenetProduct.name}</h1>

          {/* Price Section */}
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-red-600">{formatCurrency(actualPrice)}</span>
            {hasDiscount && (
              <span className="text-gray-500 line-through">
                {formatCurrency(currenetProduct.originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-24">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-2"
                >
                  <Minus size={16} />
                </Button>
                <span className="px-4">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseQuantity}
                  disabled={quantity >= currenetProduct.stock}
                  className="px-2"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center">
              <span className="w-24">Tình trạng:</span>
              <span className="text-sm text-green-600">
                Còn {currenetProduct.stock} {currenetProduct.unit}
              </span>
            </div>

            {/* Origin */}
            <div className="flex items-center">
              <span className="w-24">Xuất xứ:</span>
              <span className="text-sm">{currenetProduct.origin}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => addToCart(currenetProduct)}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">MUA NGAY</Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12 pt-6">
        <h2 className="text-xl font-medium border-b pb-2 mb-6 text-green-600">
          Thông tin sản phẩm
        </h2>

        {/* Flex container for description + delivery info */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Description */}
          <div className="bg-white p-6 border rounded-md flex-1">
            <h3 className="font-medium text-lg mb-4">Mô tả sản phẩm</h3>
            <div
              dangerouslySetInnerHTML={{ __html: currenetProduct.description }}
              className="prose max-w-none"
            />
          </div>

          {/* Delivery Info */}
          <div className="bg-white p-6 border rounded-md w-full lg:w-[300px] xl:w-[360px] shrink-0">
            <h3 className="font-medium text-lg mb-4">Dịch vụ giao hàng</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="size-8 rounded-full border border-gray-300 flex items-center justify-center">
                  <Box className="size-5 text-green-500" />
                </div>
                <span>Cam kết 100% chính hãng</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="size-8 rounded-full border border-gray-300 flex items-center justify-center">
                  <Truck className="size-5 text-green-500" />
                </div>
                <div>
                  <p>Giao hàng dự kiến:</p>
                  <p className="font-medium">Thứ 2 - Chủ nhật từ 08:00 - 21h00</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="size-8 rounded-full border border-gray-300 flex items-center justify-center">
                  <Phone className="size-5 text-green-500" />
                </div>
                <div>
                  <p>Hỗ trợ 24/7</p>
                  <p>Với các kênh facebook, zalo</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-xl font-medium border-b pb-2 mb-6 text-green-600">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-md overflow-hidden bg-white">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/lenauhan_01_oc3lf1.jpg"
                  alt="Similar product"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-sm">
                  -20%
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium truncate">Tên sản phẩm</h3>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="font-bold text-red-600">500,000đ</p>
                    <p className="text-xs text-gray-500 line-through">600,000đ</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-8 px-2">
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Products Button */}
      <div className="my-8 flex justify-center">
        <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
          Xem thêm sản phẩm
        </Button>
      </div>
    </div>
  )
}
