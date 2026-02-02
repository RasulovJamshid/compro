'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronRight, X, List, MapPin, ArrowLeft } from 'lucide-react'
import MapView from '@/components/map/MapView'
import PropertyCard from '@/components/properties/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false)
  const [showFilterSidebar, setShowFilterSidebar] = useState(true)
  const [showListSidebar, setShowListSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const [searchAsMove, setSearchAsMove] = useState(true)
  const [hasMoved, setHasMoved] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([])
  const [mapBounds, setMapBounds] = useState<any>(null)
  const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({
    center: [41.2995, 69.2401],
    zoom: 12
  })
  const boundsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchedBoundsRef = useRef<string>('')
  const mapBoundsRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const propertiesRef = useRef(properties)
  const router = useRouter()

  // Handle responsive check safely
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    propertiesRef.current = properties
  }, [properties])

  useEffect(() => {
    // When new properties arrive, align visibleProperties with the latest known bounds.
    const bounds = mapBoundsRef.current
    if (!bounds) {
      // Very initial state before we know bounds
      setVisibleProperties(properties)
      return
    }

    const filtered = properties.filter((p) =>
      bounds.contains([p.latitude, p.longitude])
    )
    setVisibleProperties(filtered)
  }, [properties])

  useEffect(() => {
    // If filters change, always fetch
    fetchPropertiesWithBounds()
  }, [filters])

  useEffect(() => {
    // Only auto-fetch on bounds change if toggle is on
    if (searchAsMove) {
      fetchPropertiesWithBounds()
      setHasMoved(false)
    } else if (initialLoadCompleted) {
      setHasMoved(true)
    }
  }, [mapBounds])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (boundsTimerRef.current) {
        clearTimeout(boundsTimerRef.current)
      }
    }
  }, [])

  const fetchPropertiesWithBounds = async () => {
    // Do not call API until we actually know the map bounds
    if (!mapBounds) {
      return
    }

    // Create a cache key that includes both bounds and current filters
    const boundsPart = `${mapBounds.getNorth().toFixed(4)},${mapBounds.getEast().toFixed(4)},${mapBounds.getSouth().toFixed(4)},${mapBounds.getWest().toFixed(4)}`
    const filtersPart = JSON.stringify(filters || {})
    const cacheKey = `${boundsPart}|${filtersPart}`

    // Skip if we already fetched for these bounds + filters
    if (cacheKey === lastFetchedBoundsRef.current) {
      return
    }

    setLoading(true)
    try {
      const data = await getProperties({
        ...filters,
        minLat: mapBounds.getSouth(),
        maxLat: mapBounds.getNorth(),
        minLng: mapBounds.getWest(),
        maxLng: mapBounds.getEast(),
        limit: 500 // Higher limit for map view
      })
      setProperties(data.items || [])
      lastFetchedBoundsRef.current = cacheKey
      setInitialLoadCompleted(true)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleBoundsChange = useCallback((bounds: any, center: [number, number], zoom: number) => {
    if (!bounds) return

    // Clear existing timer
    if (boundsTimerRef.current) {
      clearTimeout(boundsTimerRef.current)
    }

    // Debounce updating mapBounds + mapState (which will in turn trigger API + effect-based filtering)
    boundsTimerRef.current = setTimeout(() => {
      mapBoundsRef.current = bounds
      setMapBounds(bounds)
      setMapState({ center, zoom })
    }, 500)
  }, []) // Empty dependency array - stable callback!

  // Auto-center map when a property is selected from the list
  useEffect(() => {
    if (selectedProperty) {
      setMapState({
        center: [selectedProperty.latitude, selectedProperty.longitude],
        zoom: 16
      })
    }
  }, [selectedProperty])

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  // Trigger map resize when sidebars change
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 350) // After sidebar transition completes
    return () => clearTimeout(timer)
  }, [showFilterSidebar, showListSidebar])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-secondary-50 font-sans">

      {/* Background Map - Hidden on mobile if mobileView is 'list' */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${mobileView === 'list' ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
        <MapView
          properties={visibleProperties}
          center={mapState.center}
          zoom={mapState.zoom}
          onMarkerClick={(property) => {
            router.push(`/properties/${property.id}`)
          }}
          onBoundsChange={handleBoundsChange}
          selectedPropertyId={selectedProperty?.id}
        />
      </div>

      {/* Mobile Toggle Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center p-1 bg-secondary-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl scale-110 active:scale-100 transition-transform">
        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${mobileView === 'map' ? 'bg-white text-secondary-900' : 'text-white/60'}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Карта
        </button>
        <button
          onClick={() => {
            setMobileView('list')
            setShowListSidebar(true)
          }}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${mobileView === 'list' ? 'bg-white text-secondary-900' : 'text-white/60'}`}
        >
          <List className="w-3.5 h-3.5" />
          Список
        </button>
      </div>

      {/* Glassmorphic Header / Controls Area */}
      <div className={`absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none gap-2 transition-opacity duration-300 ${isMobile && (showFilterSidebar || mobileView === 'list') ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          <button
            onClick={() => router.push('/')}
            className="h-10 md:h-11 px-3 md:px-4 bg-white/90 backdrop-blur-md border border-white shadow-soft rounded-xl flex items-center gap-2 text-secondary-900 hover:bg-white transition-all group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs md:text-sm font-semibold tracking-tight hidden sm:inline">Назад</span>
          </button>

          {!showFilterSidebar && (
            <button
              onClick={() => setShowFilterSidebar(true)}
              className="h-10 md:h-11 px-3 md:px-4 bg-white/90 backdrop-blur-md border border-white shadow-soft rounded-xl flex items-center gap-2 text-secondary-900 hover:bg-white transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs md:text-sm font-semibold tracking-tight hidden sm:inline">Фильтры</span>
            </button>
          )}
        </div>

        {/* Top Center: Search Controls - Adjusted for mobile */}
        <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto max-w-[280px] sm:max-w-none transition-all ${mobileView === 'list' ? 'opacity-0 scale-95 pointer-events-none md:opacity-100 md:scale-100 md:pointer-events-auto' : ''}`}>
          <div className="bg-white/90 backdrop-blur-md border border-white shadow-soft rounded-full px-4 py-1.5 flex items-center gap-3 md:gap-4 w-fit mx-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-secondary-900">{visibleProperties.length}</span>
              <span className="text-[10px] md:text-[11px] font-medium text-secondary-500 uppercase tracking-wider hidden xs:inline">Объектов</span>
            </div>
            <div className="w-px h-4 bg-secondary-200" />
            <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={searchAsMove}
                  onChange={(e) => setSearchAsMove(e.target.checked)}
                />
                <div className="w-8 h-4 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-600"></div>
              </div>
              <span className="text-[9px] md:text-[11px] font-semibold text-secondary-700 uppercase tracking-wider group-hover:text-primary-600 transition-colors">Авто-поиск</span>
            </label>
          </div>

          {hasMoved && !searchAsMove && (
            <button
              onClick={() => {
                fetchPropertiesWithBounds()
                setHasMoved(false)
              }}
              className="px-4 md:px-6 py-2 bg-primary-600 text-white text-[11px] md:text-sm font-bold rounded-full shadow-glow hover:bg-primary-700 transition-all animate-in fade-in slide-in-from-top-2 active:scale-95"
            >
              Искать в этой области
            </button>
          )}
        </div>

        <div className="pointer-events-auto hidden md:block">
          {!showListSidebar && (
            <button
              onClick={() => setShowListSidebar(true)}
              className="h-11 px-4 bg-white/90 backdrop-blur-md border border-white shadow-soft rounded-xl flex items-center gap-2 text-secondary-900 hover:bg-white transition-all active:scale-95"
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-tight">Список</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Left Panel - Filters - Responsive adaptation */}
      <div
        className={`absolute top-0 md:top-20 left-0 md:left-4 bottom-0 md:bottom-8 z-50 w-full md:w-80 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilterSidebar ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full md:-translate-x-[110%] opacity-0 pointer-events-none'
          }`}
      >
        <div className="h-full bg-white md:bg-white/90 md:backdrop-blur-md border-x md:border border-white/50 shadow-2xl md:rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => router.push('/')}
                  className="p-1.5 -ml-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-base font-bold text-secondary-900">Фильтры</h2>
            </div>
            <button
              onClick={() => setShowFilterSidebar(false)}
              className="p-1.5 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar">
            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Ключевое слово</label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Название или описание"
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary-50/50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={filters.q || ''}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                />
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Бюджет (сум)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="От"
                  className="w-full px-4 py-2.5 bg-secondary-50/50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="До"
                  className="w-full px-4 py-2.5 bg-secondary-50/50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Тип сделки</label>
              <div className="flex p-1 bg-secondary-100 rounded-xl">
                <button
                  onClick={() => handleFilterChange('dealType', '')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!filters.dealType ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  Все
                </button>
                <button
                  onClick={() => handleFilterChange('dealType', 'rent')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.dealType === 'rent' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  Аренда
                </button>
                <button
                  onClick={() => handleFilterChange('dealType', 'sale')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.dealType === 'sale' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  Продажа
                </button>
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Тип объекта</label>
              <div className="space-y-1.5">
                {['office', 'warehouse', 'shop'].map((type) => (
                  <label key={type} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary-50 cursor-pointer transition-colors border border-transparent hover:border-secondary-200">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-md border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                      checked={filters.propertyType === type}
                      onChange={(e) => handleFilterChange('propertyType', e.target.checked ? type : '')}
                    />
                    <span className="text-sm font-medium text-secondary-700 capitalize">
                      {type === 'office' ? 'Офис' : type === 'warehouse' ? 'Склад' : 'Магазин'}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Расположение</label>
              <div className="space-y-2">
                <select
                  className="w-full px-4 py-2.5 bg-secondary-50/50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")` }}
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <option value="">Все города</option>
                  <option value="Ташкент">Ташкент</option>
                  <option value="Самарканд">Самарканд</option>
                </select>
                <select
                  className="w-full px-4 py-2.5 bg-secondary-50/50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")` }}
                  value={filters.district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                >
                  <option value="">Все районы</option>
                  <option value="Мирзо-Улугбекский">Мирзо-Улугбекский</option>
                  <option value="Мирабадский">Мирабадский</option>
                </select>
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold text-secondary-400 mb-3 block uppercase tracking-widest">Особенности</label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-secondary-50/50 border border-secondary-100 hover:border-primary-200 cursor-pointer transition-all">
                  <span className="text-sm font-medium text-secondary-700">Проверенные</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500/20"
                    checked={!!filters.isVerified}
                    onChange={(e) => handleFilterChange('isVerified', e.target.checked || undefined)}
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-secondary-50/50 border border-secondary-100 hover:border-primary-200 cursor-pointer transition-all">
                  <span className="text-sm font-medium text-secondary-700">С видео</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500/20"
                    checked={!!filters.hasVideo}
                    onChange={(e) => handleFilterChange('hasVideo', e.target.checked || undefined)}
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-secondary-50/50 border border-secondary-100 hover:border-primary-200 cursor-pointer transition-all">
                  <span className="text-sm font-medium text-secondary-700">3D-Тур</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500/20"
                    checked={!!filters.hasTour360}
                    onChange={(e) => handleFilterChange('hasTour360', e.target.checked || undefined)}
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="p-5 pb-24 md:pb-5 border-t border-secondary-100 bg-secondary-50/30">
            <button
              onClick={clearFilters}
              className="w-full py-2.5 text-sm font-bold text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-xl border border-secondary-200 shadow-sm transition-all active:scale-[0.98]"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Floating Right Panel - List - Hidden on mobile if mobileView is 'map' */}
      <div
        className={`absolute top-0 md:top-20 right-0 md:right-4 bottom-0 md:bottom-8 z-30 w-full md:w-96 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showListSidebar && (!isMobile || mobileView === 'list')
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full md:translate-x-[110%] opacity-0 pointer-events-none'
          }`}
      >
        <div className="h-full bg-white md:bg-white/90 md:backdrop-blur-md border-x md:border border-white/50 shadow-2xl md:rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-secondary-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => router.push('/')}
                  className="p-1.5 -ml-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-base font-bold text-secondary-900">{visibleProperties.length} результатов</h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {filters.city || 'Узбекистан'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isMobile && (
                <button
                  onClick={() => setShowFilterSidebar(true)}
                  className="p-1.5 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => {
                  if (isMobile) {
                    setMobileView('map')
                  } else {
                    setShowListSidebar(false)
                  }
                }}
                className="p-1.5 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {!initialLoadCompleted && loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-secondary-500">Поиск лучших объектов...</p>
              </div>
            ) : visibleProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-secondary-300" />
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-2">Ничего не найдено</h3>
                <p className="text-sm text-secondary-500">Попробуйте изменить масштаб или сбросить фильтры</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {visibleProperties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setHoveredProperty(property)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => setSelectedProperty(property)}
                    className={`group relative transition-all duration-300 rounded-2xl ${hoveredProperty?.id === property.id ? 'scale-[1.02] z-10' : ''
                      }`}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl opacity-0 blur transition-opacity duration-300 ${selectedProperty?.id === property.id ? 'opacity-20' : ''
                      }`} />
                    <div className={`relative bg-white rounded-2xl border transition-all duration-300 shadow-sm ${selectedProperty?.id === property.id
                      ? 'border-primary-500 shadow-lg shadow-primary-500/10'
                      : 'border-secondary-100 hover:border-primary-200 hover:shadow-md'
                      }`}>
                      <PropertyCard property={property} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Bottom Loading Line */}
      {loading && initialLoadCompleted && (
        <div className="absolute bottom-0 left-0 right-0 h-1 z-50 bg-primary-100/30 overflow-hidden">
          <div className="h-full w-1/3 bg-primary-600 animate-[loading-slide_1.5s_infinite_linear]" />
        </div>
      )}

      <style jsx global>{`
        @keyframes loading-slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(300%); }
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}
