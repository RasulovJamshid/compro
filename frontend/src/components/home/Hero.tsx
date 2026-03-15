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
    <section className="bg-white pt-12 pb-8 sm:pt-20 sm:pb-12">
      <div className="container max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 tracking-tight">
            {t('HomePage.heroTitle')}
          </h1>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {t('HomePage.heroSubtitle')}
          </p>
        </div>

        {/* Minimalist Search */}
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-secondary-50 p-1 rounded-full border border-secondary-100">
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`btn btn-sm !rounded-full ${
                  activeTab === 'rent'
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                {t('Property.rent')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sale')}
                className={`btn btn-sm !rounded-full ${
                  activeTab === 'sale'
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                {t('Property.sale')}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white border-2 border-secondary-100 rounded-full shadow-sm hover:border-primary-200 focus-within:border-primary-500 focus-within:shadow-md transition-all p-1.5 pl-4 sm:pl-6">
              <Search className="w-5 h-5 text-secondary-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('HomePage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base sm:text-lg px-3 py-3 text-secondary-900 placeholder:text-secondary-400 w-full"
              />
              <button
                type="submit"
                className="btn btn-md btn-primary !rounded-full hidden sm:flex"
              >
                {t('HomePage.searchButton')}
              </button>
            </div>
            {/* Mobile Search Button */}
            <button
              type="submit"
              className="btn btn-md btn-primary w-full mt-3 sm:hidden"
            >
              {t('HomePage.searchButton')}
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => router.push(`/properties?propertyType=${filter.id}&dealType=${activeTab}`)}
                className="btn btn-sm btn-outline !rounded-full"
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
            <Link
              href="/map"
              className="btn btn-sm btn-outline !rounded-full !border-primary-200 !text-primary-700 hover:!bg-primary-50 ml-auto sm:ml-2"
            >
              <Map className="w-4 h-4" />
              На карте
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
