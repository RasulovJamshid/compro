'use client'

import { useState, useEffect } from 'react'
import {
  Search, MapPin, Building2, ChevronLeft, ChevronRight,
  Grid3x3, List, SlidersHorizontal, ArrowUpDown
} from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'
import ComparisonButton from '@/components/comparison/ComparisonButton'
import ApiErrorHandler from '@/components/common/ApiErrorHandler'
import { CardSkeleton } from '@/components/common/LoadingSkeleton'
import { useAnalyticsStore } from '@/lib/store/analyticsStore'
import { useTranslations } from 'next-intl'
import PropertyFilterDrawer from '@/components/properties/PropertyFilterDrawer'

type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc'

const SORT_LABELS = (t: any) => ({
  newest: t('newest'),
  oldest: t('oldest'),
  price_asc: t('priceAsc'),
  price_desc: t('priceDesc'),
})

export default function PropertiesPage() {
  const t = useTranslations()
  const tPage = useTranslations('PropertiesPage')
  const tFilters = useTranslations('Filters')
  const tSort = useTranslations('Sort')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [scrolled, setScrolled] = useState(false)

  const trackFilter = useAnalyticsStore((state) => state.trackFilter)
  const trackSearch = useAnalyticsStore((state) => state.trackSearch)

  const limit = 12

  // Handle scroll to hide header
  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide on scroll down, show on scroll up. Also always show when near top.
      if (currentScrollY < 50) {
        setScrolled(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrolled(true)
      } else if (currentScrollY < lastScrollY) {
        setScrolled(false)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Force header hidden class on body when scrolled on this specific page
  useEffect(() => {
    if (scrolled) {
      document.body.classList.add('hide-main-header')
    } else {
      document.body.classList.remove('hide-main-header')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('hide-main-header')
    }
  }, [scrolled])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProperties() }, [filters, page, sortBy])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProperties({ ...filters, page, limit, sortBy } as PropertyFilters & { page?: number; limit?: number; sortBy?: string })
      setProperties(data.items || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err?.message || 'Ошибка при загрузке объектов')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters)
    setPage(1)
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') trackFilter(key as any, val)
    })
  }

  const handleSearch = (query: string) => {
    setFilters(prev => {
      const updated = { ...prev, q: query }
      if (query) trackSearch(query, updated)
      return updated
    })
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
    setError(null)
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, v]) => key !== 'q' && v !== undefined && v !== '' && v !== false
  ).length

  const totalPages = Math.ceil(total / limit)

  const gridClass = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
    : 'flex flex-col gap-4'

  const buildMapQuery = () => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', String(filters.q))
    if (filters.dealType) params.set('dealType', String(filters.dealType))
    if (filters.propertyType) params.set('propertyType', String(filters.propertyType))
    if (filters.city) params.set('city', String(filters.city))
    if (filters.minArea !== undefined) params.set('minArea', String(filters.minArea))
    if (filters.maxArea !== undefined) params.set('maxArea', String(filters.maxArea))
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
    if (filters.isVerified) params.set('isVerified', 'true')
    if (filters.hasVideo) params.set('hasVideo', 'true')
    if (filters.hasTour360) params.set('hasTour360', 'true')
    const query = params.toString()
    return query ? `/map?${query}` : '/map'
  }

  const mapPageHref = buildMapQuery()

  return (
    <div className="min-h-screen bg-white">
      <ApiErrorHandler error={error} onDismiss={() => setError(null)} />

      {/* ── Sticky search + actions bar ────────────────────────────────── */}
      <div 
        className={`fixed z-40 bg-white/90 backdrop-blur-xl border-b border-secondary-100 py-3 left-0 right-0 transition-all duration-300 ${scrolled ? 'top-0 shadow-sm' : 'top-[48px] sm:top-[48px]'}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Global Search */}
          <div className="w-full sm:flex-1 max-w-2xl relative">
            <div className="flex items-center bg-secondary-50 rounded-full px-4 py-2 border border-secondary-100 focus-within:border-primary-500 focus-within:bg-white transition-all shadow-sm">
              <Search className="w-4 h-4 text-secondary-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('HomePage.searchPlaceholder')}
                className="w-full pl-3 pr-2 py-0.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-secondary-900 placeholder:text-secondary-400"
                value={filters.q || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {/* Unified Filters Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 hover:bg-secondary-100 text-secondary-900 text-sm font-bold transition-colors flex-shrink-0 border border-secondary-100"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t('Filters.title')}</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-secondary-50 p-1 rounded-full border border-secondary-100 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-900'}`}
                title={tPage('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-900'}`}
                title={tPage('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Map link */}
            <a
              href={mapPageHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-900 hover:bg-black text-sm font-bold text-white transition-all shadow-sm active:scale-95 flex-shrink-0"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{t('Navigation.map')}</span>
            </a>
          </div>
        </div>
      </div>

      <PropertyFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
        onClear={clearFilters}
        resultsCount={total}
      />

      {/* ── Main Layout (Full Width) ─────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-[170px] sm:pt-[120px]">
        
        {/* ── Results header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <p className="text-lg font-bold text-secondary-900">
            {loading ? tPage('loading') : (
              <>{tPage('found')} <span className="text-primary-600">{total}</span> {tPage('objects')}</>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-full self-start sm:self-auto border border-secondary-100">
            <ArrowUpDown className="w-4 h-4 flex-shrink-0 text-secondary-400" />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1) }}
              className="border-0 bg-transparent text-sm font-semibold text-secondary-900 focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-4"
            >
              {(Object.entries(SORT_LABELS(tSort)) as [SortOption, string][]).map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Property grid / list ────────────────────────────────── */}
        {loading ? (
          <div className={gridClass}>
            {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-secondary-50 rounded-3xl border border-secondary-100 px-4">
            <div className="bg-red-50 p-4 rounded-full inline-block mb-4">
              <Building2 className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">{tPage('errorLoad')}</h3>
            <p className="text-secondary-500 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={fetchProperties} className="btn btn-lg btn-primary">
                {tPage('retry')}
              </button>
              <button onClick={clearFilters} className="btn btn-lg btn-outline !rounded-full">
                {tPage('clearFilters')}
              </button>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-secondary-50 rounded-3xl border border-secondary-100 px-4">
            <div className="bg-white p-5 rounded-full shadow-sm inline-block mb-4">
              <Search className="w-10 h-10 text-secondary-300" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">{tPage('notFound')}</h3>
            <p className="text-secondary-500 mb-6">{tPage('tryChange')}</p>
            <button onClick={clearFilters} className="btn btn-lg btn-outline !rounded-full shadow-sm bg-white">
              {tPage('resetAll')}
            </button>
          </div>
        ) : (
          <>
            <div className={gridClass}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 mb-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-secondary-200 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all bg-white shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-secondary-700" />
                </button>
                <span className="px-4 text-sm font-bold text-secondary-900">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-secondary-200 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all bg-white shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-secondary-700" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ComparisonButton />
    </div>
  )
}
