'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import Tour360RoomsSection, {
  buildVirtualTourPayload,
  type TourRoomNode,
} from '@/components/dashboard/Tour360RoomsSection'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'office',
    dealType: 'rent',
    area: '',
    price: '',
    pricePerMonth: '',
    hasCommission: false,
    city: '',
    district: '',
    address: '',
    latitude: '',
    longitude: '',
    floor: '',
    totalFloors: '',
    hasParking: false,
    parkingSpaces: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [tourNodes, setTourNodes] = useState<TourRoomNode[]>([])
  const [tour360Url, setTour360Url] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImagesToServer = async (): Promise<any[]> => {
    const uploadedImages = []
    
    for (const file of imageFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const { data } = await apiClient.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        uploadedImages.push({
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          isCover: uploadedImages.length === 0
        })
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    
    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (tourNodes.some((n) => n.uploading)) {
        setError('Дождитесь окончания загрузки 360° панорам')
        return
      }

      // Upload regular images
      const uploadedImages = await uploadImagesToServer()

      const tourPayload = buildVirtualTourPayload(tourNodes)
      const urlTrim = tour360Url.trim()

      // Prepare property data
      const propertyData = {
        ...formData,
        area: parseFloat(formData.area),
        price: parseFloat(formData.price),
        pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : undefined,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : undefined,
        virtualTourConfig: tourPayload.virtualTourConfig,
        panorama360Id: tourPayload.panorama360Id,
        hasTour360: tourPayload.hasTour360FromUploads || !!urlTrim,
        tour360Url: urlTrim || undefined,
        images: uploadedImages,
        hasVideo: false,
        isVerified: false,
        isTop: false,
        status: 'pending',
      }

      await apiClient.post('/admin/properties', propertyData)
      router.push('/dashboard/properties')
    } catch (error: any) {
      console.error('Failed to create property:', error)
      setError(error.response?.data?.message || 'Не удалось создать объект')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </Link>
        <h1 className="text-3xl font-bold text-secondary-900">Добавить объект</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Основная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Название *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Тип объекта *
              </label>
              <select
                name="propertyType"
                required
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="office">Офис</option>
                <option value="warehouse">Склад</option>
                <option value="shop">Магазин</option>
                <option value="cafe_restaurant">Кафе/Ресторан</option>
                <option value="industrial">Промышленное</option>
                <option value="salon">Салон</option>
                <option value="recreation">Развлечения</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Тип сделки *
              </label>
              <select
                name="dealType"
                required
                value={formData.dealType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="rent">Аренда</option>
                <option value="sale">Продажа</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Площадь (м²) *
              </label>
              <input
                type="number"
                name="area"
                required
                step="0.01"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Цена *
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {formData.dealType === 'rent' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Цена в месяц
                </label>
                <input
                  type="number"
                  name="pricePerMonth"
                  value={formData.pricePerMonth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasCommission"
                id="hasCommission"
                checked={formData.hasCommission}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="hasCommission" className="text-sm font-medium text-secondary-700">
                Есть комиссия
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Местоположение</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Город *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Район *
              </label>
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Адрес
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Широта *
              </label>
              <input
                type="number"
                name="latitude"
                required
                step="0.000001"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Долгота *
              </label>
              <input
                type="number"
                name="longitude"
                required
                step="0.000001"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        </div>

        {/* Building Details */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Детали здания</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Этаж
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Всего этажей
              </label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasParking"
                id="hasParking"
                checked={formData.hasParking}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="hasParking" className="text-sm font-medium text-secondary-700">
                Есть парковка
              </label>
            </div>

            {formData.hasParking && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Парковочных мест
                </label>
                <input
                  type="number"
                  name="parkingSpaces"
                  value={formData.parkingSpaces}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Media - Images */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Фотографии</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Загрузить фотографии
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                        Обложка
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Tour360RoomsSection
          nodes={tourNodes}
          setNodes={setTourNodes}
          tour360Url={tour360Url}
          onTour360UrlChange={setTour360Url}
          onUploadError={setError}
        />

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Контактная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Контактное лицо
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/properties"
            className="px-6 py-3 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={loading || tourNodes.some((n) => n.uploading)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(loading || tourNodes.some((n) => n.uploading)) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {loading ? 'Создание...' : 'Создать объект'}
          </button>
        </div>
      </form>
    </div>
  )
}
