'use client'

import Link from 'next/link'
import { FiArrowLeft, FiBell } from 'react-icons/fi'

export default function AchieversPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Achievers Series
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 text-center mb-8">
            Success stories and achievements of our students
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {item}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Achiever #{item}</h3>
                    <p className="text-gray-600 text-sm">Top Performer</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Success story and achievements of this outstanding student.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
        <Link
          href="/community"
          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
        >
          <span>Join Our Community</span>
          <FiBell className="w-5 h-5" />
        </Link>
        </div>
      </div>
    </div>
  )
}

