'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Square, DollarSign, Video, Eye, CheckCircle2, Heart } from 'lucide-react'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
}

const propertyTypeLabels: Record<string, string> = {
  office: 'Офис',
  warehouse: 'Склад',
  shop: 'Магазин',
  cafe_restaurant: 'Кафе/Ресторан',
  industrial: 'Промышленный',
  salon: 'Салон',
  recreation: 'База отдыха',
  other: 'Другое',
}

const dealTypeLabels: Record<string, string> = {
  rent: 'Аренда',
  sale: 'Продажа',
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images?.find(img => img.isCover) || property.images?.[0]

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Placeholder for favorite logic
    console.log('Toggle favorite')
  }

  return (
    <Link href={`/properties/${property.id}`} className="group block bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 bg-secondary-100 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.watermarkedUrl || coverImage.url}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-300">
            <Square className="h-12 w-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-primary-600 text-white rounded-lg shadow-sm uppercase tracking-wider inline-block w-fit">
            {dealTypeLabels[property.dealType]}
          </span>
          {property.hasVideo && (
            <span className="px-2.5 py-1 text-xs font-medium bg-black/60 backdrop-blur-md text-white rounded-lg flex items-center gap-1.5 w-fit">
              <Video className="h-3.5 w-3.5" />
              Видео
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-secondary-400 hover:text-primary-600 hover:bg-white shadow-sm transition-all active:scale-90"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Bottom Price inside image area for visual impact */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="text-white">
            <div className="text-2xl font-extrabold drop-shadow-lg tracking-tight">
              {property.price.toLocaleString('ru-RU')} <span className="text-base font-semibold opacity-90 font-sans">сум{property.dealType === 'rent' ? '/мес' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-secondary-500 bg-secondary-100 px-2 py-1 rounded-md">
            {propertyTypeLabels[property.propertyType]}
          </div>
          {property.isVerified && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Проверено
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-secondary-900 group-hover:text-primary-600 transition-colors leading-snug h-[3.5rem]">
          {property.title}
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-2.5 text-sm text-secondary-600">
            <MapPin className="h-4 w-4 text-secondary-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{property.address || `${property.district}, ${property.city}`}</span>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
            <div className="flex items-center gap-2 text-sm text-secondary-700 font-semibold bg-secondary-50 px-3 py-1.5 rounded-lg">
              <Square className="h-4 w-4 text-primary-500" />
              <span>{property.area} м²</span>
            </div>
            {property.viewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-500 ml-auto">
                <Eye className="h-4 w-4" />
                <span>{property.viewCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
