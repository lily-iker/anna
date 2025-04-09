import type React from 'react'
import { Truck, Phone, Tag } from 'lucide-react'
import { memo } from 'react'

// Create a memoized feature item component
const FeatureItem = memo(
  ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType
    title: string
    description: string
  }) => (
    <div className="flex flex-col items-center">
      <Icon className="h-10 w-10 text-emerald-500 mb-2" />
      <h4 className="text-base font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 max-w-xs">{description}</p>
    </div>
  )
)

const Feature = () => {
  const features = [
    {
      icon: Truck,
      title: 'Miễn phí vận chuyển',
      description: 'Cam kết giao hàng nhanh chóng và chất lượng đến tay khách hàng',
    },
    {
      icon: Phone,
      title: 'Đội ngũ thân thiện',
      description: 'Đội ngũ thân thiện, dịch vụ tận tâm!',
    },
    {
      icon: Tag,
      title: 'Ưu đãi đặc biệt',
      description: 'Ưu đãi hấp dẫn, mua sắm dễ dàng!',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

// Export the memoized version
export default memo(Feature)
