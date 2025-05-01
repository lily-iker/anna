'use client'

import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'

interface OrderSuccessState {
  orderId: string
  orderDate: string
  total: number
}

export default function CheckoutSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state as OrderSuccessState | null

  // Redirect to home if no order data is available
  useEffect(() => {
    if (!orderData) {
      navigate('/')
    }
  }, [orderData, navigate])

  if (!orderData) {
    return null
  }

  // Format the order date
  const formattedDate = new Date(orderData.orderDate).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="container mx-auto px-4 py-12 pt-28 max-w-3xl">
      <div className="border border-green-500 rounded-3xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-green-600 mb-6">ĐẶT HÀNG THÀNH CÔNG</h1>

        <p className="text-lg mb-6">Cảm ơn bạn đã đặt hàng tại Anna Fruits</p>

        <div className="space-y-4 mb-8">
          <p>
            <span>Tổng tiền cần thanh toán: </span>
            <span className="font-bold text-red-600">{formatCurrency(orderData.total)}</span>
          </p>
          <p>
            <span>Mã đơn hàng: </span>
            <span className="font-semibold">{orderData.orderId}</span>
          </p>
          <p>
            <span>Thời gian đặt hàng: </span>
            <span className="font-semibold">{formattedDate}</span>
          </p>
        </div>

        <p className="mb-8">
          Chúng tôi sẽ liên hệ quý khách để xác nhận đơn hàng trong thời gian sớm nhất!
        </p>

        <p className="mb-8">Để được hỗ trợ vui lòng gọi vào hotline: 038 623 6288</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/">Quay về trang chủ</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Link to="/search">Xem sản phẩm khác</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
