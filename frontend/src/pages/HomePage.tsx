import Hero from "@/components/home/hero"
import CategoryCarousel from "@/components/home/category-carousel"
import ProductCarousel from "@/components/home/product-carousel"
import BlogCarousel from "@/components/home/blog-carousel"
import { useEffect } from "react"
import useProductStore from "@/stores/useProductStore"
import ProductList from "@/components/home/product-list"
import BannerCarousel from "@/components/home/banner-carousel"
import LearnMore from "@/components/home/learn-more"
import { SectionDivider } from "@/components/ui/section-devider"
import Feature from "@/components/home/feature"

export default function HomePage() {

  const {
    newProducts,
    random12Products,
    categories,
    blogs,
    topBanners,
    aboutUsBanners,

    fetchNewProducts,
    fetchRandom12Products,
    fetchCategories,
    fetchBlogs,
    fetchTopBanners,
    fetchAboutUsBanners,
  } = useProductStore()

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
      <Hero items={topBanners}/>

      <div className="container mx-auto space-y-16 px-4 sm:px-4 md:px-8 lg:px-16 py-8">

        <ProductCarousel title="Hàng Mới Về" products={newProducts} />
        <SectionDivider />

        {/* <div id="categories"> */}
        <CategoryCarousel items={categories} />
        {/* </div> */}
        <SectionDivider />

        <ProductList title="Sản phẩm" products={random12Products} />
        <SectionDivider />

        <BannerCarousel items={aboutUsBanners}/>
        <SectionDivider />

        <Feature/>
        <SectionDivider />

        <BlogCarousel items={blogs} />
        <SectionDivider />

        <LearnMore/>
      </div>
    </>
  )
}

