import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loading from './components/loading'
import MainLayout from './components/layout/main-layout'
import { useAuthStore } from './stores/useAuthStore'
import LoginPage from './pages/LoginPage'
import AdminLayout from './components/layout/admin-layout'
import ProductsPage from './pages/admin/ProductsPage'
import NotFoundPage from './pages/error/NotFoundPage'
import EditProductPage from './pages/admin/EditProductPage'
import BlogsPage from './pages/admin/BlogsPage'
import OrdersPage from './pages/admin/OrdersPage'
import AddProductPage from './pages/admin/AddProductPage'
import CustomersPage from './pages/admin/CustomersPage'
import BannerPage from './pages/admin/BannerPage'
import FeedbackPage from './pages/admin/FeedbackPage'
import CategoryPage from './pages/admin/CategoryPage'
import SearchProductPage from './pages/SearchProductPage'

function App() {
  const { authUser, fetchAuthUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuthUser()
  }, [fetchAuthUser])

  useEffect(() => {
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
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/search" element={<SearchProductPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Admin Layout Routes */}
        <Route
          path="/admin"
          element={
            authUser && authUser?.role === 'ADMIN' ? <AdminLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="banners" element={<BannerPage />} />
          <Route path="feedbacks" element={<FeedbackPage />} />
          <Route path="category-images" element={<CategoryPage />} />

          {/* <Route path="orders" element={<OrdersPage />} /> */}
        </Route>
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  )
}

export default App
