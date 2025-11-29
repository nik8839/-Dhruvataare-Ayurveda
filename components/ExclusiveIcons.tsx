'use client'

import { useRef, useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import { pdfAPI } from '@/lib/api'

interface PDFItem {
  _id: string
  title: string
  description?: string
  category: string
  isPremium: boolean
}

export default function ExclusiveIcons() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [exclusiveItems, setExclusiveItems] = useState<PDFItem[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    loadExclusiveContent()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [exclusiveItems])

  const loadExclusiveContent = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getPDFs({ category: 'exclusive' })
      console.log('Exclusive content response:', response) // Debug log
      if (response.success) {
        setExclusiveItems(response.data || [])
        console.log('Exclusive items loaded:', response.data?.length || 0) // Debug log
      } else {
        console.error('API returned success: false', response)
      }
    } catch (error) {
      console.error('Error loading exclusive content:', error)
      // Set empty array on error so component still renders
      setExclusiveItems([])
    } finally {
      setLoading(false)
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Exclusive Content
        </h2>
        <div className="text-center text-gray-600">Loading...</div>
      </section>
    )
  }

  if (exclusiveItems.length === 0) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Exclusive Content
        </h2>
        <div className="text-center text-gray-600 bg-gray-50 rounded-lg p-8">
          <p className="mb-2">No exclusive content available yet.</p>
          <p className="text-sm text-gray-500">
            Check back later or contact admin to add exclusive content.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="my-16 relative">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Exclusive Content
        </h2>
        <p className="text-gray-600 text-lg">Premium medical study materials</p>
        <div className="w-24 h-1 medical-gradient-blue mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 medical-gradient-blue rounded-full p-4 shadow-medical hover:shadow-medical-lg transform hover:scale-110 transition-all duration-300 text-white"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide px-16 py-6"
          style={{ scrollBehavior: 'smooth' }}
        >
          {exclusiveItems.map((item, index) => (
            <Link
              key={item._id}
              href={`/exclusive/${item._id}`}
              className="flex-shrink-0 group"
            >
              <div className="relative w-40 h-40 rounded-3xl medical-gradient-mixed flex flex-col items-center justify-center text-white shadow-medical hover:shadow-medical-lg transform hover:scale-110 hover:-rotate-3 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">📚</span>
                  <span className="text-sm font-bold text-center px-3 mb-2">
                    {item.title}
                  </span>
                  {item.isPremium && (
                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse-glow">
                      ⭐ Premium
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 medical-gradient-blue rounded-full p-4 shadow-medical hover:shadow-medical-lg transform hover:scale-110 transition-all duration-300 text-white"
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  )
}
