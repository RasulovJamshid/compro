'use client'

import Link from 'next/link'
import { Search, MapPin, Plus, Heart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/lib/store/authStore'

export default function BottomNav() {
  const pathname = usePathname()
  const t = useTranslations('Navigation')
  const { isAuthenticated } = useAuthStore()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const items = [
    { href: '/properties', icon: Search, label: t('properties') },
    { href: '/map', icon: MapPin, label: t('map') },
    { href: '/announcements/entity', icon: Plus, label: t('add'), isAdd: true },
    { href: '/saved', icon: Heart, label: t('saved') },
    { href: isAuthenticated ? '/profile' : '/auth/login', icon: User, label: t('profile') },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-secondary-100 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          if (item.isAdd) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-11 h-11 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </Link>
            )
          }

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
