'use client'

import Link from 'next/link'
import { User, Heart, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import Logo from '@/components/common/Logo'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function Header() {
  const t = useTranslations('Navigation')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, isAuthenticated } = useAuthStore()
  const pathname = usePathname()

  const isHome = pathname === '/'
  const isPropertiesPage = pathname === '/properties'
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)

      if (isPropertiesPage) {
        if (currentScrollY > 100) {
          if (currentScrollY > lastScrollY) {
            setIsVisible(false) // Scrolling down
          } else {
            setIsVisible(true) // Scrolling up
          }
        } else {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isPropertiesPage])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isDark = isHome && !scrolled
  const headerBg = isDark
    ? 'bg-secondary-950'
    : 'bg-white border-b border-secondary-100'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 header-transition ${isVisible ? '' : 'header-hidden'} ${headerBg}`}>
      <nav className="container flex items-center justify-between h-12" aria-label={t('mainNav')}>
        {/* Left: Logo */}
        <Logo variant={isDark ? 'light' : 'dark'} />

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/properties" className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/properties') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/70 hover:text-white' : 'text-secondary-600 hover:text-secondary-900'}`}>
            {t('properties')}
          </Link>
          <Link href="/map" className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/map') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/70 hover:text-white' : 'text-secondary-600 hover:text-secondary-900'}`}>
            {t('map')}
          </Link>
          <Link href="/pricing" className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/pricing') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/70 hover:text-white' : 'text-secondary-600 hover:text-secondary-900'}`}>
            {t('pricing')}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-1.5">
              <Link href="/saved" className={`btn btn-icon ${isDark ? 'text-white/70 hover:text-white' : 'text-secondary-500 hover:text-secondary-900'}`}>
                <Heart className="h-4.5 w-4.5" />
              </Link>
              <Link href="/profile" className={`btn btn-sm ${isDark ? 'text-white/70 hover:text-white' : 'text-secondary-600 hover:text-secondary-900 bg-secondary-50'}`}>
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user?.phone || t('profile')}</span>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5">
              <Link href="/auth/login" className={`btn btn-sm ${isDark ? 'text-white/70 hover:text-white' : 'text-secondary-600 hover:text-secondary-900'}`}>
                {t('login')}
              </Link>
              <Link href="/auth/register" className="btn btn-sm btn-primary">
                {t('register')}
              </Link>
            </div>
          )}

          {/* Mobile: lang + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              className={`btn btn-icon ${isDark ? 'text-white' : 'text-secondary-700'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 pb-4 pt-2 ${isDark ? 'bg-secondary-950 border-white/10' : 'bg-white border-secondary-100'}`}>
          <div className="flex flex-col gap-1">
            <Link href="/properties" className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive('/properties') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/80 hover:text-white' : 'text-secondary-700 hover:bg-secondary-50'}`} onClick={closeMobileMenu}>
              {t('properties')}
            </Link>
            <Link href="/map" className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive('/map') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/80 hover:text-white' : 'text-secondary-700 hover:bg-secondary-50'}`} onClick={closeMobileMenu}>
              {t('map')}
            </Link>
            <Link href="/pricing" className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive('/pricing') ? isDark ? 'bg-white/10 text-white' : 'bg-secondary-100 text-secondary-900' : isDark ? 'text-white/80 hover:text-white' : 'text-secondary-700 hover:bg-secondary-50'}`} onClick={closeMobileMenu}>
              {t('pricing')}
            </Link>

            {!isAuthenticated && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-secondary-100/20">
                <Link href="/auth/login" className={`btn btn-sm flex-1 ${isDark ? 'text-white bg-white/10' : 'text-secondary-700 bg-secondary-50'}`} onClick={closeMobileMenu}>
                  {t('login')}
                </Link>
                <Link href="/auth/register" className="btn btn-sm btn-primary flex-1" onClick={closeMobileMenu}>
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
