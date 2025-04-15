import { Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      <div className="p-4 border-b flex items-center space-x-2">
        <Home className="size-6 text-gray-500" />
        <h1 className="text-lg font-semibold">Trang quản lý cửa hàng</h1>
      </div>
      <nav className="p-4 space-y-2">
        <Link
          to="/admin/products"
          className={`block p-2 rounded-md ${
            isActive('/admin/products') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Sản phẩm
        </Link>
        <Link
          to="/admin/blogs"
          className={`block p-2 rounded-md ${
            isActive('/admin/blogs') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Blog
        </Link>
        <Link
          to="/admin/orders"
          className={`block p-2 rounded-md ${
            isActive('/admin/orders') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Đơn hàng
        </Link>
        <Link
          to="/admin/customers"
          className={`block p-2 rounded-md ${
            isActive('/admin/customers') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Khách hàng
        </Link>
        <Link
          to="/admin/banners"
          className={`block p-2 rounded-md ${
            isActive('/admin/banners') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Banner
        </Link>
        <Link
          to="/admin/feedbacks"
          className={`block p-2 rounded-md ${
            isActive('/admin/feedbacks') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Góp ý
        </Link>
        <Link
          to="/admin/category-images"
          className={`block p-2 rounded-md ${
            isActive('/admin/category-images') ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          Ảnh danh mục
        </Link>
      </nav>
    </>
  )
}

export default AdminSidebar
