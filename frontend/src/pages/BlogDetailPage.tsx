'use client'

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useBlogStore from '@/stores/useBlogStore'
import NotFoundPage from './error/NotFoundPage'
import ResponsiveImage from '@/components/home/responsive-image'

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { currentBlog, isLoading, fetchBlogById } = useBlogStore()

  useEffect(() => {
    if (id) {
      fetchBlogById(id)
    }
  }, [fetchBlogById, id])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (!currentBlog) {
    return <NotFoundPage />
  }

  return (
    <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 py-8 pt-24">
      <article>
        <h1 className="text-3xl font-bold text-[#333] mb-4">{currentBlog.title}</h1>

        <p className="text-gray-700 mb-6">{currentBlog.sapo}</p>

        <div className="rounded-2xl overflow-hidden">
          <ResponsiveImage
            src={currentBlog.thumbnailImage || '/placeholder.svg'}
            alt={currentBlog.title}
            aspectRatio="30/9"
            objectFit="cover"
            className="w-full"
          />
        </div>

        <div className="prose prose-lg max-w-none text-gray-500 mt-8">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
        </div>

        <div className="mt-8 font-bold">Theo {currentBlog.author}</div>
      </article>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        {currentBlog.previousBlogId ? (
          <Link
            to={`/blog/${currentBlog.previousBlogId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="mr-2">←</span> Quay lại
          </Link>
        ) : (
          <div></div>
        )}

        {currentBlog.nextBlogId ? (
          <Link
            to={`/blog/${currentBlog.nextBlogId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            Bài tiếp <span className="ml-2">→</span>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
