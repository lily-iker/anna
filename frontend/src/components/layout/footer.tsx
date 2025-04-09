'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FeedbackForm } from '../home/feedback-form'

export default function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const openFeedbackForm = () => {
    setIsFeedbackOpen(true)
  }

  const closeFeedbackForm = () => {
    setIsFeedbackOpen(false)
  }

  return (
    <footer className="bg-green-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 mb-8 gap-4 md:gap-8 lg:gap-16 lg:px-16">
          {/* Subscription Section */}
          <div>
            <h3 className="font-semibold mb-2">Giữ liên lạc với chúng tôi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Nếu bạn có bất kỳ ý kiến nào để giúp chúng tôi cải thiện, hãy nhấn vào nút 'Góp ý' bên
              dưới – mọi phản hồi của bạn đều rất quý giá! !
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 hover:cursor-pointer hover:bg-[#9DE25C]"
              onClick={openFeedbackForm}
            >
              Góp ý
            </Button>
          </div>

          {/* Customer Support Section */}
          <div>
            <h3 className="font-semibold mb-2">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="#" className="hover:text-green-600">
                  Hướng dẫn đặt hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-green-600">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-green-600">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-2">Về Anna shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="#" className="hover:text-green-600">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-green-600">
                  Cam kết chất lượng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-green-600">
                  Blog & tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold mb-2">Kết nối với chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Địa chỉ: 121 Phan Đình Giốt - La Khê - Hà Đông</li>
              <li>Hotline: 038 623 6288</li>
              <li className="flex items-center space-x-2">
                <span>Facebook</span>
              </li>
              <li>
                <Link to="#" className="hover:text-green-600">
                  Zalo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Anna Fruit. All rights reserved.
          </div>
        </div>
      </div>

      {/* Feedback Form Dialog */}
      <FeedbackForm isOpen={isFeedbackOpen} onClose={closeFeedbackForm} />
    </footer>
  )
}
