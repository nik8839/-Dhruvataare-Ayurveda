'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiFileText, FiBell } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function PYQSubjectPage() {
  const params = useParams()
  const router = useRouter()
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
        // Convert URL subject format to search term
        const searchSubject = subject.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        
        console.log('Searching for PYQ subject:', searchSubject, 'in year:', year)
        
        const response = await pdfAPI.getPDFs({
          category: 'pyq',
          year: year,
          subject: searchSubject
        })
        
        console.log('PYQ API Response:', response)
        
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

  // Group PDFs by yearValue
  const groupedPDFs = pdfs.reduce((acc, pdf) => {
    const yearVal = pdf.yearValue || 'Unknown'
    if (!acc[yearVal]) {
      acc[yearVal] = []
    }
    acc[yearVal].push(pdf)
    return acc
  }, {} as Record<string, any[]>)

  const sortedYears = Object.keys(groupedPDFs).sort((a, b) => b.localeCompare(a))

  const handleViewPDF = (pdfId: string) => {
    window.open(pdfAPI.viewPDF(pdfId), '_blank')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/pyq"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to PYQ</span>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {subjectName} - {year.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <p className="text-gray-600 mb-6">Previous Year Questions</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No PYQs found for this subject.
          </div>
        ) : (
          <div className="space-y-6">
            {sortedYears.map((yearValue) => (
              <div key={yearValue} className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Year {yearValue}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedPDFs[yearValue].map((pdf) => (
                    <div
                      key={pdf._id}
                      onClick={() => handleViewPDF(pdf._id)}
                      className="cursor-pointer flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200"
                    >
                      <FiFileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <span className="font-medium text-gray-800 block">{pdf.paper || pdf.title}</span>
                        <span className="text-xs text-gray-500">View PDF</span>
                      </div>
                    </div>
                  ))}
                </div>
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

