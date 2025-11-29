'use client'

import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PYQDialog from './PYQDialog'
import NotesDialog from './NotesDialog'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showPYQ, setShowPYQ] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsMenuOpen(false)
    router.push('/')
  }

  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false)
    if (href !== '#') {
      if (href === '/pyq') {
        setShowPYQ(true)
      } else if (href === '/notes') {
        setShowNotes(true)
      } else {
        router.push(href)
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 glass shadow-medical z-50 border-b border-blue-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-14 h-14 medical-gradient-blue rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-medical transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
            <span className="relative">
              ET
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
              EduTech
            </h1>
            <p className="text-xs text-gray-500 font-medium">Medical Education Platform</p>
          </div>
        </div>
        
        <button
          onClick={toggleMenu}
          className="p-3 rounded-xl medical-gradient-blue text-white shadow-medical hover:shadow-medical-lg transform hover:scale-110 transition-all duration-300 relative overflow-hidden group"
          aria-label="Toggle menu"
        >
          <span className="relative z-10">
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </span>
          <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </button>

        {/* Dialog Box Menu */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 animate-fadeIn"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="fixed top-20 right-4 glass rounded-2xl shadow-medical-lg z-50 min-w-[300px] max-w-[340px] border border-blue-100 overflow-hidden animate-slideIn">
              <div className="medical-gradient-blue p-4">
                <h3 className="text-white font-semibold text-lg">Menu</h3>
              </div>
              <nav className="flex flex-col py-2">
                <button
                  onClick={() => handleMenuClick('/profile')}
                  className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>Profile</span>
                  </span>
                </button>
                <button
                  onClick={() => handleMenuClick('/achievers')}
                  className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>Achievers Series</span>
                  </span>
                </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setShowPYQ(true)
                }}
                className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>PYQs</span>
                </span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setShowNotes(true)
                }}
                className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Notes</span>
                </span>
              </button>
                <button
                  onClick={() => handleMenuClick('/contact')}
                  className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>Contact Us</span>
                  </span>
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleMenuClick('/admin')}
                    className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 border-b border-gray-100 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>Admin Dashboard</span>
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (user) {
                      handleLogout()
                    } else {
                      handleMenuClick('/login')
                    }
                  }}
                  className="px-6 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{user ? 'Log Out' : 'Login'}</span>
                  </span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      {showPYQ && (
        <PYQDialog onClose={() => setShowPYQ(false)} />
      )}
      {showNotes && (
        <NotesDialog onClose={() => setShowNotes(false)} />
      )}
    </header>
  )
}
