'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPin, Building2, Ruler, Phone, Mail, User, 
  Heart, Share2, Eye, CheckCircle, Video, Box,
  ArrowLeft, Car, GitCompare, X, ChevronLeft, ChevronRight,
  Home, Calendar, DollarSign, TrendingUp, Wifi, Zap,
  Shield, Clock, Download, ExternalLink, ChevronRight as ChevronRightIcon
} from 'lucide-react'
import MapView from '@/components/map/MapView'
import { getProperty, saveProperty, unsaveProperty } from '@/lib/api/properties'
import type { Property } from '@/lib/types'
import ComparisonButton, { useComparison } from '@/components/comparison/ComparisonButton'
import Tour360Viewer from '@/components/properties/Tour360Viewer'
import { useTranslations } from 'next-intl'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { isSelected: isInComparison, toggleSelection: toggleComparison } = useComparison((params.id as string) || '')

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 100)
      
      if (currentScrollY < 100) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const fetchProperty = async (id: string) => {
    setLoading(true)
    try {
      const data = await getProperty(id)
      setProperty(data)
    } catch (error) {
      console.error('Failed to fetch property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!property) return
    try {
      if (isSaved) {
        await unsaveProperty(property.id)
        setIsSaved(false)
      } else {
        await saveProperty(property.id)
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to save property:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована!')
    }
  }

  const nextImage = () => {
    if (!property?.images || property.images.length === 0) return
    setSelectedImage((prev) => (prev + 1) % property.images!.length)
  }

  const prevImage = () => {
    if (!property?.images || property.images.length === 0) return
    setSelectedImage((prev) => (prev - 1 + property.images!.length) % property.images!.length)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' сум'
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      office: 'Офис',
      warehouse: 'Склад',
      shop: 'Магазин',
      cafe_restaurant: 'Кафе/Ресторан',
      industrial: 'Производство',
      salon: 'Салон',
      recreation: 'Развлечения',
      other: 'Другое'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-secondary-500 font-medium animate-pulse">{t('Common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">{t('Common.error')}</h2>
          <Link href="/properties" className="text-primary-600 hover:text-primary-700 font-medium">
            {t('Navigation.properties')}
          </Link>
        </div>
      </div>
    )
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [{ id: '1', url: '/placeholder-property.jpg', isCover: true, order: 0 }]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumbs & Actions Bar */}
      <div className={`bg-white border-b border-secondary-200 sticky top-16 z-40 ${
        mounted ? 'transition-all duration-300' : ''
      } ${
        scrolled ? 'shadow-md' : ''
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1">
              <Link href="/" className="text-secondary-500 hover:text-primary-600 transition-colors flex-shrink-0">
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <ChevronRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary-400 flex-shrink-0" />
              <Link href="/properties" className="text-secondary-500 hover:text-primary-600 transition-colors hidden sm:inline">
                Недвижимость
              </Link>
              <Link href="/properties" className="text-secondary-500 hover:text-primary-600 transition-colors sm:hidden flex-shrink-0">
                Список
              </Link>
              <ChevronRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-900 font-medium truncate">
                {property?.title || 'Загрузка...'}
              </span>
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                  isSaved 
                    ? 'bg-red-50 border-red-500 text-red-500' 
                    : 'border-secondary-300 hover:bg-secondary-50'
                }`}
                title={isSaved ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-lg border border-secondary-300 hover:bg-secondary-50 transition-all"
                title="Поделиться"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={toggleComparison}
                className={`p-1.5 sm:p-2 rounded-lg border transition-all hidden sm:flex ${
                  isInComparison 
                    ? 'bg-primary-50 border-primary-500 text-primary-600' 
                    : 'border-secondary-300 hover:bg-secondary-50'
                }`}
                title={isInComparison ? 'Убрать из сравнения' : 'Добавить к сравнению'}
              >
                <GitCompare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Enhanced Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div 
                className="relative aspect-video bg-secondary-100 cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={images[selectedImage]?.watermarkedUrl || images[selectedImage]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {property.isVerified && (
                    <div className="bg-green-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium shadow-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t('Filters.verifiedOnly')}
                    </div>
                  )}
                  {property.isTop && (
                    <div className="bg-yellow-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                      ТОП
                    </div>
                  )}
                  {property.hasVideo && (
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                      <Video className="w-3.5 h-3.5" />
                      {t('Filters.hasVideo')}
                    </div>
                  )}
                  {property.hasTour360 && (
                    <div className="bg-primary-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                      <Box className="w-3.5 h-3.5" />
                      {t('Filters.hasTour360')}
                    </div>
                  )}
                </div>

                {/* Image Counter */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {selectedImage + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Expand Icon */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Открыть галерею
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-primary-500 ring-2 ring-primary-200' 
                          : 'border-transparent hover:border-secondary-300'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
              <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 text-white hover:text-secondary-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-secondary-300 transition-colors"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-secondary-300 transition-colors"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={images[selectedImage]?.url || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            )}

            {/* Title and Price */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-secondary-900">{property.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-secondary-600">
                    <span className="flex items-center gap-1.5 bg-secondary-50 px-2.5 py-1 rounded-lg">
                      <Building2 className="w-3.5 h-3.5" />
                      {getPropertyTypeLabel(property.propertyType)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {property.viewCount} просмотров
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(property.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                  {property.dealType === 'rent'
                    ? `${formatPrice(property.pricePerMonth || property.price)}`
                    : formatPrice(property.price)}
                </div>
                {property.dealType === 'rent' && (
                  <span className="text-lg text-secondary-500">/мес</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  {property.dealType === 'rent' ? t('Property.rent') : t('Property.sale')}
                </span>
                {property.hasCommission && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    Комиссия
                  </span>
                )}
                {property.area && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-50 text-secondary-700 rounded-lg text-sm font-medium">
                    <Ruler className="w-3.5 h-3.5" />
                    {property.area} м²
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-secondary-900">{t('Property.description')}</h2>
              <p className="text-sm sm:text-base text-secondary-700 whitespace-pre-line leading-relaxed">{property.description}</p>
            </div>

            {/* 360° Tour */}
            {property.hasTour360 && property.tour360Url && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900 flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary-600" />
                  360° Виртуальный тур
                </h2>
                <div className="rounded-xl overflow-hidden">
                  <Tour360Viewer 
                    imageUrl={property.tour360Url} 
                    title={property.title}
                  />
                </div>
              </div>
            )}

            {/* Building Details */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Характеристики здания</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <Ruler className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 mb-0.5">Площадь</p>
                    <p className="font-bold text-secondary-900">{property.area} м²</p>
                  </div>
                </div>
                {property.floor && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Building2 className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Этаж</p>
                      <p className="font-bold text-secondary-900">
                        {property.floor} {property.totalFloors && `из ${property.totalFloors}`}
                      </p>
                    </div>
                  </div>
                )}
                {property.buildingClass && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Building2 className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Класс здания</p>
                      <p className="font-bold text-secondary-900">Класс {property.buildingClass}</p>
                    </div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Calendar className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Год постройки</p>
                      <p className="font-bold text-secondary-900">{property.yearBuilt}</p>
                    </div>
                  </div>
                )}
                {property.yearRenovated && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Calendar className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">{t('Property.year_renovated')}</p>
                      <p className="font-bold text-secondary-900">{property.yearRenovated}</p>
                    </div>
                  </div>
                )}
                {property.ceilingHeight && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Ruler className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">{t('Property.ceiling_height')}</p>
                      <p className="font-bold text-secondary-900">{property.ceilingHeight} м</p>
                    </div>
                  </div>
                )}
                {property.propertyCondition && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Состояние</p>
                      <p className="font-bold text-secondary-900">
                        {property.propertyCondition === 'new' ? 'Новое' : 
                         property.propertyCondition === 'excellent' ? 'Отличное' :
                         property.propertyCondition === 'good' ? 'Хорошее' : 'Требует ремонта'}
                      </p>
                    </div>
                  </div>
                )}
                {property.layoutType && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Building2 className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Планировка</p>
                      <p className="font-bold text-secondary-900">
                        {property.layoutType === 'open_plan' ? 'Открытая' :
                         property.layoutType === 'offices' ? 'Кабинеты' :
                         property.layoutType === 'mixed' ? 'Смешанная' : 'Складская'}
                      </p>
                    </div>
                  </div>
                )}
                {property.entranceType && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Home className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Вход</p>
                      <p className="font-bold text-secondary-900">
                        {property.entranceType === 'separate' ? 'Отдельный' :
                         property.entranceType === 'common' ? 'Общий' : 'С улицы'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Parking & Infrastructure */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Инфраструктура</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {property.hasParking && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Car className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Парковка</p>
                      <p className="font-bold text-secondary-900">
                        {property.parkingSpaces ? `${property.parkingSpaces} мест` : 'Есть'}
                      </p>
                    </div>
                  </div>
                )}
                {property.hasElevator && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Лифты</p>
                      <p className="font-bold text-secondary-900">
                        {property.elevatorCount ? `${property.elevatorCount} шт` : 'Есть'}
                      </p>
                    </div>
                  </div>
                )}
                {property.loadingDocks !== null && property.loadingDocks !== undefined && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Car className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Погрузочные доки</p>
                      <p className="font-bold text-secondary-900">{property.loadingDocks} шт</p>
                    </div>
                  </div>
                )}
                {property.hasFireSafety && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Shield className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Пожарная безопасность</p>
                      <p className="font-bold text-secondary-900">Есть</p>
                    </div>
                  </div>
                )}
                {property.securityFeatures && property.securityFeatures.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg col-span-2">
                    <div className="p-2 bg-white rounded-lg">
                      <Shield className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Безопасность</p>
                      <p className="font-bold text-secondary-900 text-xs">
                        {property.securityFeatures.map(f => 
                          f === 'cctv' ? 'Видеонаблюдение' :
                          f === 'security_guard' ? 'Охрана' :
                          f === 'access_control' ? 'Контроль доступа' :
                          f === 'alarm_system' ? 'Сигнализация' : 'Пожарная сигнализация'
                        ).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Utilities */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Коммуникации</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {property.powerSupply && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Zap className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Электричество</p>
                      <p className="font-bold text-secondary-900">
                        {property.powerSupply}{property.powerCapacity ? `, ${property.powerCapacity} кВт` : ''}
                      </p>
                    </div>
                  </div>
                )}
                {property.hvacType && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Wifi className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Кондиционирование</p>
                      <p className="font-bold text-secondary-900">
                        {property.hvacType === 'central' ? 'Центральное' :
                         property.hvacType === 'split' ? 'Сплит-система' :
                         property.hvacType === 'vrf' ? 'VRF' : 'Нет'}
                      </p>
                    </div>
                  </div>
                )}
                {property.hasWater && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Wifi className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Водоснабжение</p>
                      <p className="font-bold text-secondary-900">Есть</p>
                    </div>
                  </div>
                )}
                {property.hasSewerage && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Wifi className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Канализация</p>
                      <p className="font-bold text-secondary-900">Есть</p>
                    </div>
                  </div>
                )}
                {property.hasGas && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Zap className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Газ</p>
                      <p className="font-bold text-secondary-900">Есть</p>
                    </div>
                  </div>
                )}
                {property.hasInternet && (
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <Wifi className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-0.5">Интернет</p>
                      <p className="font-bold text-secondary-900">
                        {property.internetSpeed === 'fiber' ? 'Оптоволокно' :
                         property.internetSpeed === 'cable' ? 'Кабель' : 'DSL'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            {(property.pricePerSqm || property.operatingExpenses || property.propertyTax || property.maintenanceFee) && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Финансовая информация</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {property.pricePerSqm && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Цена за м²</p>
                        <p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.pricePerSqm)} сум</p>
                      </div>
                    </div>
                  )}
                  {property.operatingExpenses && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Операционные расходы</p>
                        <p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.operatingExpenses)} сум/мес</p>
                      </div>
                    </div>
                  )}
                  {property.propertyTax && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Налог на имущество</p>
                        <p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.propertyTax)} сум/год</p>
                      </div>
                    </div>
                  )}
                  {property.maintenanceFee && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Обслуживание</p>
                        <p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.maintenanceFee)} сум/мес</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lease Terms (for rental properties) */}
            {property.dealType === 'rent' && (property.minLeaseTerm || property.securityDeposit || property.prepaymentMonths) && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Условия аренды</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {property.minLeaseTerm && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Calendar className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Мин. срок аренды</p>
                        <p className="font-bold text-secondary-900">{property.minLeaseTerm} мес</p>
                      </div>
                    </div>
                  )}
                  {property.maxLeaseTerm && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Calendar className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Макс. срок аренды</p>
                        <p className="font-bold text-secondary-900">{property.maxLeaseTerm} мес</p>
                      </div>
                    </div>
                  )}
                  {property.securityDeposit && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Депозит</p>
                        <p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.securityDeposit)} сум</p>
                      </div>
                    </div>
                  )}
                  {property.prepaymentMonths && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Предоплата</p>
                        <p className="font-bold text-secondary-900">{property.prepaymentMonths} мес</p>
                      </div>
                    </div>
                  )}
                  {property.isOccupied && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 col-span-2">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <User className="w-4 h-4 text-yellow-700" />
                      </div>
                      <div>
                        <p className="text-xs text-yellow-700 mb-0.5">Текущий арендатор</p>
                        <p className="font-bold text-yellow-900">
                          {property.currentTenant}
                          {property.leaseExpiryDate && ` (до ${new Date(property.leaseExpiryDate).toLocaleDateString('ru-RU')})`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Legal & Documentation */}
            {(property.ownershipType || property.cadastralNumber || property.landArea) && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Юридическая информация</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {property.ownershipType && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Shield className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Тип собственности</p>
                        <p className="font-bold text-secondary-900">
                          {property.ownershipType === 'private' ? 'Частная' :
                           property.ownershipType === 'state' ? 'Государственная' : 'Долгосрочная аренда'}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.cadastralNumber && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Shield className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Кадастровый номер</p>
                        <p className="font-bold text-secondary-900 text-xs">{property.cadastralNumber}</p>
                      </div>
                    </div>
                  )}
                  {property.landArea && (
                    <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Ruler className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 mb-0.5">Площадь участка</p>
                        <p className="font-bold text-secondary-900">{property.landArea} м²</p>
                      </div>
                    </div>
                  )}
                  {property.hasLegalIssues && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200 col-span-2">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="w-4 h-4 text-red-700" />
                      </div>
                      <div>
                        <p className="text-xs text-red-700 mb-0.5">Внимание</p>
                        <p className="font-bold text-red-900">Имеются юридические вопросы</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-secondary-900">Расположение</h2>
              <div className="flex items-start gap-3 mb-4 p-3 bg-secondary-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <MapPin className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-secondary-900">{property.city}, {property.district}</p>
                  {property.address && <p className="text-sm text-secondary-600 mt-0.5">{property.address}</p>}
                </div>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-secondary-200">
                <MapView
                  properties={[property]}
                  center={[property.latitude, property.longitude]}
                  zoom={15}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm lg:sticky lg:top-20">
              <h3 className="text-sm font-bold mb-2.5 sm:mb-3 text-secondary-900">Контакты</h3>
              <div className="space-y-2 sm:space-y-2.5">
                {property.contactName && (
                  <div className="flex items-center gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                    <div className="p-1.5 bg-white rounded-lg">
                      <User className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-secondary-500">Контакт</p>
                      <p className="font-semibold text-sm text-secondary-900 truncate">{property.contactName}</p>
                    </div>
                  </div>
                )}
                {property.contactPhone && (
                  <div className="flex items-center gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                    <div className="p-1.5 bg-white rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-secondary-500">Телефон</p>
                      <a
                        href={`tel:${property.contactPhone}`}
                        className="font-semibold text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {property.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {property.contactEmail && (
                  <div className="flex items-center gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                    <div className="p-1.5 bg-white rounded-lg">
                      <Mail className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-secondary-500">Email</p>
                      <a
                        href={`mailto:${property.contactEmail}`}
                        className="font-semibold text-sm text-primary-600 hover:text-primary-700 transition-colors break-all"
                      >
                        {property.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2.5 sm:mt-3 space-y-2">
                <a 
                  href={`tel:${property.contactPhone}`}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5 sm:py-2"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </a>
                <a
                  href={`mailto:${property.contactEmail}`}
                  className="btn btn-outline w-full flex items-center justify-center gap-2 text-sm py-2.5 sm:py-2"
                >
                  <Mail className="w-4 h-4" />
                  Написать
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3.5 sm:p-4 border border-primary-200">
              <h3 className="text-sm font-bold mb-2 sm:mb-2.5 text-primary-900">Быстрые факты</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-700">Просмотры</span>
                  <span className="font-bold text-primary-900">{property.viewCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-700">Опубликовано</span>
                  <span className="font-bold text-primary-900">
                    {new Date(property.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {property.updatedAt && property.updatedAt !== property.createdAt && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary-700">Обновлено</span>
                    <span className="font-bold text-primary-900">
                      {new Date(property.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-700">ID объекта</span>
                  <span className="font-mono font-bold text-primary-900 text-xs">#{property.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-xl p-3 sm:p-3.5 border border-yellow-200">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-yellow-100 rounded-lg flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-yellow-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-yellow-900 mb-1">Безопасность</h3>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    Не переводите деньги до осмотра объекта. Проверяйте документы и личность продавца.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComparisonButton />
    </div>
  )
}
