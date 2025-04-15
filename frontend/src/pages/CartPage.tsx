'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/format'
import useCartStore from '@/stores/useCartStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CartPage() {
  const {
    items,
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    fetchCartItems,
    isLoading,
    error,
  } = useCartStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  )
  const [deliveryTime, setDeliveryTime] = useState('8:00 - 10:00')
  const [showDatePopover, setShowDatePopover] = useState(false)
  const [showTimePopover, setShowTimePopover] = useState(false)

  // Fetch product details when component mounts
  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

  // Initialize selected items with all items
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(items.map((item) => item.productId))
      setIsAllSelected(true)
    } else {
      setSelectedItems([])
      setIsAllSelected(false)
    }
  }, [items])

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.productId))
    }
    setIsAllSelected(!isAllSelected)
  }

  // Handle individual item selection
  const handleSelectItem = (productId: string) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId))
    } else {
      setSelectedItems([...selectedItems, productId])
    }
  }

  // Update isAllSelected when selectedItems changes
  useEffect(() => {
    setIsAllSelected(selectedItems.length === items.length && items.length > 0)
  }, [selectedItems, items])

  // Calculate total for selected items
  const calculateSelectedTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0)
  }

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

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-6">GIỎ HÀNG</h1>
        <div className="bg-white rounded-lg shadow p-24 text-center">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/search">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  //   if (isLoading) {
  //     return (
  //       <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 py-8">
  //         <h1 className="text-2xl font-bold text-green-600 text-center mb-6">GIỎ HÀNG</h1>
  //         <div className="bg-white rounded-lg shadow p-24 text-center">
  //           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
  //           <p className="text-gray-600">Đang tải thông tin giỏ hàng...</p>
  //         </div>
  //       </div>
  //     )
  //   }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-6">GIỎ HÀNG</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => fetchCartItems()} className="mr-2">
            Thử lại
          </Button>
          <Button asChild variant="outline">
            <Link to="/search">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 pb-8 pt-24">
      <h1 className="text-2xl font-bold text-green-600 text-center mb-6">GIỎ HÀNG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Cart Items Table */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                    </th>
                    <th className="py-3 px-4 text-left">Sản phẩm</th>
                    <th className="py-3 px-4 text-left">Giá</th>
                    <th className="py-3 px-4 text-left">Số lượng({items[0]?.unit || 'kg/set'})</th>
                    <th className="py-3 px-4 text-left">Tạm tính</th>
                    <th className="py-3 px-4 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="py-4 px-4">
                        <Checkbox
                          checked={selectedItems.includes(item.productId)}
                          onCheckedChange={() => handleSelectItem(item.productId)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={item.image || '/placeholder.svg?height=60&width=60'}
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover mr-2 sm:mr-3"
                          />
                          <span className="font-medium text-sm sm:text-base line-clamp-2">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{formatCurrency(item.price)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <button
                            className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center rounded-l-md bg-gray-100"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-8 sm:w-10 h-6 sm:h-8 border-t border-b border-gray-300 text-center text-sm"
                          />
                          <button
                            className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center rounded-r-md bg-gray-100"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">{formatCurrency(item.price * item.quantity)}</td>
                      <td className="py-4 px-4">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.productId)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              asChild
              variant="outline"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Link to="/">Quay về trang chủ</Link>
            </Button>
            <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
              <Link to="/search">Tiếp tục mua hàng</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-green-600 mb-4">Thông tin đơn hàng</h2>

            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">Thời gian giao hàng</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Ngày giao</label>
                  <Popover open={showDatePopover} onOpenChange={setShowDatePopover}>
                    <PopoverTrigger asChild>
                      <button
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

              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Xác nhận thời gian
              </Button>
            </div>

            <div className="py-4 border-b">
              <div className="flex justify-between mb-2">
                <span>Tổng</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(calculateSelectedTotal())}
                </span>
              </div>
            </div>

            <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
              THANH TOÁN
            </Button>

            <div className="mt-6 bg-green-50 p-4 rounded-md text-sm">
              <h3 className="font-medium text-green-700 mb-2">Chính sách mua hàng</h3>
              <ol className="list-decimal pl-5 space-y-1 text-green-800">
                <li>Sản phẩm được hỗ trợ hoàn trả trong vòng 24 giờ kể từ thời điểm nhận hàng.</li>
                <li>
                  Chỉ áp dụng hoàn trả cho đơn hàng số lượng lớn khi sản phẩm có lỗi vượt quá 10%.
                </li>
                <li>
                  Chúng tôi chỉ tiếp nhận đơn hàng từ 2kg trở lên để đảm bảo chất lượng và quy trình
                  giao hàng.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
