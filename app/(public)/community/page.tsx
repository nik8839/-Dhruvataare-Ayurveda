'use client'

import Link from 'next/link'
import { FiArrowLeft, FiInstagram, FiYoutube, FiMessageCircle } from 'react-icons/fi'

export default function CommunityPage() {
  const socialLinks = {
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@dhruvataareayurveda?si=TnjCzpB_-wZH-sMw',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/dhruvataare01',
    whatsappChannel: 'https://whatsapp.com/channel/0029Vb2RtQ8EAKWN2TyXTO0q',
    whatsapp1stJunior: process.env.NEXT_PUBLIC_WHATSAPP_1ST_JUNIOR || 'https://chat.whatsapp.com/LEnNEbolkVbKEtLxLHqD89?mode=wwt',
    whatsapp1stSenior: process.env.NEXT_PUBLIC_WHATSAPP_1ST_SENIOR || 'https://chat.whatsapp.com/GDvD08rCgInI7nTljagvpy?mode=wwt',
    whatsapp2ndJunior: process.env.NEXT_PUBLIC_WHATSAPP_2ND_JUNIOR || 'https://chat.whatsapp.com/DqdLM1xoOjSH985v6AcVeR?mode=wwt',
    whatsapp2ndSenior: process.env.NEXT_PUBLIC_WHATSAPP_2ND_SENIOR || 'https://chat.whatsapp.com/CdYIKFUDN5y6ZpE4tGF1YC?mode=wwt',
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

          {/* Telegram */}
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiMessageCircle className="w-10 h-10" />
              <h2 className="text-2xl font-bold">Telegram</h2>
            </div>
            <p className="text-blue-100">
              Join our Telegram channel for updates and discussions
            </p>
          </a>

          {/* WhatsApp Channel */}
          <a
            href={socialLinks.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white md:col-span-2"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiMessageCircle className="w-10 h-10" />
              <h2 className="text-2xl font-bold">WhatsApp Channel</h2>
            </div>
            <p className="text-green-100">
              Follow our official WhatsApp channel for important announcements
            </p>
          </a>

          {/* WhatsApp Groups Section Title */}
          <div className="md:col-span-2 mt-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center">WhatsApp Student Groups</h2>
          </div>

          {/* WhatsApp 1st Proff Junior */}
          <a
            href={socialLinks.whatsapp1stJunior}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <FiMessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">1st Proff Junior</h3>
            </div>
            <p className="text-sm text-gray-500">Batch 2025-2026</p>
          </a>

          {/* WhatsApp 1st Proff Senior */}
          <a
            href={socialLinks.whatsapp1stSenior}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <FiMessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">1st Proff Senior</h3>
            </div>
            <p className="text-sm text-gray-500">Batch 2024-2025</p>
          </a>

          {/* WhatsApp 2nd Proff Junior */}
          <a
            href={socialLinks.whatsapp2ndJunior}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <FiMessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">2nd Proff Junior</h3>
            </div>
            <p className="text-sm text-gray-500">Batch 2023-2024</p>
          </a>

          {/* WhatsApp 2nd Proff Senior */}
          <a
            href={socialLinks.whatsapp2ndSenior}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <FiMessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">2nd Proff Senior</h3>
            </div>
            <p className="text-sm text-gray-500">Batch 2022-2023</p>
          </a>
        </div>
      </div>
    </div>
  )
}

