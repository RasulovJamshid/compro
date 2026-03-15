'use client'

import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, List, MapPin, ArrowLeft, SlidersHorizontal } from 'lucide-react'
import MapView from '@/components/map/MapView'
import PropertyCard from '@/components/properties/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'
import { useTranslations } from 'next-intl'
import PropertyFilterDrawer from '@/components/properties/PropertyFilterDrawer'

function MapPageContent() {
  const tMap = useTranslations('Map')
  const tFilters = useTranslations('Filters')
  const t = useTranslations()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showListSidebar, setShowListSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const [searchAsMove, setSearchAsMove] = useState(true)
  const [hasMoved, setHasMoved] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([])
  const [totalProperties, setTotalProperties] = useState(0)
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
  const searchParams = useSearchParams()

  // Handle responsive check safely
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const parsedFilters: PropertyFilters = {}

    const q = searchParams.get('q')
    if (q) parsedFilters.q = q

    const dealType = searchParams.get('dealType')
    if (dealType) parsedFilters.dealType = dealType as PropertyFilters['dealType']

    const propertyType = searchParams.get('propertyType')
    if (propertyType) parsedFilters.propertyType = propertyType as PropertyFilters['propertyType']

    const city = searchParams.get('city')
    if (city) parsedFilters.city = city

    const district = searchParams.get('district')
    if (district) parsedFilters.district = district

    const minPrice = searchParams.get('minPrice')
    if (minPrice) parsedFilters.minPrice = Number(minPrice)

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) parsedFilters.maxPrice = Number(maxPrice)

    const minArea = searchParams.get('minArea')
    if (minArea) parsedFilters.minArea = Number(minArea)

    const maxArea = searchParams.get('maxArea')
    if (maxArea) parsedFilters.maxArea = Number(maxArea)

    const isVerified = searchParams.get('isVerified')
    if (isVerified === 'true') parsedFilters.isVerified = true

    const hasVideo = searchParams.get('hasVideo')
    if (hasVideo === 'true') parsedFilters.hasVideo = true

    const hasTour360 = searchParams.get('hasTour360')
    if (hasTour360 === 'true') parsedFilters.hasTour360 = true

    const buildingClass = searchParams.get('buildingClass')
    if (buildingClass) parsedFilters.buildingClass = buildingClass

    const minCeilingHeight = searchParams.get('minCeilingHeight')
    if (minCeilingHeight) parsedFilters.minCeilingHeight = Number(minCeilingHeight)

    const minPowerCapacity = searchParams.get('minPowerCapacity')
    if (minPowerCapacity) parsedFilters.minPowerCapacity = Number(minPowerCapacity)

    const propertyCondition = searchParams.get('propertyCondition')
    if (propertyCondition) parsedFilters.propertyCondition = propertyCondition

    const hasParking = searchParams.get('hasParking')
    if (hasParking === 'true') parsedFilters.hasParking = true

    const hasElevator = searchParams.get('hasElevator')
    if (hasElevator === 'true') parsedFilters.hasElevator = true

    const hasFireSafety = searchParams.get('hasFireSafety')
    if (hasFireSafety === 'true') parsedFilters.hasFireSafety = true

    if (Object.keys(parsedFilters).length > 0) {
      setFilters((prev) => (JSON.stringify(prev) === JSON.stringify(parsedFilters) ? prev : parsedFilters))
    }
  }, [searchParams])

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
      setTotalProperties(data.total || 0)
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

  const handleApplyFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
  }

  const buildListQuery = () => {
    const params = new URLSearchParams()

    if (filters.q) params.set('q', String(filters.q))
    if (filters.dealType) params.set('dealType', String(filters.dealType))
    if (filters.propertyType) params.set('propertyType', String(filters.propertyType))
    if (filters.city) params.set('city', String(filters.city))
    if (filters.district) params.set('district', String(filters.district))
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters.minArea) params.set('minArea', String(filters.minArea))
    if (filters.maxArea) params.set('maxArea', String(filters.maxArea))
    if (filters.isVerified) params.set('isVerified', 'true')
    if (filters.hasVideo) params.set('hasVideo', 'true')
    if (filters.hasTour360) params.set('hasTour360', 'true')

    return params.toString()
  }

  const goToListPage = () => {
    const query = buildListQuery()
    router.push(query ? `/properties?${query}` : '/properties')
  }

  // Trigger map resize when sidebars change
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 350) // After sidebar transition completes
    return () => clearTimeout(timer)
  }, [showListSidebar])

  const activeFilterCount = Object.entries(filters).filter(
    ([key, v]) => key !== 'q' && v !== undefined && v !== '' && v !== false
  ).length

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
      <div className="md:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-40 flex items-center p-0.5 bg-secondary-900/90 backdrop-blur-md rounded-full shadow-lg">
        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${mobileView === 'map' ? 'bg-white text-secondary-900' : 'text-white/60'}`}
        >
          <MapPin className="w-3 h-3" />
          Карта
        </button>
        <button
          onClick={() => {
            setMobileView('list')
            setShowListSidebar(true)
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${mobileView === 'list' ? 'bg-white text-secondary-900' : 'text-white/60'}`}
        >
          <List className="w-3 h-3" />
          Список
        </button>
      </div>

      {/* Top Controls */}
      <div className={`absolute left-3 right-3 z-40 flex flex-wrap items-center justify-between pointer-events-none gap-2 transition-all duration-300 ${isMobile && mobileView === 'list' ? 'opacity-0 pointer-events-none' : 'opacity-100'} top-3`}>
        {/* Left buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={goToListPage}
            className="btn btn-sm bg-white shadow-md text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 !rounded-full !px-4 !h-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Navigation.properties')}</span>
          </button>

          <button
            onClick={() => setShowFilterDrawer(true)}
            className="btn btn-sm bg-white shadow-md text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 !rounded-full !px-4 !h-10 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Filters.title')}</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Center: count + auto-search */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-white border border-secondary-200 shadow-md rounded-full px-4 py-2 flex items-center gap-3 text-xs sm:text-sm">
            <span className="font-bold text-secondary-900">{visibleProperties.length} {tMap('results')}</span>
            <div className="w-px h-4 bg-secondary-200" />
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[10px] sm:text-xs font-bold text-secondary-500 uppercase tracking-wider">Авто</span>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={searchAsMove}
                  onChange={(e) => setSearchAsMove(e.target.checked)}
                />
                <div className="w-8 h-4 bg-secondary-200 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-600"></div>
              </div>
            </label>
          </div>

          {hasMoved && !searchAsMove && (
            <button
              onClick={() => { fetchPropertiesWithBounds(); setHasMoved(false) }}
              className="btn btn-sm btn-primary !h-10 !px-5 !rounded-full"
            >
              Искать здесь
            </button>
          )}
        </div>

        {/* Right buttons */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5">
          {!showListSidebar && (
            <button
              onClick={() => setShowListSidebar(true)}
              className="btn btn-sm bg-white shadow-md text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 !rounded-full !px-4 !h-10"
            >
              <List className="w-4 h-4" />
              <span>Список</span>
            </button>
          )}
        </div>
      </div>

      <PropertyFilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
        onClear={clearFilters}
        resultsCount={totalProperties}
      />

      {/* Right Panel - List */}
      <div
        className={`absolute top-0 md:top-3 right-0 md:right-3 bottom-0 md:bottom-3 z-30 w-full md:w-[400px] transition-transform duration-300 ${showListSidebar && (!isMobile || mobileView === 'list')
          ? 'translate-x-0'
          : 'translate-x-full md:translate-x-[110%]'
          }`}
      >
        <div className="h-full bg-white md:bg-white/95 md:backdrop-blur-xl md:border border-secondary-200 shadow-2xl md:rounded-2xl flex flex-col overflow-hidden ring-1 ring-black/5">
          <div className="px-5 py-4 border-b border-secondary-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setMobileView('map')}
                  aria-label={tMap('backToMap')}
                  className="p-1.5 -ml-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-base font-bold text-secondary-900">{visibleProperties.length} {tMap('results')}</h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,126,217,0.8)]" />
                  {filters.city || tMap('uzbekistan')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isMobile && (
                <button
                  onClick={() => setShowFilterDrawer(true)}
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
                className="p-1.5 hover:bg-secondary-100 rounded-full transition-colors text-secondary-500 bg-secondary-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 bg-secondary-50/30">
            {!initialLoadCompleted && loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin shadow-sm" />
                <p className="text-sm font-medium text-secondary-500">{tMap('searching')}</p>
              </div>
            ) : visibleProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-white shadow-sm border border-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-secondary-300" />
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-2">{tMap('nothingFound')}</h3>
                <p className="text-sm text-secondary-500">{tMap('tryChange')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-20 md:pb-4">
                {visibleProperties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setHoveredProperty(property)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => setSelectedProperty(property)}
                    className="cursor-pointer block"
                  >
                    <div className={`rounded-xl transition-all duration-300 ${selectedProperty?.id === property.id
                      ? 'ring-2 ring-primary-500 shadow-elevated transform -translate-y-0.5'
                      : 'border border-transparent'
                      }`}>
                      <PropertyCard property={property} variant="compact" />
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
          width: 4px;
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

export default function MapPage() {
  const tMap = useTranslations('Map')

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-secondary-500 uppercase tracking-widest">{tMap('loadingMap')}</p>
          </div>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  )
}
