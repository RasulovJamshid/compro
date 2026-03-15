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
  const [tour360ModalOpen, setTour360ModalOpen] = useState(false)
  const [activeInfoTab, setActiveInfoTab] = useState('building')
  const [scrolled, setScrolled] = useState(false)
  const { isSelected: isInComparison, toggleSelection: toggleComparison } = useComparison((params.id as string) || '')

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (tour360ModalOpen) setTour360ModalOpen(false)
        if (lightboxOpen) setLightboxOpen(false)
      }
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          nextImage()
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          prevImage()
        }
      }
    }
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [tour360ModalOpen, lightboxOpen])

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
      alert(`${t('PropertyDetails.linkCopied')}!`)
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
    return new Intl.NumberFormat('ru-RU').format(price) +  ` ${t('PropertyDetails.sum')}`
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      office: t('Property.office'),
      warehouse: t('Property.warehouse'),
      shop: t('Property.shop'),
      cafe_restaurant: t('Property.cafeRestaurant'),
      industrial: t('Property.industrial'),
      salon: t('Property.salon'),
      recreation: t('Property.entertainment'),
      other: t('Property.other')
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
    <div className="min-h-screen bg-secondary-50 pt-12">
      {/* Breadcrumbs & Actions Bar */}
      <div className={`sticky top-12 z-40 bg-white border-b transition-shadow ${
        scrolled ? 'border-secondary-200 shadow-sm' : 'border-secondary-100'
      }`}>
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1 sm:gap-1.5 text-xs min-w-0 flex-1">
                <Link href="/" className="text-secondary-500 hover:text-primary-600 transition-colors flex-shrink-0 p-1 hover:bg-secondary-50 rounded-lg">
                  <Home className="w-3.5 h-3.5" />
                </Link>
                <ChevronRightIcon className="w-2.5 h-2.5 text-secondary-400 flex-shrink-0" />
                <Link href="/properties" className="text-secondary-500 hover:text-primary-600 transition-colors hidden sm:inline px-2 py-1 hover:bg-secondary-50 rounded-lg">
                  {t('Breadcrumbs.properties')}
                </Link>
                <Link href="/properties" className="text-secondary-500 hover:text-primary-600 transition-colors sm:hidden flex-shrink-0 p-1 hover:bg-secondary-50 rounded-lg">
                  {t('Breadcrumbs.list')}
                </Link>
                <ChevronRightIcon className="w-2.5 h-2.5 text-secondary-400 flex-shrink-0" />
                <span className="text-secondary-900 font-semibold truncate text-sm">
                  {property?.title || t('PropertyDetails.loading')}
                </span>
              </nav>

              {/* Quick Actions - Enhanced */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    isSaved 
                      ? 'bg-red-50 border-red-200 text-red-500 shadow-sm' 
                      : 'border-secondary-200 text-secondary-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50'
                  }`}
                  title={isSaved ? t('PropertyDetails.removeFromFav') : t('PropertyDetails.addToFav')}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200"
                  title={t('PropertyDetails.share')}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleComparison}
                  className={`p-2 rounded-lg border transition-all duration-200 hidden sm:flex ${
                    isInComparison 
                      ? 'bg-primary-50 border-primary-300 text-primary-600 shadow-sm' 
                      : 'border-secondary-200 text-secondary-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50'
                  }`}
                  title={isInComparison ? t('PropertyDetails.removeFromCompare') : t('PropertyDetails.addToCompare')}
                >
                  <GitCompare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2 sm:py-3 pb-20 lg:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-4">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden border border-secondary-100">
              <div 
                className="relative aspect-video bg-gradient-to-br from-secondary-100 to-secondary-200 cursor-pointer group overflow-hidden"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={images[selectedImage]?.watermarkedUrl || images[selectedImage]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                
                {/* Dark Overlay on Hover - pointer-events-none to allow button clicks */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                
                {/* Badges - Modern Design */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2.5">
                  {property.isVerified && (
                    <div className="bg-accent-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg shadow-accent-500/20">
                      <CheckCircle className="w-4 h-4" />
                      {t('Filters.verifiedOnly')}
                    </div>
                  )}
                  {property.isTop && (
                    <div className="bg-tertiary-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-tertiary-500/20 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      TOP
                    </div>
                  )}
                  {property.hasVideo && (
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold shadow-lg">
                      <Video className="w-4 h-4" />
                      {t('Filters.hasVideo')}
                    </div>
                  )}
                  {property.hasTour360 && (
                    <div className="bg-primary-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg shadow-primary-500/20">
                      <Box className="w-4 h-4" />
                      {t('Filters.hasTour360')}
                    </div>
                  )}
                </div>

                {/* Image Counter - Modern */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg border border-white/10">
                  {selectedImage + 1} / {images.length}
                </div>

                {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg border border-white/40 z-10 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg border border-white/40 z-10 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Expand Icon - Modern */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 shadow-lg border border-white/10 pointer-events-none">
                  <ExternalLink className="w-4 h-4" />
                  {t('PropertyDetails.openGallery')}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-2 flex gap-2 overflow-x-auto scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === idx
                          ? 'border-primary-500 ring-2 ring-primary-200 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-secondary-300'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt=""
                        width={96}
                        height={64}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Quick Action Buttons - Modern & Eye-catching */}
              <div className="p-3 sm:p-4 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setTour360ModalOpen(true)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95"
                >
                  <Box className="w-5 h-5 sm:w-6 sm:h-6" />
                  {t('PropertyDetails.virtualTour360')}
                </button>
                {property.hasVideo && property.videos && property.videos.length > 0 && (
                  <button
                    onClick={() => window.open(property.videos![0].url, '_blank')}
                    className="flex-1 bg-secondary-900 hover:bg-black text-white px-5 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95"
                  >
                    <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    {t('PropertyDetails.watchVideo')}
                  </button>
                )}
              </div>
            </div>

            {/* Lightbox Modal - Enhanced */}
            {lightboxOpen && (
              <div 
                className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
                onClick={() => setLightboxOpen(false)}
              >
                {/* Close Button */}
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-lg border border-white/20 z-20 active:scale-95"
                  aria-label="Close gallery"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all shadow-lg border border-white/20 z-20 active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all shadow-lg border border-white/20 z-20 active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}
                
                {/* Image Container */}
                <div 
                  className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full h-full max-w-7xl max-h-full">
                    <Image
                      src={images[selectedImage]?.url || '/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                </div>
                
                {/* Image Counter & Info */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg border border-white/20 z-20">
                  {selectedImage + 1} / {images.length}
                </div>
                
                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4 z-20">
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2 justify-center">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                          className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === idx
                              ? 'border-white ring-2 ring-white/50 scale-110 shadow-lg'
                              : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/60 hover:scale-105'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt=""
                            width={80}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Title and Price */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-secondary-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-secondary-600 mb-3">
                    <span className="flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full font-semibold text-primary-700 border border-primary-100">
                      <Building2 className="w-3.5 h-3.5" />
                      {getPropertyTypeLabel(property.propertyType)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-secondary-100 px-3 py-1.5 rounded-full font-semibold">
                      <Eye className="w-3.5 h-3.5" />
                      {property.viewCount} {t('PropertyDetails.views')}
                    </span>
                    <span className="flex items-center gap-1.5 bg-secondary-100 px-3 py-1.5 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(property.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 leading-tight mb-1">{property.title}</h1>
                </div>
              </div>

              {/* Key Features Ribbon - Modern */}
              <div className="flex flex-wrap gap-2.5 py-4 border-y border-secondary-100 my-4">
                {property.area && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold border border-primary-200/50 shadow-sm">
                    <Ruler className="w-4 h-4" />
                    {property.area} {t('PropertyDetails.m2')}
                  </div>
                )}
                {property.floor && (
                  <div className="flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    <Building2 className="w-4 h-4" />
                    {property.floor}{property.totalFloors ? ` / ${property.totalFloors} ${t('PropertyDetails.floor')}` : ` ${t('PropertyDetails.floorFull')}`} 
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    <Calendar className="w-4 h-4" />
                    {property.yearBuilt}
                  </div>
                )}
                {property.buildingClass && (
                  <div className="flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    <Building2 className="w-4 h-4" />
                    {t('PropertyDetails.class')} {property.buildingClass}
                  </div>
                )}
                {property.hasCommission && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-tertiary-50 to-tertiary-100/50 text-tertiary-700 px-4 py-2 rounded-full text-sm font-bold border border-tertiary-200/50 shadow-sm">
                    <DollarSign className="w-4 h-4" />
                    {t('PropertyDetails.commission')}
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-2 lg:hidden">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                  {property.dealType === 'rent'
                    ? `${formatPrice(property.pricePerMonth || property.price)}`
                    : formatPrice(property.price)}
                </div>
                {property.dealType === 'rent' && (
                  <span className="text-lg text-secondary-500">{t('PropertyDetails.perMonth')}</span>
                )}
                <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  {property.dealType === 'rent' ? t('Property.rent') : t('Property.sale')}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-secondary-100">
              <h2 className="text-base font-bold mb-3 text-secondary-900">
                {t('Property.description')}
              </h2>
              <p className="text-sm sm:text-base text-secondary-700 whitespace-pre-line leading-relaxed">{property.description}</p>
            </div>

            {/* Info Tabs - Modern Design */}
            <div className="bg-white rounded-xl overflow-hidden border border-secondary-100">
              <div className="flex overflow-x-auto border-b border-secondary-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {[
                  { id: 'building', label: t('PropertyDetails.characteristics') },
                  { id: 'infra', label: t('PropertyDetails.infrastructure') },
                  { id: 'utilities', label: t('PropertyDetails.communications') },
                  ...((property.pricePerSqm || property.operatingExpenses || property.propertyTax || property.maintenanceFee) ? [{ id: 'finance', label: t('PropertyDetails.finances') }] : []),
                  ...(property.dealType === 'rent' && (property.minLeaseTerm || property.securityDeposit || property.prepaymentMonths) ? [{ id: 'lease', label: t('PropertyDetails.rentalTerms') }] : []),
                  ...((property.ownershipType || property.cadastralNumber || property.landArea) ? [{ id: 'legal', label: t('PropertyDetails.legal') }] : []),
                ].map(tab => (
                  <button key={tab.id} type="button" onClick={() => setActiveInfoTab(tab.id)}
                    className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors flex-shrink-0 ${
                      activeInfoTab === tab.id
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-secondary-500 hover:text-secondary-800'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {activeInfoTab === 'building' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                      <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Ruler className="w-4 h-4 text-primary-600" /></div>
                      <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.area')}</p><p className="font-bold text-secondary-900">{property.area} {t('PropertyDetails.m2')}</p></div>
                    </div>
                    {property.floor && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Building2 className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.floorFull')}</p><p className="font-bold text-secondary-900">{property.floor}{property.totalFloors && ` {t('PropertyDetails.from')} ${property.totalFloors}`}</p></div>
                      </div>
                    )}
                    {property.buildingClass && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Building2 className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.buildingClassLabel')}</p><p className="font-bold text-secondary-900">{t('PropertyDetails.class')} {property.buildingClass}</p></div>
                      </div>
                    )}
                    {property.yearBuilt && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Calendar className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.buildYear')}</p><p className="font-bold text-secondary-900">{property.yearBuilt}</p></div>
                      </div>
                    )}
                    {property.yearRenovated && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Calendar className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('Property.year_renovated')}</p><p className="font-bold text-secondary-900">{property.yearRenovated}</p></div>
                      </div>
                    )}
                    {property.ceilingHeight && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Ruler className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('Property.ceiling_height')}</p><p className="font-bold text-secondary-900">{property.ceilingHeight} {t('PropertyDetails.meter')}</p></div>
                      </div>
                    )}
                    {property.propertyCondition && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><CheckCircle className="w-4 h-4 text-primary-600" /></div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.condition')}</p>
                          <p className="font-bold text-secondary-900">{property.propertyCondition === 'new' ? t('PropertyDetails.conditionNew') : property.propertyCondition === 'excellent' ? t('PropertyDetails.conditionExcellent') : property.propertyCondition === 'good' ? t('PropertyDetails.conditionGood') : t('PropertyDetails.conditionNeedsRepair')}</p>
                        </div>
                      </div>
                    )}
                    {property.layoutType && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Building2 className="w-4 h-4 text-primary-600" /></div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.layout')}</p>
                          <p className="font-bold text-secondary-900">{property.layoutType === 'open_plan' ? t('PropertyDetails.layoutOpen') : property.layoutType === 'offices' ? t('PropertyDetails.layoutCabinets') : property.layoutType === 'mixed' ? t('PropertyDetails.layoutMixed') : t('PropertyDetails.layoutWarehouse')}</p>
                        </div>
                      </div>
                    )}
                    {property.entranceType && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Home className="w-4 h-4 text-primary-600" /></div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.entrance')}</p>
                          <p className="font-bold text-secondary-900">{property.entranceType === 'separate' ? t('PropertyDetails.entranceSeparate') : property.entranceType === 'common' ? t('PropertyDetails.entranceCommon') : t('PropertyDetails.entranceStreet')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeInfoTab === 'infra' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.hasParking && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Car className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.parking')}</p><p className="font-bold text-secondary-900">{property.parkingSpaces ? `${property.parkingSpaces} {t('PropertyDetails.places')}` : t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.hasElevator && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><TrendingUp className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.elevators')}</p><p className="font-bold text-secondary-900">{property.elevatorCount ? `${property.elevatorCount} {t('PropertyDetails.pcs')}` : t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.loadingDocks !== null && property.loadingDocks !== undefined && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Car className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.loadingDocks')}</p><p className="font-bold text-secondary-900">{property.loadingDocks} {t('PropertyDetails.pcs')}</p></div>
                      </div>
                    )}
                    {property.hasFireSafety && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Shield className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.fireSafety')}</p><p className="font-bold text-secondary-900">{t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.securityFeatures && property.securityFeatures.length > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-xl col-span-2">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Shield className="w-4 h-4 text-primary-600" /></div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.security')}</p>
                          <p className="font-bold text-secondary-900 text-xs">{property.securityFeatures.map(f => f === 'cctv' ? t('PropertyDetails.videoSurveillance') : f === 'security_guard' ? t('PropertyDetails.guard') : f === 'access_control' ? t('PropertyDetails.accessControl') : f === 'alarm_system' ? t('PropertyDetails.alarm') : t('PropertyDetails.fireAlarm')).join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeInfoTab === 'utilities' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.powerSupply && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Zap className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.electricity')}</p><p className="font-bold text-secondary-900">{property.powerSupply}{property.powerCapacity ? `, ${property.powerCapacity} {t('PropertyDetails.kw')}` : ''}</p></div>
                      </div>
                    )}
                    {property.hvacType && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Wifi className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.airConditioning')}</p><p className="font-bold text-secondary-900">{property.hvacType === 'central' ? t('PropertyDetails.central') : property.hvacType === 'split' ? t('PropertyDetails.splitSystem') : property.hvacType === 'vrf' ? 'VRF' : t('PropertyDetails.none')}</p></div>
                      </div>
                    )}
                    {property.hasWater && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Wifi className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.waterSupply')}</p><p className="font-bold text-secondary-900">{t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.hasSewerage && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Wifi className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.sewerage')}</p><p className="font-bold text-secondary-900">{t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.hasGas && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Zap className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.gas')}</p><p className="font-bold text-secondary-900">{t('PropertyDetails.has')}</p></div>
                      </div>
                    )}
                    {property.hasInternet && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Wifi className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.internet')}</p><p className="font-bold text-secondary-900">{property.internetSpeed === 'fiber' ? t('PropertyDetails.opticFiber') : property.internetSpeed === 'cable' ? t('PropertyDetails.cable') : 'DSL'}</p></div>
                      </div>
                    )}
                  </div>
                )}
                {activeInfoTab === 'finance' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.pricePerSqm && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.pricePerMeter')}</p><p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.pricePerSqm)} {t('PropertyDetails.sum')}</p></div>
                      </div>
                    )}
                    {property.operatingExpenses && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.operatingExpenses')}</p><p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.operatingExpenses)} {t('PropertyDetails.sum')}{t('PropertyDetails.perMonth')}</p></div>
                      </div>
                    )}
                    {property.propertyTax && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.propertyTax')}</p><p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.propertyTax)} {t('PropertyDetails.sumPerYear')}</p></div>
                      </div>
                    )}
                    {property.maintenanceFee && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.maintenance')}</p><p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.maintenanceFee)} {t('PropertyDetails.sum')}{t('PropertyDetails.perMonth')}</p></div>
                      </div>
                    )}
                  </div>
                )}
                {activeInfoTab === 'lease' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.minLeaseTerm && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Calendar className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.minLeaseTerm')}</p><p className="font-bold text-secondary-900">{property.minLeaseTerm} {t('PropertyDetails.monthShort')}</p></div>
                      </div>
                    )}
                    {property.maxLeaseTerm && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Calendar className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.maxLeaseTerm')}</p><p className="font-bold text-secondary-900">{property.maxLeaseTerm} {t('PropertyDetails.monthShort')}</p></div>
                      </div>
                    )}
                    {property.securityDeposit && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.deposit')}</p><p className="font-bold text-secondary-900">{new Intl.NumberFormat('ru-RU').format(property.securityDeposit)} {t('PropertyDetails.sum')}</p></div>
                      </div>
                    )}
                    {property.prepaymentMonths && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.prepayment')}</p><p className="font-bold text-secondary-900">{property.prepaymentMonths} {t('PropertyDetails.monthShort')}</p></div>
                      </div>
                    )}
                    {property.isOccupied && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200 col-span-2">
                        <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0"><User className="w-4 h-4 text-yellow-700" /></div>
                        <div>
                          <p className="text-xs text-yellow-700 mb-0.5">{t('PropertyDetails.currentTenant')}</p>
                          <p className="font-bold text-yellow-900">{property.currentTenant}{property.leaseExpiryDate && ` ({t('PropertyDetails.until')} ${new Date(property.leaseExpiryDate).toLocaleDateString('ru-RU')})`}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeInfoTab === 'legal' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.ownershipType && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Shield className="w-4 h-4 text-primary-600" /></div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.propertyType')}</p>
                          <p className="font-bold text-secondary-900">{property.ownershipType === 'private' ? t('PropertyDetails.privateProperty') : property.ownershipType === 'state' ? t('PropertyDetails.stateProperty') : t('PropertyDetails.longTermLease')}</p>
                        </div>
                      </div>
                    )}
                    {property.cadastralNumber && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Shield className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.cadastralNumber')}</p><p className="font-bold text-secondary-900 text-xs">{property.cadastralNumber}</p></div>
                      </div>
                    )}
                    {property.landArea && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-secondary-50 rounded-lg">
                        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0"><Ruler className="w-4 h-4 text-primary-600" /></div>
                        <div><p className="text-xs text-secondary-500 mb-0.5">{t('PropertyDetails.plotArea')}</p><p className="font-bold text-secondary-900">{property.landArea} {t('PropertyDetails.m2')}</p></div>
                      </div>
                    )}
                    {property.hasLegalIssues && (
                      <div className="col-span-2 sm:col-span-3 flex items-start gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
                        <div className="p-2 bg-red-100 rounded-full flex-shrink-0"><Shield className="w-4 h-4 text-red-600" /></div>
                        <div>
                          <p className="font-bold text-red-800 text-sm">{t('PropertyDetails.attentionLegal')}</p>
                          <p className="text-red-700 text-xs mt-0.5">{t('PropertyDetails.legalWarning')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-secondary-100">
              <h2 className="text-base font-bold mb-3 text-secondary-900">
                {t('PropertyDetails.location')}
              </h2>
              <div className="flex items-center gap-2 mb-3 text-sm">
                <MapPin className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-secondary-900 text-base">{property.city}, {property.district}</p>
                  {property.address && <p className="text-sm text-secondary-600 mt-1">{property.address}</p>}
                </div>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-secondary-200 shadow-sm">
                <MapView
                  properties={[property]}
                  center={[property.latitude, property.longitude]}
                  zoom={15}
                />
              </div>
            </div>
          </div>

          {/* 360° Tour Modal */}
          {tour360ModalOpen && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              {/* Modal Header - Optimized for Mobile */}
              <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Box className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-sm sm:text-lg truncate">{property.title}</h3>
                    <p className="text-secondary-400 text-xs sm:text-sm hidden sm:block">{t('PropertyDetails.virtualTour360')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setTour360ModalOpen(false)}
                  className="text-white hover:text-secondary-300 transition-colors p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
                  aria-label={t('PropertyDetails.close')}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              {/* Tour Viewer - Full Screen */}
              <div className="flex-1 relative w-full h-full overflow-hidden">
                <Tour360Viewer 
                  imageUrl={property.tour360Url || undefined} 
                  title={property.title}
                  tourConfig={property.virtualTourConfig}
                />
              </div>
              
              {/* Modal Footer - Minimal on mobile, more info on desktop */}
              <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 safe-area-bottom">
                <div className="flex items-center justify-between text-xs sm:text-sm text-secondary-300">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{property.city}, {property.district}</span>
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      {property.area} {t('PropertyDetails.m2')}
                    </span>
                  </div>
                  <button
                    onClick={() => setTour360ModalOpen(false)}
                    className="text-white hover:text-secondary-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-lg flex-shrink-0"
                  >
                    <span className="hidden sm:inline text-sm">{t('PropertyDetails.close')}</span>
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] sm:text-xs">ESC</kbd>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[6.5rem] space-y-3">
            {/* Contact Card */}
            <div className="bg-white rounded-xl overflow-hidden border border-secondary-100">
              {/* Price Header */}
              <div className="bg-primary-600 px-4 py-4 text-white">
                <p className="text-primary-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {property.dealType === 'rent' ? t('PropertyDetails.rent') : t('PropertyDetails.sale')}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold">
                    {property.dealType === 'rent'
                      ? formatPrice(property.pricePerMonth || property.price)
                      : formatPrice(property.price)}
                  </span>
                  {property.dealType === 'rent' && <span className="text-primary-200 text-sm">{t('PropertyDetails.perMonth')}</span>}
                </div>
                {property.pricePerSqm && (
                  <p className="text-primary-200 text-xs mt-1">{new Intl.NumberFormat('ru-RU').format(property.pricePerSqm)} {t('PropertyDetails.sumPerSqm')}</p>
                )}
              </div>
              <div className="p-4">
              <h3 className="text-sm font-bold mb-3 text-secondary-900">{t('PropertyDetails.contactsTitle')}</h3>
              <div className="space-y-2">
                {property.contactName && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <User className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                    <span className="text-secondary-900 font-medium truncate">{property.contactName}</span>
                  </div>
                )}
                {property.contactPhone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                    <a href={`tel:${property.contactPhone}`} className="text-primary-600 font-medium hover:underline">{property.contactPhone}</a>
                  </div>
                )}
                {property.contactEmail && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                    <a href={`mailto:${property.contactEmail}`} className="text-primary-600 font-medium hover:underline truncate">{property.contactEmail}</a>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <a 
                  href={`tel:${property.contactPhone}`}
                  className="btn btn-md btn-primary w-full"
                >
                  <Phone className="w-4 h-4" />
                  {t('PropertyDetails.callButton')}
                </a>
                <a
                  href={`mailto:${property.contactEmail}`}
                  className="btn btn-md btn-outline w-full"
                >
                  <Mail className="w-4 h-4" />
                  {t('PropertyDetails.writeButton')}
                </a>
              </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-4 border border-secondary-100">
              <h3 className="text-sm font-bold mb-3 text-secondary-900">{t('PropertyDetails.quickFacts')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-500">{t('PropertyDetails.viewsFact')}</span>
                  <span className="font-semibold text-secondary-900">{property.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-500">{t('PropertyDetails.publishedFact')}</span>
                  <span className="font-semibold text-secondary-900">
                    {new Date(property.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {property.updatedAt && property.updatedAt !== property.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-500">{t('PropertyDetails.updatedFact')}</span>
                    <span className="font-semibold text-secondary-900">
                      {new Date(property.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-secondary-500">{t('PropertyDetails.objectId')}</span>
                  <span className="font-mono text-xs text-secondary-900">#{property.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-yellow-800 mb-0.5">{t('PropertyDetails.security')}</h3>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    {t('PropertyDetails.safetyWarning')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-40 bg-white border-t border-secondary-100 shadow-md">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-primary-600 truncate">
                {property.dealType === 'rent' ? formatPrice(property.pricePerMonth || property.price) : formatPrice(property.price)}
              </span>
              {property.dealType === 'rent' && <span className="text-secondary-500 text-xs font-bold">{t('PropertyDetails.perMonth')}</span>}
            </div>
            {property.area && <p className="text-xs text-secondary-600 font-semibold truncate">{property.area} {t('PropertyDetails.m2')}</p>}
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {property.contactEmail && (
              <a href={`mailto:${property.contactEmail}`}
                className="flex items-center gap-1.5 border-2 border-primary-600 text-primary-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-primary-50 shadow-sm">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">{t('PropertyDetails.writeButton')}</span>
              </a>
            )}
            <a href={`tel:${property.contactPhone}`}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{t('PropertyDetails.callButton')}</span>
            </a>
          </div>
        </div>
      </div>
      <ComparisonButton />
    </div>
  )
}
