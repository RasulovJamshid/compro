'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Building2, X, ChevronLeft, ChevronRight, Grid3x3, List, Filter } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'
import ComparisonButton from '@/components/comparison/ComparisonButton'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const limit = 12

  useEffect(() => {
    fetchProperties()
  }, [filters, page])

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
    try {
      const data = await getProperties({ ...filters, page, limit })
      setProperties(data.items || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  const gridClass = viewMode === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
    : 'flex flex-col gap-4'

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Ultra Compact Auto-Hide Header */}
      <div className={`bg-white border-b border-secondary-200 sticky top-16 z-40 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-secondary-900 whitespace-nowrap">Недвижимость</h1>
            
            {/* Inline Search */}
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                value={filters.q || ''}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="text-xs text-secondary-500 whitespace-nowrap hidden sm:block">
                <span className="font-semibold text-secondary-900">{total}</span> объектов
              </div>
              
              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-0.5 bg-secondary-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                  title="Сетка"
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                  title="Список"
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
              
              <a href="/map" className="p-1.5 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-secondary-700" />
                <span className="hidden sm:inline text-sm font-medium text-secondary-700">Карта</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 bg-white rounded-xl border border-secondary-200 p-4 shadow-sm max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-secondary-900 flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-primary-600" />
                    Фильтры
                  </h3>
                  <button onClick={clearFilters} className="text-xs text-secondary-500 hover:text-red-500 transition-colors">
                    Сбросить
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-secondary-700 mb-1.5">Тип сделки</label>
                    <select
                      className="input input-sm"
                      value={filters.dealType || ''}
                      onChange={(e) => handleFilterChange('dealType', e.target.value)}
                    >
                      <option value="">Все типы</option>
                      <option value="rent">Аренда</option>
                      <option value="sale">Продажа</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-secondary-700 mb-1.5">Тип объекта</label>
                    <select
                      className="input input-sm"
                      value={filters.propertyType || ''}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    >
                      <option value="">Все объекты</option>
                      <option value="office">Офис</option>
                      <option value="warehouse">Склад</option>
                      <option value="shop">Магазин</option>
                      <option value="cafe_restaurant">Кафе/Ресторан</option>
                      <option value="industrial">Производство</option>
                      <option value="salon">Салон</option>
                      <option value="recreation">Развлечения</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-secondary-700 mb-1.5">Город</label>
                    <select
                      className="input input-sm"
                      value={filters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                    >
                      <option value="">Все города</option>
                      <option value="Ташкент">Ташкент</option>
                      <option value="Самарканд">Самарканд</option>
                      <option value="Бухара">Бухара</option>
                      <option value="Хива">Хива</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-secondary-700 mb-1.5">Площадь (м²)</label>
                    <div className="flex gap-2">
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
                    <label className="block text-xs font-medium text-secondary-700 mb-1.5">Цена (сум)</label>
                    <div className="flex gap-2">
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

                  <div className="pt-3 border-t border-secondary-100 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                        checked={filters.isVerified || false}
                        onChange={(e) => handleFilterChange('isVerified', e.target.checked || undefined)}
                      />
                      <span className="text-sm text-secondary-700 group-hover:text-primary-600">Только проверенные</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                        checked={filters.hasVideo || false}
                        onChange={(e) => handleFilterChange('hasVideo', e.target.checked || undefined)}
                      />
                      <span className="text-sm text-secondary-700 group-hover:text-primary-600">С видео</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                        checked={filters.hasTour360 || false}
                        onChange={(e) => handleFilterChange('hasTour360', e.target.checked || undefined)}
                      />
                      <span className="text-sm text-secondary-700 group-hover:text-primary-600">С 3D-туром</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={gridClass}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-secondary-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
                      <div className="h-5 bg-secondary-200 rounded w-3/4"></div>
                      <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                      <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
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
