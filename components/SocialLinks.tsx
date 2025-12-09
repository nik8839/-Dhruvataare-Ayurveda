'use client'

import { FiInstagram, FiYoutube, FiMessageCircle, FiMail, FiSend, FiPhone } from 'react-icons/fi'

export const socialConfig = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FiInstagram,
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/dhruvataare01?igsh=c285OTBtM3Bmc2I=',
    color: 'hover:text-pink-500',
    bg: 'from-pink-500 to-purple-600',
    hoverBg: 'hover:bg-pink-50',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: FiYoutube,
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@dhruvataareayurveda?si=TnjCzpB_-wZH-sMw',
    color: 'hover:text-red-500',
    bg: 'from-red-500 to-red-600',
    hoverBg: 'hover:bg-red-50', 
  },
  {
    id: 'whatsappChannel',
    label: 'WhatsApp Channel',
    icon: FiMessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || 'https://whatsapp.com/channel/0029Vb2RtQ8EAKWN2TyXTO0q',
    color: 'hover:text-green-500',
    bg: 'from-green-500 to-emerald-600',
    hoverBg: 'hover:bg-green-50',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: FiSend,
    url: process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/dhruvataare01',
    color: 'hover:text-blue-500',
    bg: 'from-blue-400 to-blue-600',
    hoverBg: 'hover:bg-blue-50',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    icon: FiMail,
    url: process.env.NEXT_PUBLIC_CONTACT_EMAIL ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}` : 'mailto:contact@edutech.com',
    color: 'hover:text-red-600',
    bg: 'from-red-500 to-orange-500',
    hoverBg: 'hover:bg-orange-50',
  },
  {
    id: 'contactWhatsapp',
    label: 'Contact WhatsApp',
    icon: FiPhone,
    url: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || 'https://wa.me/1234567890',
    color: 'hover:text-green-600',
    bg: 'from-green-600 to-teal-600',
    hoverBg: 'hover:bg-teal-50',
  },
  {
    id: 'wa1stJunior',
    label: 'WA 1st Year Jr',
    icon: FiMessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_1ST_JUNIOR || '#',
    color: 'hover:text-emerald-500',
    bg: 'from-emerald-500 to-green-600',
    hoverBg: 'hover:bg-emerald-50',
  },
  {
    id: 'wa1stSenior',
    label: 'WA 1st Year Sr',
    icon: FiMessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_1ST_SENIOR || '#',
    color: 'hover:text-emerald-600',
    bg: 'from-emerald-600 to-green-700',
    hoverBg: 'hover:bg-emerald-50',
  },
  {
    id: 'wa2ndJunior',
    label: 'WA 2nd Year Jr',
    icon: FiMessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_2ND_JUNIOR || '#',
    color: 'hover:text-teal-500',
    bg: 'from-teal-500 to-emerald-600',
    hoverBg: 'hover:bg-teal-50',
  },
  {
    id: 'wa2ndSenior',
    label: 'WA 2nd Year Sr',
    icon: FiMessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_2ND_SENIOR || '#',
    color: 'hover:text-teal-600',
    bg: 'from-teal-600 to-emerald-700',
    hoverBg: 'hover:bg-teal-50',
  },
]

interface SocialLinksProps {
  variant?: 'footer' | 'section' | 'dialog' | 'grid'
  className?: string
}

export default function SocialLinks({ variant = 'section', className = '' }: SocialLinksProps) {
  if (variant === 'footer') {
    return (
      <div className={`space-y-4 ${className}`}>
        {socialConfig.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-3 text-gray-300 ${item.color} transition-colors text-base group`}
          >
            <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {socialConfig.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-br ${item.bg} rounded-xl p-6 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-white text-center group`}
          >
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-1">{item.label}</h3>
              <p className="text-white/80 text-sm">Click to Connect</p>
            </div>
          </a>
        ))}
      </div>
    )
  }

  // Default 'section' or 'dialog' (horizontal row/wrap)
  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {socialConfig.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md ${item.color} ${item.hoverBg} transition-all duration-300 transform hover:-translate-y-1`}
        >
          <item.icon className="w-5 h-5" />
          <span className="font-semibold text-gray-700 group-hover:text-inherit">{item.label}</span>
        </a>
      ))}
    </div>
  )
}
