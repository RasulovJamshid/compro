'use client'

import Link from 'next/link'
import { Building2, User, Heart, Menu, X, ChevronDown, Phone, Mail, MapPin, TrendingUp, BarChart3, FileText, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-secondary-200 transition-all duration-300">
      <nav className="mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg shadow-primary-500/20 group-hover:bg-primary-700 transition-colors">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-secondary-600 whitespace-nowrap">
                RealEstate
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
            <Link href="/properties" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Объекты
            </Link>
            <Link href="/map" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-4 h-4" />
              Карта
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors flex items-center gap-1 whitespace-nowrap">
                Сервисы
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-100 py-2 z-50">
                  <Link href="/compare" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors">
                    <BarChart3 className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-secondary-900">Сравнение</div>
                      <div className="text-xs text-secondary-500">Сравните объекты</div>
                    </div>
                  </Link>
                  <Link href="/analytics" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-secondary-900">Аналитика</div>
                      <div className="text-xs text-secondary-500">Рыночные тренды</div>
                    </div>
                  </Link>
                  <Link href="/documents" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors">
                    <FileText className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-secondary-900">Документы</div>
                      <div className="text-xs text-secondary-500">Шаблоны и гайды</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/pricing" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Тарифы
            </Link>
            <Link href="/about" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <HelpCircle className="w-4 h-4" />
              О нас
            </Link>
          </div>

          {/* Right: User Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a href="tel:+998901234567" className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">+998 90 123 45 67</span>
            </a>
            {isAuthenticated ? (
              <>
                <Link href="/saved" className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 transition-all whitespace-nowrap">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                    <User className="h-4 w-4 text-secondary-700" />
                  </div>
                  <span className="text-sm font-medium text-secondary-700">{user?.phone}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors px-4 py-2 whitespace-nowrap">
                  Войти
                </Link>
                <Link href="/auth/register" className="btn btn-primary text-sm px-6 whitespace-nowrap">
                  Разместить объект
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/properties" className="block text-gray-700 hover:text-primary-600">
              Объекты
            </Link>
            <Link href="/map" className="block text-gray-700 hover:text-primary-600">
              Карта
            </Link>
            <Link href="/pricing" className="block text-gray-700 hover:text-primary-600">
              Тарифы
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/saved" className="block text-gray-700 hover:text-primary-600">
                  Сохраненные
                </Link>
                <Link href="/profile" className="block text-gray-700 hover:text-primary-600">
                  Профиль
                </Link>
              </>
            ) : (
              <Link href="/auth/login" className="block btn btn-primary">
                Войти
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
