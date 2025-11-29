'use client'

import Link from 'next/link'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiEdit2 } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { authAPI } from '@/lib/api'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await authAPI.getMe()
      if (response.success) {
        setUser(response.user)
      }
    } catch (error) {
      console.error('Error loading user:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <FiEdit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 relative">
              {user.photo ? (
                <img 
                  src={user.photo} 
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-16 h-16" />
              )}
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Change Photo
            </button>
          </div>

          {/* Name */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-600">Name</label>
            </div>
            <p className="text-xl font-semibold text-gray-800">{user.name || 'Not set'}</p>
          </div>

          {/* Phone Number */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <FiPhone className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
            </div>
            <p className="text-xl font-semibold text-gray-800">{user.phone || 'Not set'}</p>
          </div>

          {/* College Name */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <FiMail className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-600">College Name</label>
            </div>
            <p className="text-xl font-semibold text-gray-800">{user.collegeName || 'Not set'}</p>
          </div>

          {/* Email (if available) */}
          {user.email && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-2">
                <FiMail className="w-5 h-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-600">Email</label>
              </div>
              <p className="text-xl font-semibold text-gray-800">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
