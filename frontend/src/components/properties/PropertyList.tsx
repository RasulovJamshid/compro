'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './PropertyCard'
import { getProperties } from '@/lib/api/properties'
import type { Property } from '@/lib/types'

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-56 bg-secondary-200 rounded-t-2xl"></div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
                <div className="h-3 bg-secondary-200 rounded w-8"></div>
              </div>
              <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="flex justify-between pt-2">
                  <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                  <div className="h-5 bg-secondary-200 rounded w-1/3"></div>
                </div>
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
        <p className="text-gray-500">Объекты не найдены</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
