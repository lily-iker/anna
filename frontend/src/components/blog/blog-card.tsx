import type { Blog } from '@/types'
import { Link } from 'react-router-dom'

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link to={`/blog/${blog.id}`} className="block h-full group mb-6 border rounded-2xl">
      <div className="h-full flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-64 h-40 overflow-hidden rounded-xl flex-shrink-0">
            <img
              src={blog.thumbnailImage || '/placeholder.svg'}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <h3 className="text-xl font-bold text-green-600 mb-2">{blog.title}</h3>
            <p className="text-gray-700 text-base leading-relaxed mb-4">{blog.sapo}</p>
            <p className="text-sm text-gray-500">Tác giả: {blog.author}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
