'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiBell, FiFileText } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function PYQPage() {
  const [taxonomy, setTaxonomy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTaxonomy() {
      try {
        const response = await pdfAPI.getTaxonomy('pyq')
        if (response.success) {
          setTaxonomy(response.data)
        }
      } catch (error) {
        console.error('Error loading taxonomy:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTaxonomy()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">Loading PYQs...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const hasContent = taxonomy && Object.keys(taxonomy).length > 0

  if (!hasContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 mb-6 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No PYQ Content Yet</h3>
            <p className="text-gray-600 text-lg">Check back soon for previous year question papers!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 mb-8 font-semibold transition-all hover:translate-x-1"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-lg">Back to Home</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <FiFileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Previous Year Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access question papers organized by year and subject
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Years Grid */}
        {Object.entries(taxonomy).map(([yearKey, yearData]: any, yearIndex) => (
          <div key={yearKey} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full mr-3"></span>
              {yearKey.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearData.subjects && yearData.subjects.map((subject: string, index: number) => {
                const gradients = [
                  'from-teal-500 via-cyan-500 to-blue-500',
                  'from-emerald-500 via-green-500 to-teal-500',
                  'from-cyan-500 via-blue-500 to-indigo-500',
                  'from-green-500 via-teal-500 to-cyan-500',
                  'from-blue-500 via-cyan-500 to-teal-500',
                  'from-indigo-500 via-blue-500 to-cyan-500',
                ]
                const gradient = gradients[index % gradients.length]
                
                return (
                  <Link
                    key={subject}
                    href={`/pyq/${yearKey}/${subject.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                  >
                    {/* Colorful Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                    
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                    
                    {/* Content */}
                    <div className="relative p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                          <span className="text-5xl">📋</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                            {subject}
                          </h3>
                          <p className="text-white/80 text-sm mt-1">View question papers</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
                        <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Explore Papers</span>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                          <span className="text-white text-xl transform group-hover:translate-x-1 transition-all">→</span>
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Community CTA */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          <div className="relative p-10 text-center">
            <FiBell className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-3">Join Our Community</h3>
            <p className="text-cyan-100 text-lg mb-6 max-w-2xl mx-auto">
              Connect with fellow students, share resources, and stay updated with the latest materials
            </p>
            <Link
              href="/community"
              className="inline-flex items-center space-x-2 bg-white text-teal-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-lg"
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
