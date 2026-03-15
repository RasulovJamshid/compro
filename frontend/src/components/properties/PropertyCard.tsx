'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Square, Heart, View } from 'lucide-react'
import type { Property } from '@/lib/types'

import { useTranslations } from 'next-intl'

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact'
}

export default function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const t = useTranslations('Property')
  const coverImage = property.images?.find(img => img.isCover) || property.images?.[0]
  
  // Assume property might have a 360 view (you can adjust the field name based on actual data)
  const has360View = (property as any).has360View || (property as any).virtualTourUrl

  const propertyTypeLabels: Record<string, string> = {
    office: t('office'),
    warehouse: t('warehouse'),
    shop: t('shop'),
    cafe_restaurant: t('cafeRestaurant'),
    industrial: t('industrial'),
    salon: t('salon'),
    recreation: t('recreation'),
    other: t('other'),
  }

  const dealTypeLabels: Record<string, string> = {
    rent: t('rent'),
    sale: t('sale'),
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Placeholder for favorite logic
    console.log('Toggle favorite')
  }

  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <Link href={`/properties/${property.id}`} className="group flex overflow-hidden card card-hover">
        {/* Image - Left Side */}
        <div className="relative w-32 min-w-[8rem] bg-secondary-100 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage.watermarkedUrl || coverImage.url}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-300">
              <Square className="h-6 w-6" />
            </div>
          )}
          {has360View && (
            <div className="absolute top-2 left-2 badge badge-primary">
              <View className="w-2.5 h-2.5" />
              360°
            </div>
          )}
        </div>

        {/* Content - Right Side */}
        <div className="p-3 flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className="text-xs font-bold text-secondary-500 bg-secondary-50 px-2 py-0.5 rounded uppercase tracking-wider">
              {dealTypeLabels[property.dealType]}
            </span>
            <button
              onClick={handleFavoriteClick}
              className="text-secondary-400 hover:text-red-500 transition-colors active:scale-90"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
          
          <h3 className="text-sm font-bold text-secondary-900 line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-base font-extrabold text-primary-700">
              {property.price.toLocaleString('ru-RU')}
            </span>
            <span className="text-[10px] text-secondary-500 font-medium">
              {t('currency')}{property.dealType === 'rent' ? `/${t('month')}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-secondary-500 mb-2 truncate">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{property.district}, {property.city}</span>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-secondary-700">
            <span>{property.area} м²</span>
            <div className="w-1 h-1 rounded-full bg-secondary-300" />
            <span className="truncate text-secondary-500">{propertyTypeLabels[property.propertyType]}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default Grid View
  return (
    <Link href={`/properties/${property.id}`} className="group flex flex-col overflow-hidden card card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary-100 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.watermarkedUrl || coverImage.url}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-300">
            <Square className="h-8 w-8" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="badge badge-white text-secondary-900">
            {dealTypeLabels[property.dealType]}
          </span>
          {has360View && (
            <span className="badge badge-primary">
              <View className="w-3 h-3" />
              360°
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full text-secondary-400 hover:text-red-500 transition-colors active:scale-90 shadow-sm"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-bold text-secondary-900">
            {property.price.toLocaleString('ru-RU')}
          </span>
          <span className="text-xs text-secondary-500 font-medium">
            {t('currency')}{property.dealType === 'rent' ? `/${t('month')}` : ''}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-secondary-900 line-clamp-1 mb-1.5 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <div className="flex items-center gap-1.5 text-xs text-secondary-500 mb-4">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{property.address || `${property.district}, ${property.city}`}</span>
        </div>

        {/* Footer info */}
        <div className="mt-auto flex items-center gap-3 text-sm font-medium text-secondary-700">
          <div className="flex items-center gap-1 bg-secondary-50 px-2.5 py-1 rounded-md">
            <span>{property.area} м²</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary-50 px-2.5 py-1 rounded-md text-secondary-500">
            {propertyTypeLabels[property.propertyType]}
          </div>
        </div>
      </div>
    </Link>
  )
}
