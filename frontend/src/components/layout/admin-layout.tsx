'use client'

import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from './admin-navbar'
import AdminSidebar from './admin-sidebar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when screen size changes to avoid sidebar staying open when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={handleOverlayClick} />
        )}

        {/* Sidebar - visible on md+ screens or when toggled on smaller screens */}
        <div
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 fixed md:static inset-y-0 left-0 z-30
            w-64 bg-white border-r min-h-screen transition-transform duration-300 ease-in-out
          `}
        >
          <AdminSidebar />
        </div>

        {/* Main content - takes full width on small screens, adjusted width on md+ */}
        <div className="flex-1 overflow-auto md:pl-0 w-full">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
