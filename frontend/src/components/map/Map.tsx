'use client'

import { useEffect, useRef, memo } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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
    // Match visual like: "UZS 2 810 205"
    return 'UZS ' + price.toLocaleString('ru-RU')
  }

  const createPriceIcon = (price: number, isSelected: boolean = false) => {
    const formattedPrice = price >= 1000000 
      ? (price / 1000000).toFixed(1) + ' млн'
      : (price / 1000).toFixed(0) + ' т.'
    
    const bgColor = isSelected ? '#1d4ed8' : '#FFFFFF'
    const textColor = isSelected ? '#FFFFFF' : '#1e293b'
    const borderColor = isSelected ? '#FFFFFF' : '#e2e8f0'
    const boxShadow = isSelected
      ? '0 10px 15px -3px rgba(29, 78, 216, 0.3), 0 4px 6px -2px rgba(29, 78, 216, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'

    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div style="transform: translate(-50%, -50%);">
          <div style="
            background-color: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 6px 12px;
            border-radius: 99px;
            box-shadow: ${boxShadow};
            font-weight: 800;
            font-size: 13px;
            letter-spacing: -0.01em;
            white-space: nowrap;
            cursor: pointer;
            position: relative;
            z-index: ${isSelected ? '1000' : '500'};
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 4px;
            width: 100px;
          ">
            ${isSelected ? '<span style="width: 6px; height: 6px; background: white; border-radius: 50%;"></span>' : ''}
            ${formattedPrice}
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
            click: () => onMarkerClick?.(property),
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
            offset={[0, -28]}
            className="!p-0 !border-none"
          >
            <div className="px-3 py-2 bg-white rounded-xl shadow-lg border border-secondary-200 min-w-[180px] max-w-[220px]">
              <div className="text-[11px] font-semibold text-secondary-900 mb-0.5 line-clamp-1">
                {property.title}
              </div>
              <div className="text-[13px] font-bold text-primary-700 mb-0.5">
                {property.price.toLocaleString('ru-RU')}{' '}
                <span className="text-[10px] font-normal text-secondary-500">сум</span>
              </div>
              <div className="text-[11px] text-secondary-600 line-clamp-1">
                {property.district}, {property.city}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
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
