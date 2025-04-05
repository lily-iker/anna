'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export default function OrdersPage() {
  const navigate = useNavigate()
  const { orders, activeTab, isLoading, error, fetchOrders, setActiveTab } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((order) => order.status === activeTab)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <Button variant="destructive">Xóa đơn hàng</Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-4 w-[400px]">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="new">Mới</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao hàng</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Giá đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Chỉnh sửa đơn hàng
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Không tìm thấy đơn hàng nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <nav className="flex items-center space-x-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                2
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                3
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                4
              </Button>
              <span className="px-2">...</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                99
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                100
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </nav>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
