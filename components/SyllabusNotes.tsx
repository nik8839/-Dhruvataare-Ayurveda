'use client'

import { useState, useEffect } from 'react'
import { pdfAPI } from '@/lib/api'
import { FiFileText } from 'react-icons/fi'

interface PDFItem {
  _id: string
  title: string
  category: string
}


export default function SyllabusNotes() {
  const [pdfs, setPdfs] = useState<{ [key: string]: PDFItem | null }>({})
  const [loading, setLoading] = useState(true)
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  useEffect(() => {
    loadSyllabusPDFs()
  }, [])

  const loadSyllabusPDFs = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getPDFs({ category: 'syllabus' })
      if (response.success) {
        const pdfsMap: { [key: string]: PDFItem | null } = {}
        subjects.forEach((subject, index) => {
          // Match PDFs by index or title
          const pdf = response.data[index] || response.data.find((p: PDFItem) => 
            p.title.toLowerCase().includes(subject.toLowerCase())
          )
          pdfsMap[subject] = pdf || null
        })
        setPdfs(pdfsMap)
      }
    } catch (error) {
      console.error('Error loading syllabus PDFs:', error)
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
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Syllabus Notes
        </h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FiFileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Subject {subject}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">View Syllabus PDF</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* PDF Viewer Dialog */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
