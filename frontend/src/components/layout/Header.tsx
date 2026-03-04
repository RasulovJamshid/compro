'use client'

import Link from 'next/link'
import { User, Heart, Menu, X, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import Logo from '@/components/common/Logo'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations('Navigation')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-secondary-200 transition-all duration-300">
      <nav className="container mx-auto px-4 py-3.5" aria-label="Основная навигация">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-6 flex-1 ml-4">
            <Link href="/properties" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('properties')}
            </Link>
            <Link href="/map" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-4 h-4 text-secondary-400" />
              {t('map')}
            </Link>
            <Link href="/pricing" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('pricing')}
            </Link>
          </div>

          {/* Right: User Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link href="/saved" className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-all">
                  <User className="h-4 w-4 text-secondary-700" />
                  <span className="text-sm font-medium text-secondary-700">{user?.phone || t('profile')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors px-3 py-2">
                  {t('login')}
                </Link>
                <Link href="/auth/register" className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                  {t('register')}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden flex-shrink-0 p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div id="mobile-navigation" aria-hidden={!mobileMenuOpen} className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-2 pb-4 border-t border-secondary-100 pt-4">
            <Link href="/properties" className="px-4 py-2.5 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 hover:text-primary-600 transition-colors" onClick={closeMobileMenu}>
              {t('properties')}
            </Link>
            <Link href="/map" className="px-4 py-2.5 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
              <MapPin className="w-4 h-4" /> {t('map')}
            </Link>
            <Link href="/pricing" className="px-4 py-2.5 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 hover:text-primary-600 transition-colors" onClick={closeMobileMenu}>
              {t('pricing')}
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="h-px bg-secondary-100 my-1"></div>
                <Link href="/saved" className="px-4 py-2.5 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
                  <Heart className="w-4 h-4" /> {t('saved')}
                </Link>
                <Link href="/profile" className="px-4 py-2.5 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
                  <User className="w-4 h-4" /> {t('profile')}
                </Link>
              </>
            )}
            
            <div className="h-px bg-secondary-100 my-1"></div>
            
            {!isAuthenticated && (
              <div className="flex gap-2 px-4 pt-1">
                <Link href="/auth/login" className="flex-1 py-2.5 text-center text-secondary-700 font-medium bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors" onClick={closeMobileMenu}>
                  {t('login')}
                </Link>
                <Link href="/auth/register" className="flex-1 py-2.5 text-center text-white font-medium bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors" onClick={closeMobileMenu}>
                  {t('register')}
                </Link>
              </div>
            )}
            
            <div className="px-4 pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
