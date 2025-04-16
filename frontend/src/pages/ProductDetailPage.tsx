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
import axios from '../lib/axios-custom'
import useEmblaCarousel from 'embla-carousel-react'
import RelatedProducts from '@/components/product/related-products'
import Feature from '@/components/home/feature'
import { SectionDivider } from '@/components/ui/section-devider'
import BlogCarousel from '@/components/home/blog-carousel'
import useBlogStore from '@/stores/useBlogStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { fetchProductById, isLoading, currenetProduct } = useProductStore()
  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const { blogs, fetchBlogs } = useBlogStore()

  useEffect(() => {
    if (id) {
      fetchProductById(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [id, fetchProductById])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currenetProduct?.categoryName) return

      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/search?categoryName=${currenetProduct.categoryName}&page=0&size=12`
        )

        // Filter out current product if needed
        const filtered = response.data.result?.content.filter(
          (product: Product) => product.id !== currenetProduct.id
        )

        setRelatedProducts(filtered || [])
      } catch (error) {
        console.error('Failed to fetch related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [currenetProduct])

  // Embla carousel setup
  const [mainViewRef, mainEmblaApi] = useEmblaCarousel()
  const [thumbViewRef, thumbEmblaApi] = useEmblaCarousel({
    axis: 'y',
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
        <Link
          to={`/search?category=${currenetProduct.categoryName}`}
          className="hover:underline text-green-600"
        >
          {currenetProduct.categoryName}
        </Link>
        <span className="text-gray-500">&gt;</span>
        <span className="text-gray-700">{currenetProduct.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section with Embla Carousel */}
        <div className="flex gap-4 h-80">
          {/* Thumbnail Carousel on Left */}
          <div className="w-24 h-full overflow-hidden no-scrollbar" ref={thumbViewRef}>
            <div className="flex flex-col gap-2 h-full">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer ${
                    selectedIndex === index ? 'opacity-100' : 'opacity-70'
                  }`}
                  onClick={() => onThumbClick(index)}
                >
                  <div
                    className={`border rounded-xl overflow-hidden h-20 ${
                      selectedIndex === index ? 'border-2 border-green-500' : ''
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Carousel on Right */}
          <div className="flex-1 overflow-hidden rounded-md bg-white" ref={mainViewRef}>
            <div className="flex h-full">
              {images.map((image, index) => (
                <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
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
              {currenetProduct.stock > 0 ? (
                <span className="text-sm text-green-600">
                  Còn {currenetProduct.stock} {currenetProduct.unit}
                </span>
              ) : (
                <span className="text-sm text-red-600">Hết hàng</span>
              )}
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
              disabled={currenetProduct.stock === 0}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={currenetProduct.stock === 0}
            >
              MUA NGAY
            </Button>
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
            <h3 className="font-medium text-green-600 text-lg mb-4">Mô tả sản phẩm</h3>
            <div
              dangerouslySetInnerHTML={{ __html: currenetProduct.description }}
              className="prose max-w-none"
            />
          </div>

          {/* Delivery Info */}
          <div className="bg-white p-6 border rounded-md w-full lg:w-[300px] xl:w-[360px] shrink-0 self-start">
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
      <RelatedProducts products={relatedProducts} />
      <SectionDivider />

      <Feature />
      <SectionDivider />

      <div className="animate-fade-in">
        <BlogCarousel items={blogs} />
      </div>
    </div>
  )
}
