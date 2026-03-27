'use client'

import Link from 'next/link'
import { Search, MapPin, Heart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/lib/store/authStore'
import { useEffect, useState } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const t = useTranslations('Navigation')
  const { isAuthenticated } = useAuthStore()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
    }
  }, [])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const items = [
    { href: '/properties', icon: Search, label: t('properties') },
    { href: '/map', icon: MapPin, label: t('map') },
    { href: isAuthenticated ? '/saved' : '/auth/login', icon: Heart, label: t('saved') },
    { href: isAuthenticated ? '/profile' : '/auth/login', icon: User, label: t('profile') },
  ]

  if (isFullscreen) return null

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-secondary-100 safe-area-bottom">
      <div className="grid grid-cols-4 h-14">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 ${
                active ? 'text-primary-600' : 'text-secondary-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
