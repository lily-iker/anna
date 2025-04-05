import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryListProps {
  items: Category[]
}

const CategoryList: React.FC<CategoryListProps> = ({ items }) => {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to the search page with the selected category and trigger search
    const params = new URLSearchParams()
    params.set('category', categoryId)
    params.set('page', '1') // Optional: You can reset to the first page on category change
    navigate(`/search?${params.toString()}`)
    window.scrollTo(0, 0)
  }

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
          <div
            key={item.id}
            className="block transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => handleCategoryClick(item.name)} // Pass category name instead of id
          >
            <Card className="border-0 shadow-none overflow-hidden hover:cursor-pointer">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] w-full bg-emerald-700 rounded-lg overflow-hidden">
                  <img
                    src={item.thumbnailImage || '/placeholder.svg?height=300&width=400'}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white text-lg font-medium p-4">{item.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  )
}

export default CategoryList
