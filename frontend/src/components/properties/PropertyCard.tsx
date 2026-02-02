import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Square, DollarSign, Video, Eye, CheckCircle2 } from 'lucide-react'
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

  return (
    <Link href={`/properties/${property.id}`} className="card group block hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-secondary-100 overflow-hidden rounded-t-xl">
        {coverImage ? (
          <Image
            src={coverImage.watermarkedUrl || coverImage.url}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-300">
            <Square className="h-12 w-12" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-secondary-900 rounded-md shadow-sm">
            {dealTypeLabels[property.dealType]}
          </span>
          {property.hasVideo && (
            <span className="px-2 py-0.5 text-xs font-medium bg-black/50 backdrop-blur-sm text-white rounded-md flex items-center gap-1">
              <Video className="h-3 w-3" />
              Видео
            </span>
          )}
        </div>

        {property.isVerified && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-md shadow-sm flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Проверено
            </span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {propertyTypeLabels[property.propertyType]}
          </div>
          {property.viewCount > 0 && (
             <div className="flex items-center gap-1 text-xs text-secondary-400">
               <Eye className="h-3 w-3" />
               <span>{property.viewCount}</span>
             </div>
          )}
        </div>
        
        <h3 className="font-bold text-base mb-2 line-clamp-2 text-secondary-900 group-hover:text-primary-600 transition-colors leading-snug">
          {property.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm text-secondary-600">
            <MapPin className="h-3.5 w-3.5 text-secondary-400 flex-shrink-0" />
            <span className="truncate">{property.district}, {property.city}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
            <div className="flex items-center gap-1.5 text-sm text-secondary-700 font-medium">
              <Square className="h-3.5 w-3.5 text-secondary-400" />
              <span>{property.area} м²</span>
            </div>
            <div className="text-base font-bold text-primary-700">
              {property.price.toLocaleString('ru-RU')} <span className="text-xs font-normal text-secondary-500">сум</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
