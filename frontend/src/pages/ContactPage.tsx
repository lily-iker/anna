'use client'

import { MapPin, Phone, Clock, Facebook, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Map from '@/components/contact/map'

export default function ContactPage() {
  const storeAddress = '121 Phan Đình Giót - La Khê - Hà Đông'

  return (
    <div className="container mx-auto px-4 pb-8 pt-24 max-w-5xl">
      <h1 className="text-center text-2xl font-semibold text-green-500 mb-6">LIÊN HỆ</h1>

      {/* Map component */}
      <div className="mb-8">
        <Map address={storeAddress} />
      </div>

      <h2 className="text-center text-xl font-semibold text-green-500 mb-6">THÔNG TIN LIÊN HỆ</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="space-y-4">
          <p className="text-gray-700">
            Cửa hàng trái cây Anna chuyên cung cấp các loại hoa quả tươi ngon, bao gồm cả trái cây
            trong nước và nhập khẩu. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất
            lượng tốt nhất với giá cả cạnh tranh. Hãy đến với Anna để trải nghiệm sự tươi mới và an
            toàn từ mỗi trái cây!
          </p>

          {/* <Card>
            <CardContent className="pt-6"> */}
          <div>
            <div className="space-y-4 flex flex-col items-start">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Địa chỉ:</p>
                  <p className="text-gray-600">{storeAddress}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Facebook className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Facebook:</p>
                  <p className="text-gray-600">Tổng kho trái cây nhập khẩu Anna</p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Zalo:</p>
                  <p className="text-gray-600">zalo.me/g/nfvmz306</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Hotline:</p>
                  <p className="text-gray-600">038 623 6288</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Thời gian làm việc:</p>
                  <p className="text-gray-600">Thứ hai đến chủ nhật từ 8:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>
          {/* </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
