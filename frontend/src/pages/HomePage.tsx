import Navbar from "@/components/layout/navbar"
import Hero from "@/components/home/hero"
import CategoryCarousel from "@/components/home/category-carousel"
import ProductCarousel from "@/components/home/product-carousel"
import BlogCarousel from "@/components/home/blog-carousel"
import Footer from "@/components/layout/footer"
import { useEffect } from "react"
import useProductStore from "@/stores/useProductStore"
import ProductList from "@/components/home/product-list"
import BannerCarousel from "@/components/home/banner-carousel"
import LearnMore from "@/components/home/learn-more"

export default function HomePage() {

  const { 
    newProducts, 
    categories, 
    banners, 
    blogs, 
    fetchNewProducts, 
    fetchCategories, 
    fetchBanners, 
    fetchBlogs 
  } = useProductStore()
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchNewProducts()
    fetchCategories()
    fetchBanners()
    fetchBlogs()
  }, [fetchNewProducts, fetchCategories, fetchBanners, fetchBlogs])

  console.log(newProducts)
  console.log(categories)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <div className="container mx-auto space-y-16 px-4 sm:px-4 md:px-8 lg:px-16 py-8">

        <ProductCarousel title="Hàng Mới Về" products={newProducts} />

        {/* <div id="categories"> */}
        <CategoryCarousel items={categories} />
        {/* </div> */}

        <ProductList title="Sản phẩm mới" products={newProducts} />

        <BannerCarousel items={banners}/>

        <BlogCarousel items={blogs} />

        <LearnMore/>
      </div>

      <Footer />
    </main>
  )
}

