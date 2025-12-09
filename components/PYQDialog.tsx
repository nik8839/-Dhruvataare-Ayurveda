'use client'

import { useState, useEffect } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText, FiX, FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import SocialLinks from './SocialLinks'

interface PDFItem {
  _id: string
  title: string
  category: string
  year?: string
  subject?: string
  yearValue?: string
  paper?: string
}

interface YearData {
  name: string
  subjects: string[]
  years: string[]
  papers: string[]
}

interface PYQDialogProps {
  onClose: () => void
}

export default function PYQDialog({ onClose }: PYQDialogProps) {
  const { showError } = useToast()
  const [taxonomy, setTaxonomy] = useState<{ [key: string]: YearData }>({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedYearValue, setSelectedYearValue] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [showYearDialog, setShowYearDialog] = useState(false)
  const [showPaperDialog, setShowPaperDialog] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showSocials, setShowSocials] = useState(false)

  useEffect(() => {
    loadTaxonomy()
  }, [])

  const loadTaxonomy = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getTaxonomy('pyq')
      if (response.success && response.data) {
        // Convert year keys to display names
        const formattedTaxonomy: { [key: string]: YearData } = {}
        Object.entries(response.data).forEach(([yearKey, yearData]: any) => {
          formattedTaxonomy[yearKey] = {
            name: yearKey.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            subjects: yearData.subjects || [],
            years: yearData.years || [],
            papers: yearData.papers || []
          }
        })
        setTaxonomy(formattedTaxonomy)
      }
    } catch (error) {
      console.error('Error loading PYQ taxonomy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleYearClick = (yearKey: string) => {
    setSelectedYear(yearKey)
    setSelectedSubject(null)
    setSelectedYearValue(null)
    setSelectedPaper(null)
    setShowSubjectDialog(true)
  }

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setShowSubjectDialog(false)
    setShowYearDialog(true)
  }

  const handleYearValueClick = (yearValue: string) => {
    setSelectedYearValue(yearValue)
    setShowYearDialog(false)
    setShowPaperDialog(true)
  }

  const handlePaperClick = async (paper: string) => {
    const paperValue = paper.toLowerCase().replace(' ', '-')
    setSelectedPaper(paperValue)
    setShowPaperDialog(false)
    
    if (!selectedYear || !selectedSubject || !selectedYearValue) return

    try {
      setPdfLoading(true)
      const response = await pdfAPI.getPDFs({
        category: 'pyq',
        year: selectedYear,
        subject: selectedSubject,
        yearValue: selectedYearValue,
        paper: paperValue,
      })

      if (response.success && response.data && response.data.length > 0) {
        setSelectedPdf(response.data[0])
        setShowPdfViewer(true)
      } else {
        showError('PDF not found for the selected combination.')
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
      showError('Error loading PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const closeAll = () => {
    onClose()
    setShowSubjectDialog(false)
    setShowYearDialog(false)
    setShowPaperDialog(false)
    setShowPdfViewer(false)
    setSelectedYear(null)
    setSelectedSubject(null)
    setSelectedYearValue(null)
    setSelectedPaper(null)
    setSelectedPdf(null)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl shadow-medical-lg max-w-2xl w-full p-8 border border-teal-100">
          <div className="text-center text-gray-600">Loading PYQs...</div>
        </div>
      </div>
    )
  }

  const hasContent = Object.keys(taxonomy).length > 0

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl shadow-medical-lg max-w-2xl w-full p-8 border border-teal-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 medical-gradient-teal"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">PYQs</h2>
              <p className="text-gray-600 text-sm mt-1">Previous Year Question Papers</p>
            </div>
            <button
              onClick={closeAll}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 transform hover:rotate-90"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {!hasContent ? (
            <div className="text-center py-8 text-gray-600">
              No PYQ content available yet. Check back soon!
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(taxonomy).map(([yearKey, yearData], index) => (
                <button
                  key={yearKey}
                  onClick={() => handleYearClick(yearKey)}
                  className="group w-full relative overflow-hidden medical-gradient-teal rounded-xl p-6 hover:shadow-medical-lg transform hover:scale-[1.02] transition-all duration-500 text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{yearData.name}</h3>
                    <span className="text-white/80 group-hover:text-white transform group-hover:translate-x-2 transition-all">→</span>
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
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {taxonomy[selectedYear].name} - Select Subject
              </h3>
              <button
                onClick={closeAll}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {taxonomy[selectedYear].subjects.map((subject, index) => (
                <button
                  key={index}
                  onClick={() => handleSubjectClick(subject)}
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-32 h-32 mx-auto hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <FiFileText className="w-12 h-12 text-blue-600 mb-2" />
                  <span className="text-lg font-semibold text-gray-800 text-center">{subject}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/community"
                className="flex items-center justify-center space-x-2 w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <FiBell className="w-5 h-5" />
                <span>Join Our Community</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Year Value Selection Dialog */}
      {showYearDialog && selectedYear && selectedSubject && taxonomy[selectedYear] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedSubject} - Select Year
              </h3>
              <button
                onClick={closeAll}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {taxonomy[selectedYear].years.map((yearValue) => (
                <button
                  key={yearValue}
                  onClick={() => handleYearValueClick(yearValue)}
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-full w-32 h-32 mx-auto hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl font-bold text-gray-800">{yearValue}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/community"
                className="flex items-center justify-center space-x-2 w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <FiBell className="w-5 h-5" />
                <span>Join Our Community</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Paper Selection Dialog */}
      {showPaperDialog && selectedYear && selectedSubject && selectedYearValue && taxonomy[selectedYear] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedYearValue} - {selectedSubject} - Select Paper
              </h3>
              <button
                onClick={closeAll}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {taxonomy[selectedYear].papers.map((paper) => {
                const paperLabel = paper.replace('paper-', 'Paper ')
                return (
                  <button
                    key={paper}
                    onClick={() => handlePaperClick(paperLabel)}
                    disabled={pdfLoading}
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full w-32 h-32 mx-auto hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    <FiFileText className="w-12 h-12 text-purple-600 mb-2" />
                    <span className="text-lg font-semibold text-gray-800">{paperLabel}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/community"
                className="flex items-center justify-center space-x-2 w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <FiBell className="w-5 h-5" />
                <span>Join Our Community</span>
              </Link>
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
