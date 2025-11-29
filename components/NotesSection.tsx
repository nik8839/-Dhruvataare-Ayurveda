'use client'

import { useState } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText, FiX } from 'react-icons/fi'

interface PDFItem {
  _id: string
  title: string
  category: string
  year?: string
  subject?: string
  paper?: string
}

const notesData = {
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

const papers = ['Paper 1', 'Paper 2']

export default function NotesSection() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [showPaperDialog, setShowPaperDialog] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleYearClick = (yearKey: string) => {
    setSelectedYear(yearKey)
    setSelectedSubject(null)
    setSelectedPaper(null)
    setShowSubjectDialog(true)
  }

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setShowSubjectDialog(false)
    setShowPaperDialog(true)
  }

  const handlePaperClick = async (paper: string) => {
    const paperValue = paper.toLowerCase().replace(' ', '-')
    setSelectedPaper(paperValue)
    setShowPaperDialog(false)
    
    if (!selectedYear || !selectedSubject) return

    try {
      setLoading(true)
      const response = await pdfAPI.getPDFs({
        category: 'notes',
        year: selectedYear,
        subject: selectedSubject,
        paper: paperValue,
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
    setShowSubjectDialog(false)
    setShowPaperDialog(false)
    setShowPdfViewer(false)
    setSelectedYear(null)
    setSelectedSubject(null)
    setSelectedPaper(null)
    setSelectedPdf(null)
  }

  return (
    <>
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Study Notes
        </h2>
        <div className="space-y-8">
          {Object.entries(notesData).map(([yearKey, yearData]) => (
            <div key={yearKey} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {yearData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {yearData.subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleYearClick(yearKey)}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FiFileText className="w-6 h-6 text-purple-600" />
                      <span className="font-medium text-gray-800">Subject {subject}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject Selection Dialog */}
      {showSubjectDialog && selectedYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Select Subject - {notesData[selectedYear as keyof typeof notesData]?.name}
              </h3>
              <button
                onClick={closeDialogs}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {notesData[selectedYear as keyof typeof notesData]?.subjects.map((subject, index) => (
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

      {/* Paper Selection Dialog */}
      {showPaperDialog && selectedYear && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Select Paper - Subject {selectedSubject}
              </h3>
              <button
                onClick={closeDialogs}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
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
