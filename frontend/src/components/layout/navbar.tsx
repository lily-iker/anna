import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, Home, BookOpen, Phone, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { BsFacebook } from 'react-icons/bs'
import { SiZalo } from 'react-icons/si'

export default function MainNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      {/* Sticky container for both bars */}
      <div className="fixed top-0 left-0 w-full z-40">
        {/* Top bar with search */}
        <div className="bg-[#0B4619] text-white py-1">
          <div className="container mx-auto px-2 lg:px-16 flex items-center justify-between">
            {/* Social icons */}
            <div className="flex items-center space-x-2">
              <a
                href="https://www.facebook.com/hoaquaanna"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full"
              >
                <BsFacebook className="rounded-full size-6 bg-white text-blue-500" />
              </a>
              <a
                href="https://zalo.me/g/nfvrnz306?fbclid=IwY2xjawJsriFleHRuA2FlbQIxMAABHkzonaBJU8C_MqD5q1to6ZdOAfjgt3wHyPEuEkHkfh24QO056bd8ARJu28TG_aem_MravPWLG6oUH2zbT97jnNA"
                className="flex items-center justify-center bg-white rounded-full size-6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiZalo className="size-5 text-blue-500" />
              </a>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-sm ml-24 bg-white rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full py-1 px-3 pr-10 rounded-lg text-black text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="hidden md:block text-sm">
              <span>8:00 - 21:00</span>
              <span className="ml-4">097 828 6789</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <header
          className={`fixed top-11 left-0 w-full z-50 transition-all duration-300 ${
            location.pathname === '/' && scrolled
              ? 'shadow-md bg-[#DEF5E3]' // On the homepage, apply this styles only when scrolled
              : location.pathname !== '/'
              ? 'shadow-md bg-[#DEF5E3]'
              : '' // On all other pages, apply this styles by default
          }`}
        >
          <div className="container mx-auto px-2 lg:px-16">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <img
                    src="https://res.cloudinary.com/dschfkj54/image/upload/v1742753030/485713948_632125426372122_1685471156183650104_n_idq8lr.png"
                    alt="Anna Logo"
                    className="h-10 w-auto"
                  />
                </Link>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-12 lg:mr-32">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-green-600 font-medium flex items-center"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Danh mục
                </Link>
                <Link
                  to="/blogs"
                  className="text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Blog
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Liên hệ
                </Link>
              </nav>

              {/* Desktop Cart */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  className="hover:cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    navigate('/cart')
                  }}
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                </Button>
              </div>

              {/* Mobile Toggle */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div className="h-[calc(1.75rem)]"></div>

      {/* Overlay - No blur or styling */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[45%] md:w-[35%] bg-white shadow-lg rounded-l-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-5 h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-green-700">Menu</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-6 w-6 text-gray-600" />
            </Button>
          </div>

          <form onSubmit={handleSearch} className="relative mb-10">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full py-1.5 px-3 pr-10 rounded-md border border-gray-300 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-4 gap-2">
            <Link
              to="/"
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setSidebarOpen(false)
              }}
            >
              <Home className="h-5 w-5" /> Trang chủ
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setSidebarOpen(false)
              }}
            >
              <LayoutGrid className="h-5 w-5" /> Danh mục
            </Link>
            <Link
              to="/blogs"
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setSidebarOpen(false)
              }}
            >
              <BookOpen className="h-5 w-5" /> Blog
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setSidebarOpen(false)
              }}
            >
              <Phone className="h-5 w-5" /> Liên hệ
            </Link>
            <Button
              variant="ghost"
              className="mt-4 flex items-center gap-2 bg-[#DEF5E3] text-gray-700 hover:text-green-600 font-medium px-0"
              onClick={() => {
                navigate('/cart')
                setSidebarOpen(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Giỏ hàng
            </Button>
            {/* Contact info */}
            <div className="mt-6">
              <div className="text-lg font-semibold text-gray-700">Thời gian mở cửa</div>
              <div className="text-sm text-gray-600">8:00 - 21:00</div>

              <div className="mt-4 text-lg font-semibold text-gray-700">Liên hệ</div>
              <div className="text-sm text-gray-600">097 828 6789</div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
