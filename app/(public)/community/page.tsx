'use client'

import Link from 'next/link'
import { FiArrowLeft, FiInstagram, FiYoutube, FiMessageCircle } from 'react-icons/fi'

export default function CommunityPage() {
  const socialLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/YOUR_HANDLE',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@YOUR_CHANNEL',
    whatsapp1stYear: process.env.NEXT_PUBLIC_WHATSAPP_1ST_YEAR || 'https://chat.whatsapp.com/YOUR_1ST_YEAR_LINK',
    whatsapp2ndYear: process.env.NEXT_PUBLIC_WHATSAPP_2ND_YEAR || 'https://chat.whatsapp.com/YOUR_2ND_YEAR_LINK',
    whatsappSenior: process.env.NEXT_PUBLIC_WHATSAPP_SENIOR || 'https://chat.whatsapp.com/YOUR_SENIOR_LINK',
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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Join Our Community
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Connect with us and fellow students on various platforms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiInstagram className="w-10 h-10" />
              <h2 className="text-2xl font-bold">Instagram</h2>
            </div>
            <p className="text-pink-100">
              Follow us for daily updates, tips, and study materials
            </p>
          </a>

          {/* YouTube */}
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiYoutube className="w-10 h-10" />
              <h2 className="text-2xl font-bold">YouTube</h2>
            </div>
            <p className="text-red-100">
              Watch video lectures, tutorials, and exam preparation tips
            </p>
          </a>

          {/* WhatsApp 1st Year */}
          <a
            href={socialLinks.whatsapp1stYear}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiMessageCircle className="w-10 h-10" />
              <h2 className="text-2xl font-bold">1st Year Group</h2>
            </div>
            <p className="text-green-100">
              Join the WhatsApp group for 1st year students
            </p>
          </a>

          {/* WhatsApp 2nd Year */}
          <a
            href={socialLinks.whatsapp2ndYear}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiMessageCircle className="w-10 h-10" />
              <h2 className="text-2xl font-bold">2nd Year Group</h2>
            </div>
            <p className="text-green-100">
              Join the WhatsApp group for 2nd year students
            </p>
          </a>

          {/* WhatsApp Senior */}
          <a
            href={socialLinks.whatsappSenior}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white md:col-span-2"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiMessageCircle className="w-10 h-10" />
              <h2 className="text-2xl font-bold">Senior Group</h2>
            </div>
            <p className="text-green-100">
              Join the WhatsApp group for senior students (3rd year and above)
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}

