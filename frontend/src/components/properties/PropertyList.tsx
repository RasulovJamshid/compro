'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property } from '@/lib/types'
import { useTranslations } from 'next-intl'

interface PropertyListProps {
  limit?: number
  variant?: 'default' | 'compact'
  className?: string
}

export default function PropertyList({
  limit = 8,
  variant = 'default',
  className,
}: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()
  const gridClassName = className || 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties({ limit })
        setProperties(data.items || [])
      } catch (error) {
        console.error('Failed to fetch properties:', error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [limit])

  if (loading) {
    return (
      <div className={gridClassName}>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm ring-1 ring-secondary-100 overflow-hidden animate-pulse">
            <div className="h-48 sm:h-56 bg-secondary-100/50"></div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-5 bg-secondary-100/60 rounded-md w-24"></div>
                <div className="h-5 bg-secondary-100/60 rounded-md w-16"></div>
              </div>
              <div className="h-6 bg-secondary-100/60 rounded-md w-full"></div>
              <div className="h-5 bg-secondary-100/60 rounded-md w-3/4"></div>
              <div className="flex justify-between pt-4 border-t border-secondary-50">
                <div className="h-8 bg-secondary-100/60 rounded-lg w-20"></div>
                <div className="h-8 bg-secondary-100/60 rounded-lg w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('PropertiesPage.noProperties')}</p>
      </div>
    )
  }

  return (
    <div className={gridClassName}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} variant={variant} />
      ))}
    </div>
  )
}
