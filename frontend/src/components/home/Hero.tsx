'use client'

import { Search, MapPin, Building2, Map } from 'lucide-react'
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
    <section className="relative bg-white pt-16 pb-12 sm:pt-24 sm:pb-16 overflow-hidden flex items-center justify-center">
      {/* Decorative subtle background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-primary-100/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-accent-100/40 blur-[100px] pointer-events-none" />
      <div className="container relative z-10 max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-secondary-900 mb-5 tracking-tight leading-tight">
            {t('HomePage.heroTitle').split(' ').map((word: string, i: number, arr: string[]) =>
              i === arr.length - 1 || i === arr.length - 2 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {t('HomePage.heroSubtitle')}
          </p>
        </div>

        {/* Minimalist Search Widget */}
        <div className="max-w-3xl mx-auto relative z-20">
          <div className="bg-white/80 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-3 sm:p-0 rounded-[2rem] sm:rounded-none shadow-xl sm:shadow-none border border-white/50 sm:border-transparent">
            {/* Tabs */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="inline-flex w-full sm:w-auto bg-secondary-100/50 sm:bg-secondary-50 p-1.5 rounded-full border border-white/50 sm:border-secondary-100 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('rent')}
                  className={`btn w-1/2 sm:w-auto btn-sm sm:btn-md !rounded-full transition-all duration-300 font-bold ${activeTab === 'rent'
                    ? 'bg-white shadow-md text-primary-600 border-none'
                    : 'bg-transparent text-secondary-600 hover:text-secondary-900 border-none'
                    }`}
                >
                  {t('Property.rent')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sale')}
                  className={`btn w-1/2 sm:w-auto btn-sm sm:btn-md !rounded-full transition-all duration-300 font-bold ${activeTab === 'sale'
                    ? 'bg-white shadow-md text-primary-600 border-none'
                    : 'bg-transparent text-secondary-600 hover:text-secondary-900 border-none'
                    }`}
                >
                  {t('Property.sale')}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center bg-white border-2 border-secondary-100/80 rounded-full shadow-md sm:shadow-lg hover:shadow-xl hover:border-primary-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:shadow-xl transition-all duration-300 p-1.5 sm:p-2 pl-4 sm:pl-7">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('HomePage.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base sm:text-lg px-3 sm:px-4 py-2 sm:py-4 text-secondary-900 placeholder:text-secondary-400 w-full"
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
          <div className="flex overflow-x-auto sm:flex-wrap items-center sm:justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 pb-4 sm:pb-0 scrollbar-hide snap-x px-4 sm:px-0 -mx-4 sm:mx-0">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => router.push(`/properties?propertyType=${filter.id}&dealType=${activeTab}`)}
                className="btn btn-sm sm:btn-md flex-shrink-0 snap-center bg-white border border-secondary-200 text-secondary-700 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 !rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
            <Link
              href="/map"
              className="btn flex-shrink-0 btn-sm sm:btn-md snap-center bg-gradient-to-r from-primary-50 to-primary-100 !border-primary-200 !text-primary-800 hover:from-primary-100 hover:to-primary-200 !rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 sm:ml-2 transition-all duration-300 inline-flex items-center gap-2 h-[34px] sm:h-auto"
            >
              <Map className="w-4 h-4" />
              {t('HomePage.onMap')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
