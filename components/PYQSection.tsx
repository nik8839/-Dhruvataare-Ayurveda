'use client'

import { useState, useEffect } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText, FiX } from 'react-icons/fi'

interface PDFItem {
  _id: string
  title: string
  category: string
  year?: string
  subject?: string
  yearValue?: string
  paper?: string
}

const yearsData = {
  '1st-year': {
    name: '1st Year',
    subjects: ['A', 'B', 'C', 'D', 'E'],
  },
  '2nd-year': {
    name: '2nd Year',
    subjects: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
  '3rd-year': {
    name: '3rd Year',
    subjects: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },
}

const yearValues = ['2025', '2024', '2023', '2022']
const papers = ['Paper 1', 'Paper 2']

export default function PYQSection() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedYearValue, setSelectedYearValue] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showYearDialog, setShowYearDialog] = useState(false)
  const [showPaperDialog, setShowPaperDialog] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleYearClick = (yearKey: string) => {
    setSelectedYear(yearKey)
    setSelectedSubject(null)
    setSelectedYearValue(null)
    setSelectedPaper(null)
    setShowYearDialog(true)
  }

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setShowYearDialog(false)
    setShowPaperDialog(true)
  }

  const handleYearValueClick = (yearValue: string) => {
    setSelectedYearValue(yearValue)
    // Keep paper dialog open to show papers
  }

  const handlePaperClick = async (paper: string) => {
    const paperValue = paper.toLowerCase().replace(' ', '-')
    setSelectedPaper(paperValue)
    setShowPaperDialog(false)
    await loadPDF()
  }

  const loadPDF = async () => {
    if (!selectedYear || !selectedSubject || !selectedYearValue || !selectedPaper) {
      return
    }

    try {
      setLoading(true)
      const response = await pdfAPI.getPDFs({
        category: 'pyq',
        year: selectedYear,
        subject: selectedSubject,
        yearValue: selectedYearValue,
        paper: selectedPaper,
      })

      if (response.success && response.data && response.data.length > 0) {
        setSelectedPdf(response.data[0])
        setShowPdfViewer(true)
      } else {
        alert('PDF not found for the selected combination.')
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
      alert('Error loading PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeDialogs = () => {
    setShowYearDialog(false)
    setShowPaperDialog(false)
    setShowPdfViewer(false)
    setSelectedYear(null)
    setSelectedSubject(null)
    setSelectedYearValue(null)
    setSelectedPaper(null)
    setSelectedPdf(null)
  }

  return (
    <>
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Previous Year Questions (PYQ)
        </h2>
        <div className="space-y-8">
          {Object.entries(yearsData).map(([yearKey, yearData]) => (
            <div key={yearKey} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {yearData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {yearData.subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleYearClick(yearKey)}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FiFileText className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-800">Subject {subject}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Year Selection Dialog */}
      {showYearDialog && selectedYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Select Subject - {yearsData[selectedYear as keyof typeof yearsData]?.name}
              </h3>
              <button
                onClick={closeDialogs}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {yearsData[selectedYear as keyof typeof yearsData]?.subjects.map((subject, index) => (
                <button
                  key={index}
                  onClick={() => handleSubjectClick(subject)}
                  className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-center font-semibold text-gray-800 transition-colors"
                >
                  Subject {subject}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Year Value and Paper Selection Dialog */}
      {showPaperDialog && selectedYear && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Subject {selectedSubject} - Select Year
              </h3>
              <button
                onClick={closeDialogs}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            {!selectedYearValue ? (
              <div className="grid grid-cols-2 gap-3">
                {yearValues.map((yearValue) => (
                  <button
                    key={yearValue}
                    onClick={() => handleYearValueClick(yearValue)}
                    className="bg-green-50 hover:bg-green-100 rounded-lg p-4 text-center font-semibold text-gray-800 transition-colors"
                  >
                    {yearValue}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Selected Year: <span className="font-semibold">{selectedYearValue}</span></p>
                  <button
                    onClick={() => setSelectedYearValue(null)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    ← Change Year
                  </button>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Select Paper</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {papers.map((paper) => (
                      <button
                        key={paper}
                        onClick={() => handlePaperClick(paper)}
                        disabled={loading}
                        className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center font-semibold text-gray-800 transition-colors disabled:opacity-50"
                      >
                        {paper}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Dialog */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">{selectedPdf.title}</h3>
              <button
                onClick={closeDialogs}
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

      <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
        <a
          href="/community"
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
        >
          Join Our Community →
        </a>
      </div>
    </>
  )
}
