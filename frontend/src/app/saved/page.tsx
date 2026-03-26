'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getSavedProperties } from '@/lib/api/properties'
import type { Property } from '@/lib/types'

export default function SavedPropertiesPage() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      router.replace('/auth/login')
      return
    }

    fetchSavedProperties()
  }, [isAuthenticated, isLoading, router])

  const fetchSavedProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getSavedProperties()
      setProperties(data || [])
    } catch (error) {
      console.error('Failed to fetch saved properties:', error)
      setProperties([])
      setError('Не удалось загрузить сохраненные объекты. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
          <p className="text-sm text-secondary-600">Проверяем ваш аккаунт...</p>
        </div>
      </div>
    )
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
        ) : error ? (
          <div className="card max-w-xl mx-auto text-center">
            <div className="p-8">
              <Heart className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                Не удалось открыть избранное
              </h2>
              <p className="text-secondary-500 mb-6">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={fetchSavedProperties}
                  className="btn btn-md btn-primary"
                >
                  Повторить
                </button>
                <button
                  onClick={() => router.push('/properties')}
                  className="btn btn-md btn-outline"
                >
                  Перейти к объектам
                </button>
              </div>
            </div>
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
              className="btn btn-lg btn-primary"
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
