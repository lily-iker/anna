'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AdminNavbarProps {
  onMenuClick: () => void
}

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    navigate('/')
    await logout()
  }
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      {/* Menu button - only visible on mobile */}
      <button
        onClick={onMenuClick}
        className="p-1 rounded-md hover:bg-gray-100 md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-4 ml-auto">
        <button className="p-1 rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <button
          onClick={handleLogout}
          className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition"
          title="Logout"
        >
          <span>U</span>
        </button>
      </div>
    </header>
  )
}

export default AdminNavbar
