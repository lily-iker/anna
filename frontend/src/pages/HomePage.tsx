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
    banners, 
    blogs, 
    fetchNewProducts, 
    fetchRandom12Products, 
    fetchCategories, 
    fetchBanners, 
    fetchBlogs 
  } = useProductStore()
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchNewProducts()
    fetchRandom12Products()
    fetchCategories()
    fetchBanners()
    fetchBlogs()
  }, [fetchNewProducts, fetchRandom12Products, fetchCategories, fetchBanners, fetchBlogs])

  return (
    <>
      <Hero items={banners}/>

      <div className="container mx-auto space-y-16 px-4 sm:px-4 md:px-8 lg:px-16 py-8">

        <ProductCarousel title="Hàng Mới Về" products={newProducts} />
        <SectionDivider />

        {/* <div id="categories"> */}
        <CategoryCarousel items={categories} />
        {/* </div> */}
        <SectionDivider />

        <ProductList title="Sản phẩm" products={random12Products} />
        <SectionDivider />

        <BannerCarousel items={banners}/>
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

