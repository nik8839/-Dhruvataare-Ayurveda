'use client'

import Link from 'next/link'
import { FiInstagram, FiYoutube, FiMessageCircle, FiBell } from 'react-icons/fi'

export default function Footer() {
  const socialLinks = {
    instagram: 'https://instagram.com/edutech',
    youtube: 'https://youtube.com/@edutech',
    whatsapp1stYear: 'https://chat.whatsapp.com/1styear',
    whatsapp2ndYear: 'https://chat.whatsapp.com/2ndyear',
    whatsappSenior: 'https://chat.whatsapp.com/senior',
  }

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Dark gradient background for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                ET
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">EduTech</h2>
                <p className="text-base text-gray-400">Medical Education</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-base">
              Your comprehensive learning platform for medical syllabus notes, PYQs, and study materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/pyq" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 group text-base">
                  <span className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-2 transition-transform">Previous Year Questions</span>
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 group text-base">
                  <span className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-2 transition-transform">Study Notes</span>
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 group text-base">
                  <span className="w-2 h-2 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-2 transition-transform">Syllabus</span>
                </Link>
              </li>
              <li>
                <Link href="/achievers" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 group text-base">
                  <span className="w-2 h-2 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-2 transition-transform">Achievers Series</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 group text-base">
                  <span className="w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-2 transition-transform">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Join Our Community */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <h3 className="text-2xl font-bold text-white">Join Our Community</h3>
              <FiBell className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <p className="text-gray-300 mb-6 text-base">
              Connect with us and fellow students on various platforms
            </p>
            <div className="space-y-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors text-base group"
              >
                <FiInstagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-colors text-base group"
              >
                <FiYoutube className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>YouTube</span>
              </a>
              <a
                href={socialLinks.whatsapp1stYear}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors text-base group"
              >
                <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>1st Year WhatsApp Group</span>
              </a>
              <a
                href={socialLinks.whatsapp2ndYear}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors text-base group"
              >
                <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>2nd Year WhatsApp Group</span>
              </a>
              <a
                href={socialLinks.whatsappSenior}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors text-base group"
              >
                <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Senior WhatsApp Group</span>
              </a>
            </div>
            <div className="mt-8">
              <Link
                href="/community"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-bold text-base transform hover:scale-105 shadow-xl"
              >
                View All Communities →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-base">
            © {new Date().getFullYear()} EduTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
