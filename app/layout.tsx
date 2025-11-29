import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/contexts/ToastContext'
import BackgroundAnimations from '@/components/BackgroundAnimations'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduTech - Medical Education Platform',
  description: 'Comprehensive medical education resources, syllabus, PYQs, and notes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <BackgroundAnimations />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
