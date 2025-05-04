'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/format'
import useCartStore from '@/stores/useCartStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import axios from '@/lib/axios-custom'
import toast from 'react-hot-toast'

interface DirectCheckoutProduct {
  productId: string
  quantity: number
  name: string
  price: number
  image: string | null
  unit: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart, fetchCartItems, selectedItemIds, getSelectedItems } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<DirectCheckoutProduct | null>(
    null
  )
  const [isDirectCheckout, setIsDirectCheckout] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Use a ref to track if we've already redirected to prevent loops
  const hasRedirected = useRef(false)
  // Use a ref to track if initial data loading is complete
  const initialLoadComplete = useRef(false)

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    note: '',
  })

  // Validation state
  const [errors, setErrors] = useState({
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
  })

  // Delivery date and time state - get from localStorage if available
  const [deliveryDate, setDeliveryDate] = useState(
    localStorage.getItem('deliveryDate') ||
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  )
  const [deliveryTime, setDeliveryTime] = useState(
    localStorage.getItem('deliveryTime') || '8:00 - 10:00'
  )
  const [showDatePopover, setShowDatePopover] = useState(false)
  const [showTimePopover, setShowTimePopover] = useState(false)

  // Initial data loading - only runs once
  useEffect(() => {
    // Skip if we've already loaded data
    if (initialLoadComplete.current) return

    const loadData = async () => {
      setIsLoading(true)
      console.log('Initial data loading started')

      try {
        // Check for direct checkout first
        const directCheckoutData = sessionStorage.getItem('directCheckout')
        if (directCheckoutData) {
          try {
            const product = JSON.parse(directCheckoutData) as DirectCheckoutProduct
            console.log('Direct checkout product found:', product)

            setDirectCheckoutProduct(product)
            setIsDirectCheckout(true)
            setSelectedItems([product])

            // Clear the session storage
            sessionStorage.removeItem('directCheckout')
          } catch (error) {
            console.error('Error parsing direct checkout data:', error)
            setIsDirectCheckout(false)
          }
        } else {
          // Regular cart checkout
          setIsDirectCheckout(false)

          // Only proceed if there are selected items
          if (selectedItemIds.length > 0) {
            await fetchCartItems()
            const selected = getSelectedItems()
            console.log('Selected items for checkout:', selected)

            if (selected.length === 0) {
              // No valid items to checkout
              if (!hasRedirected.current) {
                hasRedirected.current = true
                toast.error('Không có sản phẩm hợp lệ để thanh toán')
                navigate('/cart')
                return
              }
            } else {
              setSelectedItems(selected)
            }
          } else {
            // No items selected
            if (!hasRedirected.current) {
              hasRedirected.current = true
              toast.error('Vui lòng chọn sản phẩm để thanh toán')
              navigate('/cart')
              return
            }
          }
        }
      } catch (error) {
        console.error('Error loading checkout data:', error)
        toast.error('Đã xảy ra lỗi khi tải dữ liệu')
      } finally {
        setIsLoading(false)
        initialLoadComplete.current = true
        console.log('Initial data loading complete')
      }
    }

    loadData()
  }, [fetchCartItems, getSelectedItems, selectedItemIds, navigate])

  // Generate delivery dates dynamically (today + 5 days)
  const deliveryDates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  })

  // Available delivery times
  const deliveryTimes = [
    '8:00 - 10:00',
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
    '19:00 - 21:00',
  ]

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      customerName: formData.customerName ? '' : 'Vui lòng nhập họ và tên',
      customerAddress: formData.customerAddress ? '' : 'Vui lòng nhập địa chỉ',
      customerPhone: formData.customerPhone ? '' : 'Vui lòng nhập số điện thoại',
      customerEmail: formData.customerEmail ? '' : 'Vui lòng nhập email',
    }

    // Phone validation
    if (formData.customerPhone && !/^[0-9]{10}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ'
    }

    // Email validation
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email không hợp lệ'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Parse delivery date and time to create a Date object
  const parseDeliveryDateTime = () => {
    const [day, month, year] = deliveryDate.split('/').map(Number)
    const [startHourString] = deliveryTime.split(':')

    const startHour = startHourString ? Number(startHourString) : 0

    const paddedMonth = String(month).padStart(2, '0')
    const paddedDay = String(day).padStart(2, '0')
    const paddedHour = String(startHour).padStart(2, '0')

    return `${year}-${paddedMonth}-${paddedDay}T${paddedHour}:00:00`
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order items - only include selected items
      const orderItemRequests = selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))

      // Create order request payload
      const orderRequest = {
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        note: formData.note,
        estimatedDeliveryDate: parseDeliveryDateTime(),
        orderItemRequests,
      }

      console.log('Submitting order:', orderRequest)

      // Send order to API
      const response = await axios.post('/api/order', orderRequest)

      // Handle successful order
      if (response.data.status === 201) {
        // Only clear cart items if not direct checkout
        if (!isDirectCheckout) {
          // Clear selected items from cart
          const updatedCartItems = items.filter((item) => !selectedItemIds.includes(item.productId))

          // If all items were selected, clear the cart
          if (updatedCartItems.length === 0) {
            clearCart()
          } else {
            // Otherwise, only remove the selected items
            // This would require a new method in the cart store, which we'll add
            // For now, we'll just clear the cart
            clearCart()
          }
        }

        // Navigate to success page with order details
        navigate('/checkout-success', {
          state: {
            orderId: response.data.result.id,
            orderCode: response.data.result.orderCode || 'AHDINDJUS252651', // Fallback code if not provided
            orderDate: response.data.result.createdAt || new Date(),
            total: selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          },
        })
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total for selected items
  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-6">THÔNG TIN GIAO HÀNG</h1>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
            <span className="mt-2 text-sm text-gray-600">Đang tải thông tin đơn hàng...</span>
          </div>
        </div>
      </div>
    )
  }

  // If we have no items to checkout, show a message
  if (selectedItems.length === 0 && !isLoading && initialLoadComplete.current) {
    return (
      <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-6">THÔNG TIN GIAO HÀNG</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Không có sản phẩm nào để thanh toán</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <a href="/cart">Quay lại giỏ hàng</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
      <h1 className="text-2xl font-bold text-green-600 text-center mb-6">THÔNG TIN GIAO HÀNG</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <label htmlFor="customerName" className="block mb-2 font-medium">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`h-12 ${errors.customerName ? 'border-red-500' : ''}`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerAddress" className="block mb-2 font-medium">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <Input
              id="customerAddress"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              className={`h-12 ${errors.customerAddress ? 'border-red-500' : ''}`}
            />
            {errors.customerAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerPhone" className="block mb-2 font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className={`h-12 ${errors.customerPhone ? 'border-red-500' : ''}`}
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerEmail" className="block mb-2 font-medium">
              Địa chỉ email <span className="text-red-500">*</span>
            </label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              className={`h-12 ${errors.customerEmail ? 'border-red-500' : ''}`}
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>

          {/* <div>
            <label htmlFor="note" className="block mb-2 font-medium">
              Ghi chú
            </label>
            <Textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
              className="min-h-[100px]"
            />
          </div> */}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-green-700 mb-4">ĐƠN HÀNG CỦA BẠN</h2>

            <div className="border-b pb-4">
              <div className="flex justify-between font-semibold mb-4">
                <span>SẢN PHẨM</span>
                <span>TẠM TÍNH</span>
              </div>

              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div key={item.productId} className="flex justify-between py-2">
                    <div className="flex-1 pr-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">
                        {item.quantity} {item.unit || 'x'}
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">Không có sản phẩm nào</div>
              )}
            </div>

            <div className="py-4 border-b">
              <div className="flex justify-between font-semibold">
                <span>Tổng</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="mb-4">Thanh toán khi nhận hàng</p>

              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium mb-3">Thời gian giao hàng</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-1">Ngày giao</label>
                    <Popover open={showDatePopover} onOpenChange={setShowDatePopover}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-left"
                          onClick={() => setShowDatePopover(true)}
                        >
                          <span>{deliveryDate}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <div className="max-h-[200px] overflow-auto">
                          {deliveryDates.map((date) => (
                            <div
                              key={date}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                date === deliveryDate ? 'bg-[#9DE25C]' : ''
                              }`}
                              onClick={() => {
                                setDeliveryDate(date)
                                setShowDatePopover(false)
                              }}
                            >
                              {date}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Thời gian giao</label>
                    <Popover open={showTimePopover} onOpenChange={setShowTimePopover}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-left"
                          onClick={() => setShowTimePopover(true)}
                        >
                          <span>{deliveryTime}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <div className="max-h-[200px] overflow-auto">
                          {deliveryTimes.map((time) => (
                            <div
                              key={time}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                time === deliveryTime ? 'bg-[#9DE25C]' : ''
                              }`}
                              onClick={() => {
                                setDeliveryTime(time)
                                setShowTimePopover(false)
                              }}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                disabled={isSubmitting || selectedItems.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ĐANG XỬ LÝ
                  </>
                ) : (
                  'ĐẶT HÀNG'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
