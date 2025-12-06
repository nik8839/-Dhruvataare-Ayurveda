'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiBell, FiBook } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function SyllabusPage() {
  const [years, setYears] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadYears() {
      try {
        const response = await pdfAPI.getTaxonomy('syllabus')
        console.log('🔍 Syllabus API Response:', response)
        if (response.success && response.data) {
          // If the response is an object with keys like "1st-year", extract them
          // If it's the old format (just subjects), we might need to handle that, 
          // but we are moving to hierarchy.
          // Assuming getTaxonomy returns { "1st-year": {...}, "2nd-year": {...} }
          // Debug logs
          console.log('🔍 Syllabus API Response Data:', response.data)
          const yearKeys = Object.keys(response.data).filter(key => key !== 'subjects')
          console.log('✅ Extracted Year Keys:', yearKeys)
          setYears(yearKeys.sort())
        }
      } catch (error) {
        console.error('❌ Error loading syllabus years:', error)
      } finally {
        setLoading(false)
      }
    }
    loadYears()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">Loading syllabus...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (years.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Syllabus Content Yet</h3>
            <p className="text-gray-600 text-lg">Check back soon for updated syllabus materials!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 font-semibold transition-all hover:translate-x-1"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-lg">Back to Home</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FiBook className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Syllabus
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your academic year to view the syllabus
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Years Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {years.map((year, index) => {
            const gradients = [
              'from-blue-500 via-cyan-500 to-teal-500',
              'from-purple-500 via-pink-500 to-rose-500',
              'from-orange-500 via-red-500 to-pink-500',
            ]
            const gradient = gradients[index % gradients.length]
            
            return (
              <Link
                key={year}
                href={`/syllabus/${year}`}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Colorful Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                
                {/* Animated Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                
                {/* Content */}
                <div className="relative p-8 text-center h-64 flex flex-col justify-center items-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <span className="text-5xl font-bold text-white">{year.charAt(0)}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg capitalize">
                    {year.replace('-', ' ')}
                  </h3>
                  <p className="text-white/80 text-lg mt-2">View Subjects</p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Community CTA */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          <div className="relative p-10 text-center">
            <FiBell className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-3">Join Our Community</h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Connect with fellow students, share resources, and stay updated with the latest materials
            </p>
            <Link
              href="/community"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Join Now</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
