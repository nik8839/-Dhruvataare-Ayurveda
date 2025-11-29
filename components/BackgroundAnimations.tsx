'use client'

import { useEffect, useState } from 'react'

export default function BackgroundAnimations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Large Floating Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-6000"></div>

      {/* Medium Floating Blobs */}
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-3000"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-5000"></div>

      {/* Small Floating Particles */}
      <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-teal-300 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-blob animation-delay-1000"></div>
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-blob animation-delay-7000"></div>
    </div>
  )
}
