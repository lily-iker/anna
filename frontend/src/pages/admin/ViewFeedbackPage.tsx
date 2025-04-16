'use client'

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useFeedbackStore from '@/stores/useFeedbackStore'
import { formatDate } from '@/lib/format'

export default function ViewFeedbackPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { feedbacks, fetchFeedbacks, deleteFeedbacks, isLoading } = useFeedbackStore()

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  const feedback = feedbacks.find((f) => f.id === Number(id))

  const handleDelete = async () => {
    if (id && window.confirm('Bạn có chắc chắn muốn xóa góp ý này?')) {
      await deleteFeedbacks([Number(id)])
      navigate('/admin/feedbacks')
    }
  }

  if (!feedback) {
    return (
      <div className="text-center py-8 text-gray-700">
        <p className="mb-4">Không tìm thấy góp ý</p>
        <Button onClick={() => navigate('/admin/feedbacks')}>Quay lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-gray-700">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Góp ý cho sản phẩm</h1>
        <div className="flex space-x-2">
          <Button variant="destructive" onClick={handleDelete}>
            Xóa góp ý
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/feedbacks')}>
            Quay lại
          </Button>
        </div>
      </div>

      {/* Card 1: Product & Customer Info */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <h3>Tên sản phẩm</h3>
              <p>{feedback.productName}</p>
            </div>

            <div className="space-y-1">
              <h3>Tên khách hàng</h3>
              <p>{feedback.customerName}</p>
            </div>

            <div className="space-y-1">
              <h3>Ngày gửi góp ý</h3>
              <p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {formatDate(feedback.createdAt)}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <h3>Số điện thoại</h3>
              <p>{feedback.customerPhoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Feedback Content */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-2">Nội dung</h3>
          <div className="p-4 bg-white rounded-md border text-sm leading-relaxed whitespace-pre-wrap">
            {feedback.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
