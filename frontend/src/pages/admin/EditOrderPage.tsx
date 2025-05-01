'use client'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatDate } from '@/lib/format'
import useOrderStore from '@/stores/useOrderStore'
import type { OrderStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentOrder, fetchOrderById, updateOrderStatus, deleteOrders, isLoading } =
    useOrderStore()

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('NEW')
  const [originalStatus, setOriginalStatus] = useState<OrderStatus>('NEW')

  useEffect(() => {
    if (id) {
      fetchOrderById(id)
    }
  }, [id, fetchOrderById])

  useEffect(() => {
    if (currentOrder) {
      setSelectedStatus(currentOrder.status)
      setOriginalStatus(currentOrder.status)
    }
  }, [currentOrder])

  const handleDelete = async () => {
    if (id && window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      await deleteOrders([id])
      navigate('/admin/orders')
    }
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus)
  }

  const handleSaveChanges = async () => {
    if (id && selectedStatus !== originalStatus) {
      await updateOrderStatus(id, selectedStatus)
      setOriginalStatus(selectedStatus)
      navigate('/admin/orders')
    }
  }

  if (!currentOrder) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chỉnh sửa Đơn hàng</h1>
        <Button variant="destructive" onClick={handleDelete}>
          Xóa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="orderId" className="text-sm font-medium">
                    Mã đơn hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orderId"
                    value={currentOrder.id}
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={currentOrder.customerName}
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email của khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    value={currentOrder.customerEmail}
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Địa chỉ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={currentOrder.customerAddress || ''}
                  className="mt-1 bg-gray-50"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Cập nhật trạng thái đơn hàng</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => handleStatusChange('NEW')}
                  variant={selectedStatus === 'NEW' ? 'default' : 'outline'}
                  className={selectedStatus === 'NEW' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  size="sm"
                >
                  Mới
                </Button>
                <Button
                  type="button"
                  onClick={() => handleStatusChange('SHIPPING')}
                  variant={selectedStatus === 'SHIPPING' ? 'default' : 'outline'}
                  className={
                    selectedStatus === 'SHIPPING' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                  }
                  size="sm"
                >
                  Đang vận chuyển
                </Button>
                <Button
                  type="button"
                  onClick={() => handleStatusChange('DELIVERED')}
                  variant={selectedStatus === 'DELIVERED' ? 'default' : 'outline'}
                  className={
                    selectedStatus === 'DELIVERED' ? 'bg-green-500 hover:bg-green-600' : ''
                  }
                  size="sm"
                >
                  Đã giao
                </Button>
                <Button
                  type="button"
                  onClick={() => handleStatusChange('CANCELLED')}
                  variant={selectedStatus === 'CANCELLED' ? 'default' : 'outline'}
                  className={selectedStatus === 'CANCELLED' ? 'bg-red-500 hover:bg-red-600' : ''}
                  size="sm"
                >
                  Đã hủy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Đơn hàng</h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={item.id || index} className="border rounded-md p-4 space-y-3">
                    <h3 className="font-medium">Sản phẩm đã đặt</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`product-${index}`} className="text-sm font-medium">
                          Tên sản phẩm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`product-${index}`}
                          value={item.productName}
                          className="mt-1 bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor={`quantity-${index}`} className="text-sm font-medium">
                          Số lượng <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          value={item.quantity}
                          className="mt-1 bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${index}`} className="text-sm font-medium">
                          Giá thành <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`price-${index}`}
                          value={formatCurrency(item.price)}
                          className="mt-1 bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Tổng tiền: {formatCurrency(currentOrder.totalPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time and Delivery Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Thời gian</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orderDate" className="text-sm font-medium">
                    Ngày mua <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orderDate"
                    type="text"
                    value={formatDate(currentOrder.createdAt)}
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryTime" className="text-sm font-medium">
                    Thời gian dự kiến giao hàng
                  </Label>
                  <Input
                    id="deliveryTime"
                    value={
                      currentOrder.estimatedDeliveryDate
                        ? currentOrder.estimatedDeliveryDate
                            .split('T')[1]
                            .split(':')
                            .slice(0, 2)
                            .join(':')
                        : ''
                    }
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedDeliveryDate" className="text-sm font-medium">
                    Ngày giao dự kiến
                  </Label>
                  <Input
                    id="estimatedDeliveryDate"
                    type="date"
                    value={
                      currentOrder.estimatedDeliveryDate
                        ? currentOrder.estimatedDeliveryDate.split('T')[0]
                        : ''
                    }
                    className="mt-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          type="button"
          onClick={handleSaveChanges}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={selectedStatus === originalStatus || isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </Button>

        <Button type="button" onClick={() => navigate('/admin/orders')} variant="outline">
          Quay lại
        </Button>
      </div>
    </div>
  )
}
