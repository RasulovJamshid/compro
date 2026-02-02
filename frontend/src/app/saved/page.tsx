'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getSavedProperties } from '@/lib/api/properties'
import type { Property } from '@/lib/types'

export default function SavedPropertiesPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchSavedProperties()
  }, [isAuthenticated, router])

  const fetchSavedProperties = async () => {
    setLoading(true)
    try {
      const data = await getSavedProperties()
      setProperties(data || [])
    } catch (error) {
      console.error('Failed to fetch saved properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold">Сохраненные объекты</h1>
          </div>
          <p className="text-gray-600">
            Ваши избранные объекты недвижимости
          </p>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              У вас пока нет сохраненных объектов
            </h2>
            <p className="text-gray-500 mb-6">
              Начните добавлять объекты в избранное, чтобы не потерять их
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="btn btn-primary"
            >
              Перейти к объектам
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Сохранено: <span className="font-semibold">{properties.length}</span> объектов
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
