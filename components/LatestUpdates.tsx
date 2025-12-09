import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiBell, FiExternalLink } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'
import SocialLinks from './SocialLinks'

// Helper function to generate URL for a PDF based on its category
function getPDFUrl(pdf: any): string {
  const normalizeStr = (str: string) => str.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')
  
  switch (pdf.category) {
    case 'syllabus':
      return `/syllabus/${normalizeStr(pdf.subject || '')}`
    case 'pyq':
    case 'notes':
      return `/${pdf.category}/${pdf.year}/${normalizeStr(pdf.subject || '')}`
    case 'exclusive':
      return `/exclusive/${pdf._id}`
    default:
      return '#'
  }
}

export default function LatestUpdates() {
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await pdfAPI.getPDFs()
        if (response.success) {
          // Take top 5 latest PDFs
          setUpdates(response.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching updates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [])

  if (loading) {
    return (
      <section className="my-16 relative">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Latest Updates
          </h2>
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (updates.length === 0) return null

  return (
    <section className="my-16 relative">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Latest Updates
        </h2>
        <p className="text-gray-600 text-lg">Stay updated with new content</p>
        <div className="w-24 h-1 medical-gradient-blue mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="glass rounded-2xl shadow-medical p-8 border border-blue-100">
        <div className="space-y-4">
          {updates.map((update, index) => {
            const url = getPDFUrl(update)
            const categoryLabel = update.category.charAt(0).toUpperCase() + update.category.slice(1)
            
            return (
              <Link
                key={update._id}
                href={url}
                className="block"
              >
                <div
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-teal-50/50 rounded-xl hover:shadow-medical transform hover:scale-[1.02] transition-all duration-300 border border-blue-100/50 group relative overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center space-x-4 relative z-10 flex-1">
                    <div className="w-14 h-14 medical-gradient-blue rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-medical transform group-hover:rotate-12 transition-transform">
                      {categoryLabel.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {update.title}
                        <FiExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                        {update.subject && (
                          <>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            <span>{update.subject}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 medical-gradient-blue text-white rounded-full text-sm font-semibold shadow-medical transform group-hover:scale-110 transition-transform relative z-10">
                    {categoryLabel}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="mt-10 relative overflow-hidden rounded-2xl shadow-medical hover:shadow-medical-lg transform hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 medical-gradient-mixed opacity-90"></div>
        <div className="relative p-6 text-center">
          <Link
            href="/community"
            className="flex items-center justify-center space-x-3 text-white font-bold text-lg group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Join Our Community</span>
            <FiBell className="w-6 h-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  )
}

