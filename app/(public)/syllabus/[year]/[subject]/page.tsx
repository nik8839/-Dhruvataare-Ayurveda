'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiDownload, FiEye } from 'react-icons/fi'
import { pdfAPI } from '@/lib/api'

export default function SyllabusSubjectPage() {
    const params = useParams()
    const year = params.year as string
    const subjectSlug = params.subject as string
    const [pdf, setPdf] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPDF() {
            try {
                // Convert URL subject format to search term (Same as PYQ)
                const searchSubject = subjectSlug.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
                
                console.log('Searching for Syllabus subject:', searchSubject, 'in year:', year)

                const response = await pdfAPI.getPDFs({
                    category: 'syllabus',
                    year: year,
                    subject: searchSubject
                })

                if (response.success && response.data && response.data.length > 0) {
                    // Use the first matching PDF
                    setPdf(response.data[0])
                } else {
                    // Fallback: Try fetching all for year and fuzzy match (in case capitalization differs)
                    console.log('Direct search failed, trying fuzzy match...')
                    const allResponse = await pdfAPI.getPDFs({
                        category: 'syllabus',
                        year: year
                    })
                    
                    if (allResponse.success && allResponse.data) {
                        const normalize = (str: string) => str.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')
                        const foundPdf = allResponse.data.find((p: any) => normalize(p.subject) === subjectSlug)
                        if (foundPdf) setPdf(foundPdf)
                    }
                }
            } catch (error) {
                console.error('Error loading PDF:', error)
            } finally {
                setLoading(false)
            }
        }
        loadPDF()
    }, [year, subjectSlug])

    const handleDownload = async () => {
        if (!pdf) return
        try {
            await pdfAPI.downloadPDF(pdf._id)
        } catch (error) {
            alert('Download failed')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!pdf) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Syllabus Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the syllabus for this subject.</p>
                    <Link
                        href={`/syllabus/${year}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Subjects
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Link
                    href={`/syllabus/${year}`}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span>Back to Subjects</span>
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{pdf.subject}</h1>
                            <p className="text-gray-500 mt-1 capitalize">{year.replace('-', ' ')} Syllabus</p>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <FiDownload className="w-5 h-5" />
                            <span>Download PDF</span>
                        </button>
                    </div>

                    <div className="bg-gray-100 p-4 md:p-8 min-h-[800px]">
                        <iframe
                            src={pdfAPI.viewPDF(pdf._id)}
                            className="w-full h-full min-h-[800px] border-0 rounded-lg shadow-inner bg-white"
                            title={`${pdf.subject} Syllabus`}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
