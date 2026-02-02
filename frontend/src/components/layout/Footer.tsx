"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/map')) {
    return null
  }

  return (
    <footer className="bg-secondary-950 text-secondary-300 border-t border-secondary-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RealEstate</span>
            </div>
            <p className="text-sm leading-relaxed text-secondary-400">
              №1 маркетплейс коммерческой недвижимости в Ташкенте. Мы помогаем бизнесу находить идеальные помещения для роста и развития.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties" className="hover:text-primary-500 transition-colors">
                  Объекты
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-primary-500 transition-colors">
                  Карта
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary-500 transition-colors">
                  Тарифы
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6">Категории</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties?type=office" className="hover:text-primary-500 transition-colors">
                  Офисы
                </Link>
              </li>
              <li>
                <Link href="/properties?type=warehouse" className="hover:text-primary-500 transition-colors">
                  Склады
                </Link>
              </li>
              <li>
                <Link href="/properties?type=shop" className="hover:text-primary-500 transition-colors">
                  Магазины
                </Link>
              </li>
              <li>
                <Link href="/properties?type=cafe_restaurant" className="hover:text-primary-500 transition-colors">
                  Кафе и рестораны
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Контакты</h3>
            <ul className="space-y-4 text-sm text-secondary-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
                Ташкент, Узбекистан
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@realestate.uz" className="hover:text-white transition-colors">
                  info@realestate.uz
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <a href="tel:+998901234567" className="hover:text-white transition-colors">
                  +998 (90) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-900 mt-12 pt-8 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} RealEstate. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
