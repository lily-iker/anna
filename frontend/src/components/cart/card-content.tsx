'use client'

import { useState } from 'react'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import useCartStore from '@/stores/useCartStore'
import { Link } from 'react-router-dom'

export default function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setIsUpdating(productId)
    updateQuantity(productId, newQuantity)
    setTimeout(() => setIsUpdating(null), 300) // Visual feedback
  }

  const handleRemoveItem = (productId: string) => {
    setIsUpdating(productId)
    setTimeout(() => {
      removeItem(productId)
      setIsUpdating(null)
    }, 300)
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 py-8">
        <div className="bg-gray-100 rounded-full p-3">
          <ShoppingBag className="h-8 w-8 text-gray-500" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-lg">Giỏ hàng trống</h3>
          <p className="text-gray-500 mt-1">Thêm sản phẩm vào giỏ hàng của bạn</p>
        </div>
        <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
          <Link to="/search">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Giỏ hàng của bạn</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa tất cả
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className={`flex border-b pb-4 ${isUpdating === item.productId ? 'opacity-50' : ''}`}
            >
              <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image || '/placeholder.svg?height=80&width=80'}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="ml-4 flex-1">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-medium text-gray-800 hover:text-green-600 line-clamp-2"
                >
                  {item.name}
                </Link>

                <div className="text-green-600 font-bold mt-1">{formatCurrency(item.price)}</div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={isUpdating !== null}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      disabled={isUpdating !== null}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={isUpdating !== null}
                    className="text-gray-500 hover:text-red-500 p-0 h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t mt-auto pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Tạm tính:</span>
          <span className="font-medium">{formatCurrency(getSubtotal())}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Tổng cộng:</span>
          <span className="text-green-600">{formatCurrency(getSubtotal())}</span>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700">Tiến hành thanh toán</Button>

        <Button variant="outline" className="w-full mt-2" asChild>
          <Link to="/search">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  )
}
