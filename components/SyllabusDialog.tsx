'use client'

import { useState, useEffect } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText, FiX, FiBell, FiBook } from 'react-icons/fi'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import SocialLinks from './SocialLinks'

interface PDFItem {
  _id: string
  title: string
  category: string
  subject: string
}

interface YearData {
  subjects: string[]
}

interface SyllabusDialogProps {
  onClose: () => void
}

export default function SyllabusDialog({ onClose }: SyllabusDialogProps) {
  // We might not have ToastContext available in all layouts, so handle gracefully if needed
  // But assuming it is available since PYQ uses it. If not, we'll use alert.
  const [taxonomy, setTaxonomy] = useState<{ [key: string]: YearData }>({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showSocials, setShowSocials] = useState(false)

  useEffect(() => {
    loadSyllabus()
  }, [])

  const loadSyllabus = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getTaxonomy('syllabus')
      if (response.success && response.data) {
        // The API returns { "1st-year": { subjects: [...] }, ... }
        // We need to ensure we handle the structure correctly
        setTaxonomy(response.data)
      }
    } catch (error) {
      console.error('Error loading syllabus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleYearClick = (yearKey: string) => {
    setSelectedYear(yearKey)
    setShowSubjectDialog(true)
  }

  const handleSubjectClick = async (subject: string) => {
    if (!selectedYear) return

    try {
      setPdfLoading(true)
      // Fetch PDF for this year and subject
      const response = await pdfAPI.getPDFs({
        category: 'syllabus',
        year: selectedYear,
        subject: subject
      })

      if (response.success && response.data && response.data.length > 0) {
        setSelectedPdf(response.data[0])
        setShowSubjectDialog(false)
        setShowPdfViewer(true)
      } else {
        alert('Syllabus PDF not found for this subject.')
      }
    } catch (error) {
      console.error('Error fetching PDF:', error)
      alert('Failed to load PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const closeAll = () => {
    onClose()
    setShowSubjectDialog(false)
    setShowPdfViewer(false)
    setSelectedYear(null)
    setSelectedPdf(null)
  }

  const hasContent = Object.keys(taxonomy).length > 0

  return (
    <>
      {/* Main Year Selection Dialog */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl shadow-medical-lg max-w-2xl w-full p-8 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 medical-gradient-blue"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Syllabus</h2>
              <p className="text-gray-600 text-sm mt-1">Select your academic year</p>
            </div>
            <button
              onClick={closeAll}
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
          ) : !hasContent ? (
             <div className="text-center py-8 text-gray-600">
               No Syllabus content available yet. Check back soon!
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(taxonomy).sort().map((yearKey, index) => (
                <button
                  key={yearKey}
                  onClick={() => handleYearClick(yearKey)}
                  className="group relative flex flex-col items-center justify-center p-8 medical-gradient-blue rounded-3xl w-full shadow-medical hover:shadow-medical-lg transform hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <FiBook className="w-12 h-12 text-white mb-3 transform group-hover:scale-125 transition-transform" />
                    <span className="text-xl font-bold text-white capitalize">{yearKey.replace('-', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Join Our Community</h3>
            {!showSocials ? (
              <button
                onClick={() => setShowSocials(true)}
                className="flex items-center justify-center space-x-2 w-full medical-gradient-teal hover:shadow-medical-lg rounded-xl p-4 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-medical"
              >
                <span>Join Our Community</span>
                <FiBell className="w-5 h-5" />
              </button>
            ) : (
              <SocialLinks variant="section" className="justify-center animate-fadeIn" />
            )}
          </div>
        </div>
      </div>

      {/* Subject Selection Dialog */}
      {showSubjectDialog && selectedYear && taxonomy[selectedYear] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 capitalize">
                {selectedYear.replace('-', ' ')} - Select Subject
              </h3>
              <button
                onClick={closeAll}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {pdfLoading ? (
               <div className="flex justify-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
               </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto p-2">
                {taxonomy[selectedYear].subjects.sort().map((subject, index) => (
                    <button
                    key={index}
                    onClick={() => handleSubjectClick(subject)}
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-100"
                    >
                    <FiFileText className="w-10 h-10 text-blue-600 mb-3" />
                    <span className="text-sm font-bold text-gray-800 text-center">{subject}</span>
                    </button>
                ))}
                </div>
            )}
            
            <div className="mt-6 pt-6 border-t flex justify-between">
               <button 
                 onClick={() => setShowSubjectDialog(false)}
                 className="text-blue-600 hover:text-blue-800 font-medium"
               >
                 ← Back to Years
               </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Dialog */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">{selectedPdf.title}</h3>
              <button
                onClick={() => {
                  setShowPdfViewer(false)
                  setSelectedPdf(null)
                }}
                className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-gray-100 p-4">
              <iframe
                src={pdfAPI.viewPDF(selectedPdf._id)}
                className="w-full h-full min-h-[600px] border-0 rounded shadow-sm bg-white"
                title={selectedPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
