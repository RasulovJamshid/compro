'use client'

import { useEffect, useRef, memo } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Square, View, ExternalLink, Info } from 'lucide-react'
import type { Property } from '@/lib/types'

interface MapProps {
  properties: Property[]
  center: [number, number]
  zoom: number
  onMarkerClick?: (property: Property) => void
  onBoundsChange?: (bounds: L.LatLngBounds, center: [number, number], zoom: number) => void
  selectedPropertyId?: string
}

function MapEvents({ onBoundsChange }: { onBoundsChange?: (bounds: L.LatLngBounds, center: [number, number], zoom: number) => void }) {
  const map = useMap()
  const initialBoundsFired = useRef(false)
  
  useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      onBoundsChange?.(map.getBounds(), [center.lat, center.lng], map.getZoom())
    },
    zoomend: () => {
      const center = map.getCenter()
      onBoundsChange?.(map.getBounds(), [center.lat, center.lng], map.getZoom())
    }
  })
  
  // Trigger initial bounds once
  useEffect(() => {
    if (!initialBoundsFired.current) {
      initialBoundsFired.current = true
      setTimeout(() => {
        const center = map.getCenter()
        onBoundsChange?.(map.getBounds(), [center.lat, center.lng], map.getZoom())
      }, 100)
    }
  }, [map, onBoundsChange])
  
  // Handle window resize to fix map rendering when sidebars toggle
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [map])
  
  return null
}

function Map({ properties, center, zoom, onMarkerClick, onBoundsChange, selectedPropertyId }: MapProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) return (price / 1000000).toLocaleString('ru-RU') + ' млн'
    return (price / 1000).toLocaleString('ru-RU') + ' т.'
  }

  const createPriceIcon = (price: number, isSelected: boolean = false) => {
    const formattedPrice = formatPrice(price)
    
    // Modern colors and styling
    const bgColor = isSelected ? '#2563eb' : '#ffffff' 
    const textColor = isSelected ? '#ffffff' : '#0f172a' 
    const borderColor = isSelected ? '#1d4ed8' : '#e2e8f0'
    const shadowOpacity = isSelected ? '0.2' : '0.1'
    
    const scale = isSelected ? 'scale(1.1)' : 'scale(1)'
    const zIndex = isSelected ? '1000' : '500'

    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div style="
          transform: translate(-50%, -100%) ${scale};
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: absolute;
          z-index: ${zIndex};
        ">
          <div style="
            background-color: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 6px 12px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, ${shadowOpacity}), 0 4px 6px -4px rgba(0, 0, 0, ${shadowOpacity});
            font-weight: 800;
            font-size: 13px;
            white-space: nowrap;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: -0.02em;
          ">
            ${formattedPrice}
            <!-- Small tail for the marker -->
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%) rotate(45deg);
              width: 8px;
              height: 8px;
              background-color: ${bgColor};
              border-right: 1px solid ${borderColor};
              border-bottom: 1px solid ${borderColor};
              z-index: -1;
            "></div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    })
  }

  return (
    <MapContainer
      key="map-main"
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <ZoomControl position="bottomleft" />
      <MapEvents onBoundsChange={onBoundsChange} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={createPriceIcon(property.price, property.id === selectedPropertyId)}
          eventHandlers={{
            click: () => {
              onMarkerClick?.(property)
            },
            mouseover: (e) => {
              e.target.openPopup()
            },
            mouseout: (e) => {
              e.target.closePopup()
            },
          }}
        >
          <Popup
            closeButton={false}
            offset={[0, -20]}
            className="property-map-popup"
            maxWidth={260}
          >
            <div className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-secondary-100/50 group">
              {/* Image Header */}
              <div className="relative h-28 w-full bg-secondary-100 overflow-hidden">
                {property.images?.[0] ? (
                  <img 
                    src={property.images[0].watermarkedUrl || property.images[0].url} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-300">
                    <Square className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex gap-1">
                  <span className="px-2 py-0.5 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-black text-secondary-900 uppercase shadow-sm">
                    {property.dealType === 'rent' ? 'Аренда' : 'Продажа'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-base font-black text-primary-600 leading-none">
                    {property.price.toLocaleString('ru-RU')}
                    <span className="text-[10px] font-bold text-secondary-400 ml-1 uppercase">UZS</span>
                  </div>
                  {property.hasTour360 && (
                    <div className="p-1 bg-primary-50 rounded-lg border border-primary-100">
                      <View className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                  )}
                </div>

                <h3 className="text-[11px] font-bold text-secondary-900 line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                  {property.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[10px] text-secondary-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-secondary-300" />
                  <span className="truncate">{property.district}, {property.city}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-secondary-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-secondary-700 bg-secondary-50 px-2 py-0.5 rounded-md">
                    {property.area} м²
                  </span>
                  <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1">
                    Клик для деталей <Info className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// Global styles for custom popup
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    .property-map-popup .leaflet-popup-content-wrapper {
      padding: 0 !important;
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
    }
    .property-map-popup .leaflet-popup-content {
      margin: 0 !important;
      width: 240px !important;
    }
    .property-map-popup .leaflet-popup-tip-container {
      display: none !important;
    }
  `
  document.head.appendChild(style)
}

// Memoize to prevent re-renders when center/zoom change
export default memo(Map, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  // Return false if props changed (do re-render)
  
  // Check if center/zoom changed (we want to update if they do, in case of remount)
  const centerChanged = prevProps.center[0] !== nextProps.center[0] || prevProps.center[1] !== nextProps.center[1]
  const zoomChanged = prevProps.zoom !== nextProps.zoom
  
  // Check if properties changed
  const prevIds = prevProps.properties.map(p => p.id).sort().join(',')
  const nextIds = nextProps.properties.map(p => p.id).sort().join(',')
  const propertiesChanged = prevIds !== nextIds
  const selectionChanged = prevProps.selectedPropertyId !== nextProps.selectedPropertyId
  
  // If ANY prop changed, we should potentially re-render
  // BUT: MapContainer ignores center/zoom updates after mount.
  // So we really only care about properties changing for the markers.
  // However, if we are remounting, we need new center/zoom. 
  // Since memo only prevents updates on existing instance, we can ignore center/zoom changes here
  // because if the instance persists, MapContainer ignores them anyway.
  
  return !(propertiesChanged || selectionChanged)
})
