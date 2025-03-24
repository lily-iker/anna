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
import { Heart, MessageCircle, Phone } from "lucide-react"

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
    <>
      <Hero items={banners}/>

      <div className="container mx-auto space-y-16 px-4 sm:px-4 md:px-8 lg:px-16 py-8">

        <ProductCarousel title="Hàng Mới Về" products={newProducts} />
        <SectionDivider />

        {/* <div id="categories"> */}
        <CategoryCarousel items={categories} />
        {/* </div> */}
        <SectionDivider />

        <ProductList title="Sản phẩm" products={newProducts} />
        <SectionDivider />

        <BannerCarousel items={banners}/>
        <SectionDivider />

        <div className="flex justify-center space-x-16 text-center py-4">
  <div className="flex flex-col items-center">
    <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
    <span className="text-base text-gray-700 font-medium">Miễn phí vận chuyển</span>
  </div>
  <div className="flex flex-col items-center">
    <Phone className="h-8 w-8 text-green-600 mb-2" />
    <span className="text-base text-gray-700 font-medium">Đội ngũ hỗ trợ nhiệt tình</span>
  </div>
  <div className="flex flex-col items-center">
    <Heart className="h-8 w-8 text-green-600 mb-2" />
    <span className="text-base text-gray-700 font-medium">Ưu đãi đặc biệt</span>
  </div>
</div>
          
        <SectionDivider />

        <BlogCarousel items={blogs} />
        <SectionDivider />

        <LearnMore/>
      </div>
    </>
  )
}

