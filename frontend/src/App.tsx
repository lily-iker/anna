import { useEffect, useState, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loading from './components/loading'
import MainLayout from './components/layout/main-layout'
import { useAuthStore } from './stores/useAuthStore'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import EditOrderPage from './pages/admin/EditOrderPage'
import AddBlogPage from './pages/admin/AddBlogPage'
import EditBlogPage from './pages/admin/EditBlogPage'
import CategoryImagePage from './pages/admin/CategoryImagePage'
import EditBannerPage from './pages/admin/EditBannerPage'
import ViewFeedbackPage from './pages/admin/ViewFeedbackPage'
import ProductDetailPage from './pages/ProductDetailPage'

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

function App() {
  const { authUser, fetchAuthUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAuthUser()
  }, [fetchAuthUser])

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
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />

        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/edit/:id" element={<EditOrderPage />} />

        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/add" element={<AddBlogPage />} />
        <Route path="blogs/edit/:id" element={<EditBlogPage />} />

        <Route path="customers" element={<CustomersPage />} />

        <Route path="banners" element={<BannerPage />} />
        <Route path="banners/edit/:id" element={<EditBannerPage />} />

        <Route path="feedbacks" element={<FeedbackPage />} />
        <Route path="feedbacks/view/:id" element={<ViewFeedbackPage />} />

        <Route path="category-images" element={<CategoryImagePage />} />
      </Route>
    </Routes>
  )
}

export default App
