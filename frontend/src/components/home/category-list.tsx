'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryListProps {
  items: Category[]
}

// Create a memoized category item component
const CategoryItem = memo(({ item, onClick }: { item: Category; onClick: () => void }) => (
  <div className="block transition-transform duration-300 hover:scale-[1.02]" onClick={onClick}>
    <Card className="border-0 shadow-none overflow-hidden hover:cursor-pointer">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
          <img
            src={item.thumbnailImage || '/placeholder.svg?height=300&width=400'}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy" // Add lazy loading
            decoding="async" // Add async decoding
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <h3 className="text-white text-lg font-medium p-4">{item.name}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
))

const CategoryList = ({ items }: CategoryListProps) => {
  const navigate = useNavigate()

  // Don't render if no items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      <div className="relative w-fit mb-6">
        <h2 className="text-2xl font-bold">DANH MỤC</h2>
        <div className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-gradient-to-r from-gray-500 via-gray-300 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <CategoryItem
            key={item.id}
            item={item}
            onClick={() => {
              const params = new URLSearchParams()
              params.set('category', item.name)
              params.set('page', '1')
              navigate(`/search?${params.toString()}`)
              window.scrollTo(0, 0)
            }}
          />
        ))}
      </div>
    </>
  )
}

// Export the memoized version
export default memo(CategoryList)
