'use client'

import Link from 'next/link'
import { User, Heart, Menu, X, ChevronDown, Phone, MapPin, TrendingUp, BarChart3, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import Logo from '@/components/common/Logo'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        setServicesOpen(false)
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
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1 ml-4">
            <Link href="/properties" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              Аренда и Продажа
            </Link>
            <Link href="/map" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-4 h-4 text-secondary-400" />
              Поиск на карте
            </Link>
            
            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocus={() => setServicesOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setServicesOpen(false)
                }
              }}
            >
              <button
                type="button"
                className="text-sm font-bold text-secondary-700 group-hover:text-primary-600 transition-colors flex items-center gap-1 whitespace-nowrap py-2"
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen((prev) => !prev)}
              >
                Сервисы
                <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-primary-600' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div
                id="services-menu"
                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 transition-all duration-200 origin-top ${servicesOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                <div className="bg-white rounded-xl shadow-xl border border-secondary-100 p-2 z-50 flex flex-col gap-1">
                  <Link href="/compare" className="flex items-start gap-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors group/item" onClick={() => setServicesOpen(false)}>
                    <div className="bg-primary-50 p-2 rounded-lg group-hover/item:bg-primary-100 transition-colors">
                      <BarChart3 className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondary-900 mb-0.5">Сравнение</div>
                      <div className="text-xs text-secondary-500 leading-tight">Анализ цен и характеристик</div>
                    </div>
                  </Link>
                  <Link href="/analytics" className="flex items-start gap-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors group/item" onClick={() => setServicesOpen(false)}>
                    <div className="bg-primary-50 p-2 rounded-lg group-hover/item:bg-primary-100 transition-colors">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondary-900 mb-0.5">Аналитика</div>
                      <div className="text-xs text-secondary-500 leading-tight">Обзор рынка недвижимости</div>
                    </div>
                  </Link>
                  <Link href="/documents" className="flex items-start gap-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors group/item" onClick={() => setServicesOpen(false)}>
                    <div className="bg-primary-50 p-2 rounded-lg group-hover/item:bg-primary-100 transition-colors">
                      <FileText className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondary-900 mb-0.5">Документы</div>
                      <div className="text-xs text-secondary-500 leading-tight">Шаблоны договоров</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="/pricing" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              Тарифы
            </Link>
          </div>

          {/* Right: User Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <a href="tel:+998901234567" className="flex items-center gap-2 px-3 py-2 text-secondary-700 hover:text-primary-600 transition-colors whitespace-nowrap group">
              <div className="bg-secondary-100 group-hover:bg-primary-50 p-1.5 rounded-full transition-colors">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold">+998 90 123 45 67</span>
            </a>

            <div className="w-px h-6 bg-secondary-200"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/saved" className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">3</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 transition-all whitespace-nowrap">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                    <User className="h-4 w-4 text-secondary-700" />
                  </div>
                  <span className="text-sm font-bold text-secondary-700">{user?.phone || 'Профиль'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm font-bold text-secondary-700 hover:text-primary-600 transition-colors px-2 whitespace-nowrap">
                  Войти
                </Link>
                <Link href="/auth/register" className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20 whitespace-nowrap">
                  Разместить объект
                </Link>
              </div>
            )}
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
            <Link href="/properties" className="px-4 py-3 rounded-lg text-secondary-700 font-bold hover:bg-secondary-50 hover:text-primary-600 transition-colors" onClick={closeMobileMenu}>
              Аренда и Продажа
            </Link>
            <Link href="/map" className="px-4 py-3 rounded-lg text-secondary-700 font-bold hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
              <MapPin className="w-4 h-4" /> Карта
            </Link>
            <Link href="/pricing" className="px-4 py-3 rounded-lg text-secondary-700 font-bold hover:bg-secondary-50 hover:text-primary-600 transition-colors" onClick={closeMobileMenu}>
              Тарифы
            </Link>
            
            <div className="h-px bg-secondary-100 my-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link href="/saved" className="px-4 py-3 rounded-lg text-secondary-700 font-bold hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
                  <Heart className="w-4 h-4" /> Сохраненные
                </Link>
                <Link href="/profile" className="px-4 py-3 rounded-lg text-secondary-700 font-bold hover:bg-secondary-50 hover:text-primary-600 transition-colors flex items-center gap-2" onClick={closeMobileMenu}>
                  <User className="w-4 h-4" /> Профиль
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-4 pt-2">
                <Link href="/auth/login" className="w-full py-3 text-center text-secondary-700 font-bold bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors" onClick={closeMobileMenu}>
                  Войти
                </Link>
                <Link href="/auth/register" className="w-full py-3 text-center text-white font-bold bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-md shadow-primary-600/20" onClick={closeMobileMenu}>
                  Разместить объект
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
