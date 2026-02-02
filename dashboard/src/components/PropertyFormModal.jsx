import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Video, Globe, Trash2, Plus } from 'lucide-react'
import { uploadApi } from '../lib/api'

const PROPERTY_TYPES = [
  { value: 'office', label: 'Офис' },
  { value: 'warehouse', label: 'Склад' },
  { value: 'shop', label: 'Магазин' },
  { value: 'cafe_restaurant', label: 'Кафе/Ресторан' },
  { value: 'industrial', label: 'Промышленное' },
  { value: 'salon', label: 'Салон' },
  { value: 'recreation', label: 'База отдыха' },
  { value: 'other', label: 'Другое' },
]

const DEAL_TYPES = [
  { value: 'rent', label: 'Аренда' },
  { value: 'sale', label: 'Продажа' },
]

const STATUSES = [
  { value: 'active', label: 'Активный' },
  { value: 'inactive', label: 'Неактивный' },
  { value: 'pending', label: 'На модерации' },
  { value: 'sold', label: 'Продано' },
  { value: 'rented', label: 'Сдано' },
]

export default function PropertyFormModal({ isOpen, onClose, onSubmit, property, isLoading }) {
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
    buildingClass: '',
    yearBuilt: '',
    yearRenovated: '',
    ceilingHeight: '',
    loadingDocks: '',
    zoning: '',
    pricePerSqm: '',
    operatingExpenses: '',
    propertyTax: '',
    maintenanceFee: '',
    occupancyRate: '',
    hvacType: '',
    powerSupply: '',
    securityFeatures: [],
    amenities: [],
    hasVideo: false,
    hasTour360: false,
    tour360Url: '',
    isVerified: false,
    isTop: false,
    isFeatured: false,
    status: 'pending',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })
  
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingVideos, setUploadingVideos] = useState(false)
  const [newSecurityFeature, setNewSecurityFeature] = useState('')
  const [newAmenity, setNewAmenity] = useState('')

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        propertyType: property.propertyType || 'office',
        dealType: property.dealType || 'rent',
        area: property.area || '',
        price: property.price || '',
        pricePerMonth: property.pricePerMonth || '',
        hasCommission: property.hasCommission || false,
        city: property.city || '',
        district: property.district || '',
        address: property.address || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        floor: property.floor || '',
        totalFloors: property.totalFloors || '',
        hasParking: property.hasParking || false,
        parkingSpaces: property.parkingSpaces || '',
        buildingClass: property.buildingClass || '',
        yearBuilt: property.yearBuilt || '',
        yearRenovated: property.yearRenovated || '',
        ceilingHeight: property.ceilingHeight || '',
        loadingDocks: property.loadingDocks || '',
        zoning: property.zoning || '',
        pricePerSqm: property.pricePerSqm || '',
        operatingExpenses: property.operatingExpenses || '',
        propertyTax: property.propertyTax || '',
        maintenanceFee: property.maintenanceFee || '',
        occupancyRate: property.occupancyRate || '',
        hvacType: property.hvacType || '',
        powerSupply: property.powerSupply || '',
        securityFeatures: property.securityFeatures || [],
        amenities: property.amenities || [],
        hasVideo: property.hasVideo || false,
        hasTour360: property.hasTour360 || false,
        tour360Url: property.tour360Url || '',
        isVerified: property.isVerified || false,
        isTop: property.isTop || false,
        isFeatured: property.isFeatured || false,
        status: property.status || 'pending',
        contactName: property.contactName || '',
        contactPhone: property.contactPhone || '',
        contactEmail: property.contactEmail || '',
      })
      setImages(property.images || [])
      setVideos(property.videos || [])
    } else {
      // Reset form for new property
      setImages([])
      setVideos([])
    }
  }, [property])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setUploadingImages(true)
    try {
      // Upload images to server
      const { data } = await uploadApi.uploadImages(files)
      
      const newImages = data.map((uploadedImage, index) => ({
        id: uploadedImage.filename || `temp-${Date.now()}-${index}`,
        url: uploadedImage.url,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        isCover: images.length === 0 && index === 0,
        order: images.length + index
      }))
      
      setImages(prev => [...prev, ...newImages])
    } catch (error) {
      console.error('Failed to upload images:', error)
      alert('Ошибка загрузки изображений. Попробуйте снова.')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setUploadingVideos(true)
    try {
      // Upload videos to server
      const { data } = await uploadApi.uploadVideos(files)
      
      const newVideos = data.map((uploadedVideo) => ({
        id: uploadedVideo.filename || `temp-${Date.now()}`,
        url: uploadedVideo.url,
        thumbnailUrl: uploadedVideo.thumbnailUrl,
        title: uploadedVideo.title || uploadedVideo.filename
      }))
      
      setVideos(prev => [...prev, ...newVideos])
      setFormData(prev => ({ ...prev, hasVideo: true }))
    } catch (error) {
      console.error('Failed to upload videos:', error)
      alert('Ошибка загрузки видео. Попробуйте снова.')
    } finally {
      setUploadingVideos(false)
    }
  }

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const removeVideo = (videoId) => {
    setVideos(prev => prev.filter(vid => vid.id !== videoId))
    if (videos.length <= 1) {
      setFormData(prev => ({ ...prev, hasVideo: false }))
    }
  }

  const setCoverImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isCover: img.id === imageId
    })))
  }

  const addSecurityFeature = () => {
    if (newSecurityFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        securityFeatures: [...prev.securityFeatures, newSecurityFeature.trim()]
      }))
      setNewSecurityFeature('')
    }
  }

  const removeSecurityFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      securityFeatures: prev.securityFeatures.filter((_, i) => i !== index)
    }))
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      area: parseFloat(formData.area) || 0,
      price: parseFloat(formData.price) || 0,
      pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : null,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      floor: formData.floor ? parseInt(formData.floor) : null,
      totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
      parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
      yearRenovated: formData.yearRenovated ? parseInt(formData.yearRenovated) : null,
      ceilingHeight: formData.ceilingHeight ? parseFloat(formData.ceilingHeight) : null,
      loadingDocks: formData.loadingDocks ? parseInt(formData.loadingDocks) : null,
      pricePerSqm: formData.pricePerSqm ? parseFloat(formData.pricePerSqm) : null,
      operatingExpenses: formData.operatingExpenses ? parseFloat(formData.operatingExpenses) : null,
      propertyTax: formData.propertyTax ? parseFloat(formData.propertyTax) : null,
      maintenanceFee: formData.maintenanceFee ? parseFloat(formData.maintenanceFee) : null,
      occupancyRate: formData.occupancyRate ? parseFloat(formData.occupancyRate) : null,
      images: images,
      videos: videos,
    }
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary-900">
            {property ? 'Редактировать объект' : 'Создать объект'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Основная информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Название *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Например: Офис в центре города"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Описание *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Подробное описание объекта..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Тип объекта *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Тип сделки *</label>
                <select
                  name="dealType"
                  value={formData.dealType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DEAL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Площадь (м²) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Цена (сум) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {formData.dealType === 'rent' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Цена в месяц (сум)</label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Статус</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Местоположение</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Город *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Район *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Адрес</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Широта *</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  step="0.000001"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Долгота *</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  step="0.000001"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Дополнительно</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Этаж</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Всего этажей</label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-secondary-700">Есть парковка</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hasCommission"
                  checked={formData.hasCommission}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-secondary-700">Есть комиссия</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-secondary-700">Проверено</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTop"
                  checked={formData.isTop}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-secondary-700">ТОП объявление</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-secondary-700">Рекомендуемое</label>
              </div>
            </div>
          </div>

          {/* Building Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Детали здания</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Класс здания</label>
                <select
                  name="buildingClass"
                  value={formData.buildingClass}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Не указано</option>
                  <option value="A">Класс A</option>
                  <option value="B">Класс B</option>
                  <option value="C">Класс C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Год постройки</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  placeholder="2020"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Год ремонта</label>
                <input
                  type="number"
                  name="yearRenovated"
                  value={formData.yearRenovated}
                  onChange={handleChange}
                  placeholder="2023"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Высота потолков (м)</label>
                <input
                  type="number"
                  name="ceilingHeight"
                  value={formData.ceilingHeight}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="3.5"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Парковочных мест</label>
                <input
                  type="number"
                  name="parkingSpaces"
                  value={formData.parkingSpaces}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Погрузочных доков</label>
                <input
                  type="number"
                  name="loadingDocks"
                  value={formData.loadingDocks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Зонирование</label>
                <input
                  type="text"
                  name="zoning"
                  value={formData.zoning}
                  onChange={handleChange}
                  placeholder="Коммерческое"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Тип HVAC</label>
                <input
                  type="text"
                  name="hvacType"
                  value={formData.hvacType}
                  onChange={handleChange}
                  placeholder="Центральное"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Электроснабжение</label>
                <input
                  type="text"
                  name="powerSupply"
                  value={formData.powerSupply}
                  onChange={handleChange}
                  placeholder="220/380V"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Финансовая информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Цена за м² (сум)</label>
                <input
                  type="number"
                  name="pricePerSqm"
                  value={formData.pricePerSqm}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Операционные расходы</label>
                <input
                  type="number"
                  name="operatingExpenses"
                  value={formData.operatingExpenses}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Налог на имущество</label>
                <input
                  type="number"
                  name="propertyTax"
                  value={formData.propertyTax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Плата за обслуживание</label>
                <input
                  type="number"
                  name="maintenanceFee"
                  value={formData.maintenanceFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Заполняемость (%)</label>
                <input
                  type="number"
                  name="occupancyRate"
                  value={formData.occupancyRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Безопасность</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSecurityFeature}
                onChange={(e) => setNewSecurityFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSecurityFeature())}
                placeholder="Добавить функцию безопасности..."
                className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addSecurityFeature}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.securityFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.securityFeatures.map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeSecurityFeature(index)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Удобства</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="Добавить удобство..."
                className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Media Upload - Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Изображения</h3>
            
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImages}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ImageIcon className="w-12 h-12 text-secondary-400 mb-2" />
                <p className="text-sm font-medium text-secondary-700 mb-1">
                  {uploadingImages ? 'Загрузка...' : 'Нажмите для загрузки изображений'}
                </p>
                <p className="text-xs text-secondary-500">PNG, JPG, WEBP до 10MB</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Property"
                      className="w-full h-32 object-cover rounded-lg border-2 border-secondary-200"
                    />
                    {image.isCover && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">Обложка</span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2">
                      {!image.isCover && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(image.id)}
                          className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-white text-secondary-700 text-xs rounded hover:bg-secondary-100"
                        >
                          Обложка
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media Upload - Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Видео</h3>
            
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6">
              <input
                type="file"
                id="video-upload"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={uploadingVideos}
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Video className="w-12 h-12 text-secondary-400 mb-2" />
                <p className="text-sm font-medium text-secondary-700 mb-1">
                  {uploadingVideos ? 'Загрузка...' : 'Нажмите для загрузки видео'}
                </p>
                <p className="text-xs text-secondary-500">MP4, MOV, AVI до 100MB</p>
              </label>
            </div>

            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 border border-secondary-200 rounded-lg">
                    <Video className="w-8 h-8 text-secondary-400" />
                    <span className="flex-1 text-sm text-secondary-700">{video.title}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(video.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 360 Tour */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">360° Виртуальный тур</h3>
            
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="hasTour360"
                checked={formData.hasTour360}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-secondary-700">Есть 360° тур</label>
            </div>

            {formData.hasTour360 && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  URL 360° тура
                </label>
                <input
                  type="url"
                  name="tour360Url"
                  value={formData.tour360Url}
                  onChange={handleChange}
                  placeholder="https://example.com/tour360"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-secondary-500">Вставьте ссылку на Matterport, Kuula или другой сервис 360° туров</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Контактная информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Имя контакта</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : (property ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
