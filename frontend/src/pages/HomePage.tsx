'use client'

import { lazy, useEffect, Suspense } from 'react'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import useBlogStore from '@/stores/useBlogStore'
import useBannerStore from '@/stores/useBannerStore'
import { SectionDivider } from '@/components/ui/section-devider'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load components that aren't immediately visible
const HeroCarousel = lazy(() => import('@/components/home/hero'))
const ProductCarousel = lazy(() => import('@/components/home/product-carousel'))
const CategoryList = lazy(() => import('@/components/home/category-list'))
const ProductList = lazy(() => import('@/components/home/product-list'))
const BannerCarousel = lazy(() => import('@/components/home/banner-carousel'))
const Feature = lazy(() => import('@/components/home/feature'))
const BlogCarousel = lazy(() => import('@/components/home/blog-carousel'))
const LearnMore = lazy(() => import('@/components/home/learn-more'))

// Skeleton loaders for each component type
const HeroSkeleton = () => <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg" />

const CarouselSkeleton = () => (
  <div className="space-y-4 w-full">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
    </div>
  </div>
)

const CategorySkeleton = () => (
  <div className="space-y-4 w-full">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
    </div>
  </div>
)

const FeatureSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>
      ))}
  </div>
)

const BannerSkeleton = () => <Skeleton className="h-64 md:h-111 w-full rounded-2xl" />

const LearnMoreSkeleton = () => <Skeleton className="h-[400px] w-full rounded-2xl" />

export default function HomePage() {
  const { newProducts, random12Products, fetchNewProducts, fetchRandom12Products } =
    useProductStore()

  const { categories, fetchCategories } = useCategoryStore()

  const { blogs, fetchBlogs } = useBlogStore()

  const { topBanners, aboutUsBanners, fetchTopBanners, fetchAboutUsBanners } = useBannerStore()

  useEffect(() => {
    fetchNewProducts()
    fetchRandom12Products()
    fetchCategories()
    fetchBlogs()
    fetchTopBanners()
    fetchAboutUsBanners()
  }, [
    fetchNewProducts,
    fetchRandom12Products,
    fetchCategories,
    fetchBlogs,
    fetchTopBanners,
    fetchAboutUsBanners,
  ])

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <div className="animate-fade-in">
          <HeroCarousel items={topBanners} />
        </div>
      </Suspense>

      <div className="container mx-auto space-y-8 md:space-y-12 px-4 sm:px-4 md:px-8 lg:px-16 py-8">
        <Suspense fallback={<CarouselSkeleton />}>
          <div className="animate-fade-in">
            <ProductCarousel title="Hàng Mới Về" products={newProducts} />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<CategorySkeleton />}>
          <div className="animate-fade-in">
            <CategoryList items={categories} />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<CarouselSkeleton />}>
          <div className="animate-fade-in">
            <ProductList title="Sản phẩm" products={random12Products} />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<BannerSkeleton />}>
          <div className="animate-fade-in">
            <BannerCarousel items={aboutUsBanners} />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<FeatureSkeleton />}>
          <div className="animate-fade-in">
            <Feature />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<CarouselSkeleton />}>
          <div className="animate-fade-in">
            <BlogCarousel items={blogs} />
          </div>
        </Suspense>
        <SectionDivider />

        <Suspense fallback={<LearnMoreSkeleton />}>
          <div className="animate-fade-in">
            <LearnMore />
          </div>
        </Suspense>
      </div>
    </>
  )
}
