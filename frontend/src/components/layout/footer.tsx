import { Link } from "react-router-dom"
import { MessageCircle, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-green-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 mb-8 gap-4 md:gap-8 lg:gap-16 lg:px-16">
          {/* Subscription Section */}
          <div>
            <h3 className="font-semibold mb-2">Giữ liên lạc với chúng tôi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Nhấn "Nhận" để được biết thêm những thông tin mới nhất về sản phẩm, chương trình giảm giá của chúng tôi!
            </p>
            <Button variant="outline" className="rounded-full px-6">
              Nhận
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
              <li>Địa chỉ: 121 Phan, Đình Giốt - La Khê - Hà Đông</li>
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
          {/* <div className="flex justify-center space-x-12 text-center">
            <div className="flex flex-col items-center">
              <MessageCircle className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs text-gray-600">Miễn phí vận chuyển</span>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs text-gray-600">Đội ngũ hỗ trợ nhiệt tình</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs text-gray-600">Ưu đãi đặc biệt</span>
            </div>
          </div> */}

          <div className="text-center mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Anna Fruit Import. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

