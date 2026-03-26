'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Box, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import type { Property } from '@/lib/types'

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingPanorama, setUploadingPanorama] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  
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
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [panoramaFile, setPanoramaFile] = useState<File | null>(null)
  const [panoramaPreview, setPanoramaPreview] = useState<string | null>(null)
  const [existingPanoramaId, setExistingPanoramaId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true)
      const { data } = await apiClient.get(`/properties/${id}`)
      setProperty(data)
      
      // Populate form with existing data
      setFormData({
        title: data.title || '',
        description: data.description || '',
        propertyType: data.propertyType || 'office',
        dealType: data.dealType || 'rent',
        area: data.area?.toString() || '',
        price: data.price?.toString() || '',
        pricePerMonth: data.pricePerMonth?.toString() || '',
        hasCommission: data.hasCommission || false,
        city: data.city || '',
        district: data.district || '',
        address: data.address || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        floor: data.floor?.toString() || '',
        totalFloors: data.totalFloors?.toString() || '',
        hasParking: data.hasParking || false,
        parkingSpaces: data.parkingSpaces?.toString() || '',
        contactName: data.contactName || '',
        contactPhone: data.contactPhone || '',
        contactEmail: data.contactEmail || '',
      })
      
      setExistingImages(data.images || [])
      setExistingPanoramaId(data.panorama360Id || null)
      
      // Show existing panorama preview if available
      if (data.tour360Url) {
        setPanoramaPreview(data.tour360Url)
      }
    } catch (error) {
      console.error('Failed to fetch property:', error)
      setError('Не удалось загрузить объект')
    } finally {
      setLoading(false)
    }
  }

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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handlePanoramaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение')
      return
    }

    setPanoramaFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPanoramaPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setExistingPanoramaId(null) // Clear existing if uploading new
  }

  const removePanorama = () => {
    setPanoramaFile(null)
    setPanoramaPreview(null)
    setExistingPanoramaId(null)
  }

  const uploadPanoramaToServer = async (): Promise<string | null> => {
    if (!panoramaFile) return null

    setUploadingPanorama(true)
    try {
      const formData = new FormData()
      formData.append('file', panoramaFile)

      const { data } = await apiClient.post('/panorama/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return data.panoramaId
    } catch (error) {
      console.error('Failed to upload panorama:', error)
      setError('Не удалось загрузить 360° панораму')
      return null
    } finally {
      setUploadingPanorama(false)
    }
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
          isCover: existingImages.length === 0 && uploadedImages.length === 0
        })
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    
    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Upload 360° panorama if new file provided
      let panoramaId = existingPanoramaId
      if (panoramaFile) {
        const uploadedPanoramaId = await uploadPanoramaToServer()
        if (uploadedPanoramaId) {
          panoramaId = uploadedPanoramaId
        }
      }

      // Upload new images
      const newUploadedImages = await uploadImagesToServer()
      
      // Combine existing and new images
      const allImages = [...existingImages, ...newUploadedImages]

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
        panorama360Id: panoramaId || undefined,
        hasTour360: !!panoramaId,
        images: allImages,
        hasVideo: property?.hasVideo || false,
      }

      await apiClient.put(`/admin/properties/${params.id}`, propertyData)
      router.push('/dashboard/properties')
    } catch (error: any) {
      console.error('Failed to update property:', error)
      setError(error.response?.data?.message || 'Не удалось обновить объект')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Объект не найден
        </div>
        <Link href="/dashboard/properties" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          ← Назад к списку
        </Link>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-secondary-900">Редактировать объект</h1>
        <p className="text-secondary-500 mt-1">{property.title}</p>
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
          </div>
        </div>

        {/* 360° Panorama Upload */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl shadow-sm border-2 border-primary-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900">360° Панорама</h2>
              <p className="text-sm text-secondary-600">Загрузите equirectangular изображение для виртуального тура</p>
            </div>
          </div>

          <div className="space-y-4">
            {!panoramaPreview ? (
              <div>
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-primary-300 bg-white rounded-lg p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-all">
                    <Upload className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-secondary-900 mb-2">
                      Загрузить 360° панораму
                    </p>
                    <p className="text-sm text-secondary-600 mb-1">
                      Нажмите или перетащите файл сюда
                    </p>
                    <p className="text-xs text-secondary-500">
                      JPG, PNG или WEBP • Макс. 80MB • Equirectangular формат (2:1)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePanoramaUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={panoramaPreview}
                  alt="360° Panorama Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-primary-300"
                />
                <button
                  type="button"
                  onClick={removePanorama}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-lg">
                  <Box className="w-4 h-4" />
                  {existingPanoramaId ? 'Текущая панорама' : 'Новая панорама'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">Текущие фотографии</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {img.isCover && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                      Обложка
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Images */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Добавить фотографии</h2>
          
          <div className="space-y-4">
            <div>
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
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white border-t border-secondary-200 p-4 -mx-8 -mb-8">
          <Link
            href="/dashboard/properties"
            className="px-6 py-3 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={saving || uploadingPanorama}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(saving || uploadingPanorama) && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploadingPanorama ? 'Загрузка панорамы...' : saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  )
}
