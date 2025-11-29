'use client'

import { useState } from 'react'
import ExclusiveIcons from '@/components/ExclusiveIcons'
import SyllabusDialog from '@/components/SyllabusDialog'
import PYQDialog from '@/components/PYQDialog'
import NotesDialog from '@/components/NotesDialog'
import LatestUpdates from '@/components/LatestUpdates'

export default function Home() {
  const [showSyllabus, setShowSyllabus] = useState(false)
  const [showPYQ, setShowPYQ] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <ExclusiveIcons />
      
      {/* Syllabus Section */}
      <section className="my-12">
        <button
          onClick={() => setShowSyllabus(true)}
          className="w-full relative overflow-hidden rounded-2xl shadow-medical hover:shadow-medical-lg transform hover:scale-[1.02] transition-all duration-500 text-left group"
        >
          <div className="absolute inset-0 medical-gradient-blue opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-10 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Syllabus</h2>
                <p className="text-blue-100 text-lg">Access complete course syllabus</p>
              </div>
              <div className="text-6xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-300">
                📚
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-white/80">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm">Click to explore subjects</span>
            </div>
          </div>
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </section>

      {/* PYQ Section */}
      <section className="my-12">
        <button
          onClick={() => setShowPYQ(true)}
          className="w-full relative overflow-hidden rounded-2xl shadow-medical hover:shadow-medical-lg transform hover:scale-[1.02] transition-all duration-500 text-left group"
        >
          <div className="absolute inset-0 medical-gradient-teal opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-10 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">PYQs</h2>
                <p className="text-teal-100 text-lg">Previous Year Question Papers</p>
              </div>
              <div className="text-6xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-300">
                📝
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-white/80">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm">Browse by year and subject</span>
            </div>
          </div>
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </section>

      {/* Notes Section */}
      <section className="my-12">
        <button
          onClick={() => setShowNotes(true)}
          className="w-full relative overflow-hidden rounded-2xl shadow-medical hover:shadow-medical-lg transform hover:scale-[1.02] transition-all duration-500 text-left group"
        >
          <div className="absolute inset-0 medical-gradient-purple opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-10 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Notes</h2>
                <p className="text-purple-100 text-lg">Comprehensive study materials</p>
              </div>
              <div className="text-6xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-300">
                📖
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-white/80">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm">Organized by year and subject</span>
            </div>
          </div>
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </section>

      <LatestUpdates />

      {/* Dialogs */}
      {showSyllabus && (
        <SyllabusDialog onClose={() => setShowSyllabus(false)} />
      )}
      {showPYQ && (
        <PYQDialog onClose={() => setShowPYQ(false)} />
      )}
      {showNotes && (
        <NotesDialog onClose={() => setShowNotes(false)} />
      )}
    </div>
  )
}
