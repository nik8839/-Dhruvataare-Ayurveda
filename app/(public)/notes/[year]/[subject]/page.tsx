'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiFileText, FiBell } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function NotesSubjectPage() {
  const params = useParams()
  const year = params.year as string
  const subject = params.subject as string
  const [pdfs, setPdfs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const subjectName = subject
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        // Convert URL subject format (e.g., "anatomy") to search term
        const searchSubject = subject.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        
        console.log('Searching for subject:', searchSubject, 'in year:', year)
        
        const response = await pdfAPI.getPDFs({
          category: 'notes',
          year: year,
          subject: searchSubject
        })
        
        console.log('API Response:', response)
        
        if (response.success) {
          setPdfs(response.data)
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (year && subject) {
      fetchPDFs()
    }
  }, [year, subject])

  const handleViewPDF = (pdfId: string) => {
    window.open(pdfAPI.viewPDF(pdfId), '_blank')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/notes"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Notes</span>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {subjectName} - {year.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <p className="text-gray-600 mb-6">Available Notes</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No notes found for this subject.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pdfs.map((pdf) => (
              <div
                key={pdf._id}
                onClick={() => handleViewPDF(pdf._id)}
                className="cursor-pointer flex items-center justify-between p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <FiFileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <span className="font-semibold text-gray-800 text-lg block">{pdf.title}</span>
                    <span className="text-sm text-gray-600">{pdf.description || 'View Notes PDF'}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
        <Link
          href="/community"
          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
        >
          <span>Join Our Community</span>
          <FiBell className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

