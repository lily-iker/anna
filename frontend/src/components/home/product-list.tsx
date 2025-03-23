"use client"

import { Link } from "react-router-dom"
import ProductCard from "@/components/product-card"
import { Product } from "@/types"

interface ProductListProps {
  title: string
  products: Product[]
}

export default function ProductList({ title, products }: ProductListProps) {
  return (
    <div className="space-y-6">
      <div className="flex relative justify-between items-center">
        <div className="relative w-fit">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-gradient-to-r from-gray-500 via-gray-300 to-transparent"></div>
        </div>
        <Link to="/xem-them" className="text-sm font-bold text-gray-600 hover:underline absolute top-4 right-4 flex space-x-2 z-10">
          Xem thêm
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
