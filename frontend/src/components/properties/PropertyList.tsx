'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property } from '@/lib/types'
import { useTranslations } from 'next-intl'

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties({ limit: 8 })
        setProperties(data.items || [])
      } catch (error) {
        console.error('Failed to fetch properties:', error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="h-48 sm:h-56 bg-secondary-100"></div>
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-secondary-100 rounded-md w-16"></div>
                <div className="h-4 bg-secondary-100 rounded-md w-14"></div>
              </div>
              <div className="h-5 bg-secondary-100 rounded-md w-4/5"></div>
              <div className="h-4 bg-secondary-100 rounded-md w-3/5"></div>
              <div className="flex justify-between pt-3 border-t border-secondary-50">
                <div className="h-6 bg-secondary-100 rounded-md w-16"></div>
                <div className="h-4 bg-secondary-100 rounded-md w-10"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
