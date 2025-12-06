'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiBell, FiBook } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function SyllabusYearPage() {
  const params = useParams()
  const year = params.year as string
  const [subjects, setSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await pdfAPI.getTaxonomy('syllabus')
        console.log('🔍 Syllabus Year Page - API Response:', response)
        console.log('🔍 Current Year Param (Raw):', year, 'Type:', typeof year)

        if (response.success && response.data) {
          const availableKeys = Object.keys(response.data)
          console.log('🔍 Available Keys in Data:', availableKeys)

          // Robust matching strategy
          const normalize = (str: string) => str.toLowerCase().replace(/%20/g, '-').replace(/ /g, '-').trim()
          const targetYear = normalize(year)

          console.log('🎯 Target Year (Normalized):', targetYear)

          // Find matching key
          const matchingKey = Object.keys(response.data).find(key =>
            normalize(key) === targetYear
          )

          console.log('🗝️ Matched Key:', matchingKey)

          const yearData = matchingKey ? response.data[matchingKey] : null

          console.log('🔍 Year Data Found:', yearData)

          if (yearData && yearData.subjects) {
            console.log('✅ Setting subjects:', yearData.subjects)
            setSubjects(yearData.subjects)
          } else {
            console.log('⚠️ No subjects found for year:', year)
          }
        }
      } catch (error) {
        console.error('Error loading subjects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSubjects()
  }, [year])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/syllabus"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 font-semibold transition-all hover:translate-x-1"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-lg">Back to Years</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FiBook className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 capitalize">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {year.replace('-', ' ')} Syllabus
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a subject to view its syllabus
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 inline-block rounded-r-lg">
              <p className="text-yellow-700">No subjects found for this year.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {subjects.map((subject, index) => {
              const gradients = [
                'from-blue-500 via-cyan-500 to-teal-500',
                'from-purple-500 via-pink-500 to-rose-500',
                'from-orange-500 via-red-500 to-pink-500',
                'from-green-500 via-emerald-500 to-cyan-500',
                'from-indigo-500 via-purple-500 to-pink-500',
                'from-yellow-500 via-orange-500 to-red-500',
              ]
              const gradient = gradients[index % gradients.length]

              return (
                <Link
                  key={subject}
                  href={`/syllabus/${year}/${subject.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

                  <div className="relative p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                        <span className="text-4xl">📚</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          {subject}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <span className="text-sm font-bold text-white/90 uppercase tracking-wider">View PDF</span>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <span className="text-white text-lg transform group-hover:translate-x-1 transition-all">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
