'use client'

import Link from 'next/link'
import { FiArrowLeft, FiInstagram, FiMail, FiMessageCircle, FiBell } from 'react-icons/fi'

export default function ContactPage() {
  const contactLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/dhruvataare01?igsh=c285OTBtM3Bmc2I=',
    gmail: 'mailto:contact@edutech.com',
    whatsapp: 'https://wa.me/1234567890',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Get in touch with us through any of these platforms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instagram */}
          <a
            href={contactLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white text-center"
          >
            <div className="flex flex-col items-center">
              <FiInstagram className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Instagram</h2>
              <p className="text-pink-100 text-sm">
                Follow us for updates
              </p>
            </div>
          </a>

          {/* Gmail */}
          <a
            href={contactLinks.gmail}
            className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white text-center"
          >
            <div className="flex flex-col items-center">
              <FiMail className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Gmail</h2>
              <p className="text-red-100 text-sm">
                Send us an email
              </p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={contactLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white text-center"
          >
            <div className="flex flex-col items-center">
              <FiMessageCircle className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">WhatsApp</h2>
              <p className="text-green-100 text-sm">
                Chat with us
              </p>
            </div>
          </a>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            We typically respond within 24 hours
          </p>
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
