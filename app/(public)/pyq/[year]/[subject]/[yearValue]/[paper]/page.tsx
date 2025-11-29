'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiDownload, FiBell } from 'react-icons/fi'

export default function PYQPaperPage() {
  const params = useParams()
  const year = params.year as string
  const subject = params.subject as string
  const yearValue = params.yearValue as string
  const paper = params.paper as string

  const subjectName = subject
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const paperName = paper
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/pyq/${year}/${subject}`}
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {subjectName} - {yearValue} - {paperName}
        </h1>

        <div className="bg-gray-100 rounded-lg p-8 my-6 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 text-lg">
              PYQ PDF Viewer
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {subjectName} - {yearValue} - {paperName}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiDownload className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
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

