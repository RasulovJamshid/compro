'use client'

import { Search, Building2, Map } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Hero() {
  const router = useRouter()
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('rent')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.append('q', searchQuery.trim())
    params.append('dealType', activeTab)
    router.push(`/properties?${params.toString()}`)
  }

  const quickFilters = [
    { id: 'office', label: t('Property.office'), icon: Building2 },
    { id: 'warehouse', label: t('Property.warehouse'), icon: Building2 },
    { id: 'shop', label: t('Property.shop'), icon: Building2 },
    { id: 'cafe_restaurant', label: t('Property.cafeRestaurant'), icon: Building2 },
  ]

  return (
    <section className="relative bg-secondary-950 sm:bg-white pt-16 sm:pt-24 pb-10 sm:pb-16 overflow-hidden flex items-center justify-center">
      {/* Decorative subtle background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[55%] rounded-full bg-primary-500/25 sm:bg-primary-100/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[55%] rounded-full bg-accent-400/20 sm:bg-accent-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent sm:hidden pointer-events-none" />
      <div className="container relative z-10 max-w-4xl">
        {/* Heading */}
        <div className="text-left sm:text-center mb-6 sm:mb-14">
          <h1 className="text-[28px] sm:text-5xl md:text-6xl font-extrabold text-white sm:text-secondary-900 mb-3 sm:mb-5 tracking-tight leading-[1.1] max-w-[260px] sm:max-w-none">
            {t('HomePage.heroTitle').split(' ').map((word: string, i: number, arr: string[]) =>
              i === arr.length - 1 || i === arr.length - 2 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300 sm:from-primary-600 sm:to-accent-500">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
          <p className="text-sm sm:text-lg text-white/70 sm:text-secondary-500 max-w-[290px] sm:max-w-2xl mx-0 sm:mx-auto px-0 sm:px-0 leading-6">
            {t('HomePage.heroSubtitle')}
          </p>
        </div>

        {/* Minimalist Search Widget */}
        <div className="max-w-3xl mx-auto relative z-20">
          <div className="bg-white/8 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-3 sm:p-0 rounded-[28px] sm:rounded-none shadow-[0_16px_40px_rgba(2,6,23,0.35)] sm:shadow-none border border-white/10 sm:border-transparent">
            {/* Tabs */}
            <div className="flex justify-center mb-3 sm:mb-6">
              <div className="inline-flex w-full sm:w-auto bg-white/10 sm:bg-secondary-50 p-1 rounded-full border border-white/10 sm:border-secondary-100 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('rent')}
                  className={`btn w-1/2 sm:w-auto btn-sm sm:btn-md !rounded-full transition-all duration-300 font-bold ${activeTab === 'rent'
                    ? 'bg-white shadow-md text-primary-600 border-none'
                    : 'bg-transparent text-white/75 sm:text-secondary-600 hover:text-white sm:hover:text-secondary-900 border-none'
                    }`}
                >
                  {t('Property.rent')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sale')}
                  className={`btn w-1/2 sm:w-auto btn-sm sm:btn-md !rounded-full transition-all duration-300 font-bold ${activeTab === 'sale'
                    ? 'bg-white shadow-md text-primary-600 border-none'
                    : 'bg-transparent text-white/75 sm:text-secondary-600 hover:text-white sm:hover:text-secondary-900 border-none'
                    }`}
                >
                  {t('Property.sale')}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center bg-white border border-white/10 sm:border-2 sm:border-secondary-100/80 rounded-full shadow-lg sm:shadow-lg hover:shadow-xl hover:border-primary-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:shadow-xl transition-all duration-300 p-1.5 sm:p-2 pl-4 sm:pl-7">
                <Search className="w-4 h-4 sm:w-6 sm:h-6 text-primary-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('HomePage.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-lg px-3 sm:px-4 py-2.5 sm:py-4 text-secondary-900 placeholder:text-secondary-400 w-full"
                />

                {/* Desktop Search Button */}
                <button
                  type="submit"
                  className="btn btn-lg btn-primary !rounded-full hidden sm:flex text-base px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {t('HomePage.searchButton')}
                </button>

                {/* Mobile Search Icon Button (Integrated natively) */}
                <button
                  type="submit"
                  className="flex sm:hidden items-center justify-center w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex-shrink-0 shadow-md active:scale-95"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Filters (Swipeable on Mobile) */}
          <div className="mt-5 sm:mt-10">
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              {quickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => router.push(`/properties?propertyType=${filter.id}&dealType=${activeTab}`)}
                  className="btn btn-sm sm:btn-md w-full justify-center min-w-0 bg-white/10 sm:bg-white border border-white/10 sm:border-secondary-200 text-[11px] text-white sm:text-base sm:text-secondary-700 hover:text-white sm:hover:text-primary-600 hover:border-white/20 sm:hover:border-primary-300 hover:bg-white/15 sm:hover:bg-primary-50 !rounded-full shadow-sm hover:shadow-md hover:-translate-y-0 sm:hover:-translate-y-0.5 transition-all duration-300"
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
              <Link
                href="/map"
                className="btn btn-sm sm:btn-md col-span-2 w-full justify-center bg-white text-primary-800 sm:w-auto sm:bg-gradient-to-r sm:from-primary-50 sm:to-primary-100 !border-white sm:!border-primary-200 !rounded-full shadow-sm hover:shadow-md hover:-translate-y-0 sm:hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                {t('HomePage.onMap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
