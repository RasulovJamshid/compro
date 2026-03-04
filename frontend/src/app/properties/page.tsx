'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Building2, X, ChevronLeft, ChevronRight, Grid3x3, List, Filter } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'
import ComparisonButton from '@/components/comparison/ComparisonButton'
import ApiErrorHandler from '@/components/common/ApiErrorHandler'
import { CardSkeleton } from '@/components/common/LoadingSkeleton'
import { useAnalyticsStore } from '@/lib/store/analyticsStore'
import { useTranslations } from 'next-intl'

export default function PropertiesPage() {
  const t = useTranslations()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const trackFilter = useAnalyticsStore((state) => state.trackFilter)
  const trackSearch = useAnalyticsStore((state) => state.trackSearch)
  
  const limit = 12

  useEffect(() => {
    fetchProperties()
  }, [filters, page])

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowFilters(true)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 100) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProperties({ ...filters, page, limit })
      setProperties(data.items || [])
      setTotal(data.total || 0)
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка при загрузке объектов'
      setError(errorMessage)
      setProperties([])
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value }
      trackFilter(key, value)
      return updated
    })
    setPage(1)
  }

  const handleSearch = (query: string) => {
    setFilters(prev => {
      const updated = { ...prev, q: query }
      if (query) trackSearch(query, filters)
      return updated
    })
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
    setError(null)
  }

  const totalPages = Math.ceil(total / limit)

  const gridClass = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
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

  const filtersContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-secondary-900 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-primary-600" />
          {t('Filters.title')}
        </h3>
        <button onClick={clearFilters} className="text-xs text-secondary-500 hover:text-red-500 transition-colors">
          {t('Filters.reset')}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">{t('Property.dealType')}</label>
          <select
            className="input input-sm"
            value={filters.dealType || ''}
            onChange={(e) => handleFilterChange('dealType', e.target.value || undefined)}
          >
            <option value="">{t('Filters.all')}</option>
            <option value="rent">{t('Property.rent')}</option>
            <option value="sale">{t('Property.sale')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">{t('Property.propertyType')}</label>
          <select
            className="input input-sm"
            value={filters.propertyType || ''}
            onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
          >
            <option value="">{t('Filters.all')}</option>
            <option value="office">{t('Property.office')}</option>
            <option value="warehouse">{t('Property.warehouse')}</option>
            <option value="shop">{t('Property.shop')}</option>
            <option value="cafe_restaurant">Кафе/Ресторан</option>
            <option value="industrial">Производство</option>
            <option value="salon">Салон</option>
            <option value="recreation">Развлечения</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">{t('Filters.city')}</label>
          <select
            className="input input-sm"
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
          >
            <option value="">{t('Filters.all')}</option>
            <option value="Ташкент">Ташкент</option>
            <option value="Самарканд">Самарканд</option>
            <option value="Бухара">Бухара</option>
            <option value="Хива">Хива</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">{t('Property.area')} (м²)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="От"
              className="input input-sm"
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="До"
              className="input input-sm"
              value={filters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">{t('Property.price')} (сум)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="От"
              className="input input-sm"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="До"
              className="input input-sm"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
        
        <div className="pt-3 border-t border-secondary-100">
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">Класс здания</label>
          <select
            className="input input-sm"
            value={filters.buildingClass || ''}
            onChange={(e) => handleFilterChange('buildingClass', e.target.value || undefined)}
          >
            <option value="">Любой</option>
            <option value="A">Класс A</option>
            <option value="B">Класс B</option>
            <option value="C">Класс C</option>
            <option value="C+">Класс C+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">Состояние</label>
          <select
            className="input input-sm"
            value={filters.propertyCondition || ''}
            onChange={(e) => handleFilterChange('propertyCondition', e.target.value || undefined)}
          >
            <option value="">Любое</option>
            <option value="new">Новое</option>
            <option value="excellent">Отличное</option>
            <option value="good">Хорошее</option>
            <option value="needs_renovation">Требует ремонта</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">Высота потолков (от, м)</label>
          <input
            type="number"
            step="0.1"
            placeholder="Например: 3.5"
            className="input input-sm w-full"
            value={filters.minCeilingHeight || ''}
            onChange={(e) => handleFilterChange('minCeilingHeight', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-secondary-700 mb-1.5">Мощность электросети (от, кВт)</label>
          <input
            type="number"
            placeholder="Например: 100"
            className="input input-sm w-full"
            value={filters.minPowerCapacity || ''}
            onChange={(e) => handleFilterChange('minPowerCapacity', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div className="pt-3 border-t border-secondary-100 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              checked={filters.isVerified || false}
              onChange={(e) => handleFilterChange('isVerified', e.target.checked || undefined)}
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600">{t('Filters.verifiedOnly')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              checked={filters.hasParking || false}
              onChange={(e) => handleFilterChange('hasParking', e.target.checked || undefined)}
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600">{t('Filters.hasParking')}</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              checked={filters.hasElevator || false}
              onChange={(e) => handleFilterChange('hasElevator', e.target.checked || undefined)}
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600">{t('Filters.hasElevator')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              checked={filters.hasVideo || false}
              onChange={(e) => handleFilterChange('hasVideo', e.target.checked || undefined)}
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600">{t('Filters.hasVideo')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              checked={filters.hasTour360 || false}
              onChange={(e) => handleFilterChange('hasTour360', e.target.checked || undefined)}
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600">{t('Filters.hasTour360')}</span>
          </label>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-secondary-50">
      <ApiErrorHandler error={error} onDismiss={() => setError(null)} />

      {/* Ultra Compact Auto-Hide Header */}
      <div className={`bg-white border-b border-secondary-200 sticky top-16 z-40 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-base sm:text-lg font-bold text-secondary-900 whitespace-nowrap">{t('Navigation.properties')}</h1>
            
            {/* Inline Search */}
            <div className="order-3 sm:order-none basis-full sm:basis-auto flex-1 max-w-none sm:max-w-md relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder={t('HomePage.searchPlaceholder')}
                className="w-full pl-8 pr-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                value={filters.q || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="text-xs text-secondary-500 whitespace-nowrap hidden sm:block">
                <span className="font-semibold text-secondary-900">{total}</span>
              </div>
              
              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-0.5 bg-secondary-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-1.5 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors lg:hidden"
              >
                <Filter className="w-4 h-4 text-secondary-700" />
              </button>
              
              <a href={mapPageHref} className="p-1.5 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-secondary-700" />
                <span className="hidden sm:inline text-sm font-medium text-secondary-700">{t('Navigation.map')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {showFilters && (
          <div className="lg:hidden mb-4 bg-white rounded-xl border border-secondary-200 p-4 shadow-sm">
            {filtersContent}
          </div>
        )}

        <div className="flex gap-4">
          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 bg-white rounded-xl border border-secondary-200 p-4 shadow-sm max-h-[calc(100vh-100px)] overflow-y-auto">
                {filtersContent}
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={gridClass}>
                {[...Array(8)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-secondary-200">
                <div className="bg-red-50 p-4 rounded-full inline-block mb-4">
                  <Building2 className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">Ошибка при загрузке</h3>
                <p className="text-secondary-500 mb-6">{error}</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => fetchProperties()}
                    className="btn btn-primary"
                  >
                    Повторить попытку
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="btn btn-secondary"
                  >
                    Очистить фильтры
                  </button>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-secondary-200">
                <div className="bg-secondary-50 p-4 rounded-full inline-block mb-4">
                  <Building2 className="w-12 h-12 text-secondary-400" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">Объекты не найдены</h3>
                <p className="text-secondary-500">Попробуйте изменить параметры поиска или сбросить фильтры</p>
                <button onClick={clearFilters} className="btn btn-outline mt-6">
                  Сбросить все фильтры
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
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn btn-secondary w-10 h-10 p-0 rounded-full flex items-center justify-center disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="flex items-center px-4 font-medium text-secondary-600">
                      Страница {page} из {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn btn-secondary w-10 h-10 p-0 rounded-full flex items-center justify-center disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ComparisonButton />
    </div>
  )
}
