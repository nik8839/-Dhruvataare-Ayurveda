'use client'

import Link from 'next/link'
import { FiArrowLeft, FiBell } from 'react-icons/fi'
import SocialLinks from '@/components/SocialLinks'

export default function ContactPage() {
  const contactLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/dhruvataare01?igsh=c285OTBtM3Bmc2I=',
    gmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}` : 'mailto:contact@edutech.com',
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || 'https://wa.me/1234567890',
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

        <SocialLinks variant="grid" />

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
