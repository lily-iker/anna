import { Lock, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {/* Biểu tượng hoạt hình */}
        <div className="flex justify-center animate-pulse">
          <Lock className="h-24 w-24 text-red-500" />
        </div>

        {/* Thông báo lỗi */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold text-red-400">401</h1>
          <h2 className="text-2xl font-semibold text-red-400">Không có quyền truy cập</h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Bạn không có quyền truy cập trang này. Hãy quay lại mua sắm nhé!
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            onClick={() => navigate(-1)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-colors duration-200 px-6 py-2 w-full sm:w-auto"
          >
            Quay lại
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white text-neutral-800 border border-neutral-700 hover:bg-neutral-100 transition-colors duration-200 shadow-md px-6 py-2 w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
