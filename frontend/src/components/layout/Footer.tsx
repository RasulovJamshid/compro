"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/common/Logo'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const pathname = usePathname()
  const tFooter = useTranslations('Footer')

  if (pathname.startsWith('/map')) {
    return null
  }

  return (
    <footer className="bg-secondary-950 text-secondary-500 hidden lg:block">
      <div className="container py-8">
        <div className="flex items-start justify-between gap-8">
          <div>
            <Logo variant="light" />
            <p className="text-xs text-secondary-600 mt-2 max-w-xs">{tFooter('desc')}</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <Link href="/properties" className="hover:text-white transition-colors">{tFooter('properties')}</Link>
              <Link href="/map" className="hover:text-white transition-colors">{tFooter('map')}</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">{tFooter('pricing')}</Link>
            </div>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@compro.uz" className="hover:text-white transition-colors">info@compro.uz</a>
              <a href="tel:+998901234567" className="hover:text-white transition-colors">+998 (90) 123-45-67</a>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-800/40 mt-6 pt-4 text-xs text-secondary-600">
          &copy; {new Date().getFullYear()} COMPRO.UZ. {tFooter('rights')}
        </div>
      </div>
    </footer>
  )
}
