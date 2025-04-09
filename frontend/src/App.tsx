import { useEffect, useState, lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Loading from './components/loading'
import MainLayout from './components/layout/main-layout'
import { useAuthStore } from './stores/useAuthStore'
import useProductStore from './stores/useProductStore'
import useCategoryStore from './stores/useCategoryStore'
import useBlogStore from './stores/useBlogStore'
import useBannerStore from './stores/useBannerStore'
import { RouteTransitionProvider } from './router/route-transition'
import ContactPage from './pages/ContactPage'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SearchProductPage = lazy(() => import('./pages/SearchProductPage'))
const NotFoundPage = lazy(() => import('./pages/error/NotFoundPage'))
const AdminLayout = lazy(() => import('./components/layout/admin-layout'))
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'))
const EditProductPage = lazy(() => import('./pages/admin/EditProductPage'))
const BlogsPage = lazy(() => import('./pages/admin/BlogsPage'))
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'))
const AddProductPage = lazy(() => import('./pages/admin/AddProductPage'))
const CustomersPage = lazy(() => import('./pages/admin/CustomersPage'))
const BannerPage = lazy(() => import('./pages/admin/BannerPage'))
const FeedbackPage = lazy(() => import('./pages/admin/FeedbackPage'))
const CategoryPage = lazy(() => import('./pages/admin/CategoryPage'))

function App() {
  const { authUser, fetchAuthUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAuthUser()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // 0.5 seconds delay

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/search" element={<SearchProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="banners" element={<BannerPage />} />
        <Route path="feedbacks" element={<FeedbackPage />} />
        <Route path="category-images" element={<CategoryPage />} />
      </Route>
    </Routes>
  )
}

export default App
