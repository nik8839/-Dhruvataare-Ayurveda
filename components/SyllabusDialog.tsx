'use client'

import { useState, useEffect } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText, FiX, FiBell } from 'react-icons/fi'
import Link from 'next/link'

interface PDFItem {
  _id: string
  title: string
  category: string
  subject: string
}

interface SyllabusDialogProps {
  onClose: () => void
}

export default function SyllabusDialog({ onClose }: SyllabusDialogProps) {
  const [subjects, setSubjects] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<{ [key: string]: PDFItem | null }>({})
  const [loading, setLoading] = useState(true)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  useEffect(() => {
    loadSyllabus()
  }, [])

  const loadSyllabus = async () => {
    try {
      setLoading(true)
      // Get dynamic subjects from taxonomy
      const taxonomyResponse = await pdfAPI.getTaxonomy('syllabus')
      if (taxonomyResponse.success && taxonomyResponse.data.subjects) {
        const dynamicSubjects = taxonomyResponse.data.subjects
        setSubjects(dynamicSubjects)
        
        // Get PDFs for these subjects
        const response = await pdfAPI.getPDFs({ category: 'syllabus' })
        if (response.success) {
          const pdfsMap: { [key: string]: PDFItem | null } = {}
          dynamicSubjects.forEach((subject: string) => {
            const pdf = response.data.find((p: any) => p.subject === subject)
            pdfsMap[subject] = pdf || null
          })
          setPdfs(pdfsMap)
        }
      }
    } catch (error) {
      console.error('Error loading syllabus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectClick = (subject: string) => {
    const pdf = pdfs[subject]
    if (pdf) {
      setSelectedPdf(pdf)
      setShowPdfViewer(true)
    } else {
      alert(`PDF for subject ${subject} is not available yet.`)
    }
  }

  const closePdfViewer = () => {
    setShowPdfViewer(false)
    setSelectedPdf(null)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl shadow-medical-lg max-w-2xl w-full p-8 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 medical-gradient-blue"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Syllabus</h2>
              <p className="text-gray-600 text-sm mt-1">Select a subject to view syllabus</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 transform hover:rotate-90"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-600 py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4">Loading syllabus...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {subjects.map((subject, index) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectClick(subject)}
                  className="group relative flex flex-col items-center justify-center p-8 medical-gradient-blue rounded-3xl w-36 h-36 mx-auto shadow-medical hover:shadow-medical-lg transform hover:scale-110 hover:-rotate-3 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <FiFileText className="w-14 h-14 text-white mb-3 transform group-hover:scale-125 transition-transform" />
                    <span className="text-lg font-bold text-white">Subject {subject}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/community"
              className="flex items-center justify-center space-x-2 w-full medical-gradient-teal hover:shadow-medical-lg rounded-xl p-4 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-medical"
            >
              <span>Join Our Community</span>
              <FiBell className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">{selectedPdf.title}</h3>
              <button
                onClick={closePdfViewer}
                className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfAPI.viewPDF(selectedPdf._id)}
                className="w-full h-full min-h-[600px] border-0"
                title={selectedPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

