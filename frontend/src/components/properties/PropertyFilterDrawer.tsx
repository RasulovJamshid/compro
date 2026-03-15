'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import type { PropertyFilters } from '@/lib/types'
import { useTranslations } from 'next-intl'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface PropertyFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialFilters: PropertyFilters
  onApply: (filters: PropertyFilters) => void
  onClear: () => void
  resultsCount?: number
}

// Helper to format numbers with spaces
const formatNumber = (val: number | string | undefined) => {
  if (!val) return ''
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Helper to parse formatted string back to number
const parseNumber = (val: string) => {
  return Number(val.replace(/\s/g, ''))
}

export default function PropertyFilterDrawer({
  isOpen, onClose, initialFilters, onApply, onClear, resultsCount
}: PropertyFilterDrawerProps) {
  const t = useTranslations()
  const tFilters = useTranslations('Filters')
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false)

  // Local state for formatted inputs
  const [minPriceStr, setMinPriceStr] = useState(formatNumber(initialFilters.minPrice))
  const [maxPriceStr, setMaxPriceStr] = useState(formatNumber(initialFilters.maxPrice))
  const [minAreaStr, setMinAreaStr] = useState(formatNumber(initialFilters.minArea))
  const [maxAreaStr, setMaxAreaStr] = useState(formatNumber(initialFilters.maxArea))

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters)
      setMinPriceStr(formatNumber(initialFilters.minPrice))
      setMaxPriceStr(formatNumber(initialFilters.maxPrice))
      setMinAreaStr(formatNumber(initialFilters.minArea))
      setMaxAreaStr(formatNumber(initialFilters.maxArea))
    }
  }, [isOpen, initialFilters])

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePriceStrChange = (type: 'min' | 'max', val: string) => {
    // allow only numbers and spaces
    const cleanStr = val.replace(/[^\d\s]/g, '')
    const num = parseNumber(cleanStr)
    
    if (type === 'min') {
      setMinPriceStr(formatNumber(cleanStr))
      handleFilterChange('minPrice', num || undefined)
    } else {
      setMaxPriceStr(formatNumber(cleanStr))
      handleFilterChange('maxPrice', num || undefined)
    }
  }

  const handleAreaStrChange = (type: 'min' | 'max', val: string) => {
    const cleanStr = val.replace(/[^\d\s]/g, '')
    const num = parseNumber(cleanStr)
    
    if (type === 'min') {
      setMinAreaStr(formatNumber(cleanStr))
      handleFilterChange('minArea', num || undefined)
    } else {
      setMaxAreaStr(formatNumber(cleanStr))
      handleFilterChange('maxArea', num || undefined)
    }
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    setFilters({})
    setMinPriceStr('')
    setMaxPriceStr('')
    setMinAreaStr('')
    setMaxAreaStr('')
    onClear()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-secondary-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 sm:rounded-l-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-secondary-900">{t('Filters.title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary-50 rounded-full transition-colors text-secondary-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar relative pb-24">
          
          {/* Deal Type */}
          <section>
            <label className="text-xs font-bold text-secondary-900 mb-3 block">{tFilters('dealAndProperty')}</label>
            <div className="flex p-1 bg-secondary-50 rounded-xl border border-secondary-100">
              <button
                onClick={() => handleFilterChange('dealType', undefined)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!filters.dealType ? 'bg-primary-600 text-white shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
              >
                {tFilters('all')}
              </button>
              <button
                onClick={() => handleFilterChange('dealType', 'rent')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${filters.dealType === 'rent' ? 'bg-primary-600 text-white shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
              >
                {t('Property.rent')}
              </button>
              <button
                onClick={() => handleFilterChange('dealType', 'sale')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${filters.dealType === 'sale' ? 'bg-primary-600 text-white shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
              >
                {t('Property.sale')}
              </button>
            </div>
          </section>

          {/* Property Type */}
          <section>
            <label className="text-xs font-bold text-secondary-900 mb-3 block">{t('Property.propertyType')}</label>
            <div className="relative">
              <select
                className="input input-md appearance-none pr-10 bg-secondary-50 border-secondary-100"
                value={filters.propertyType || ''}
                onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
              >
                <option value="">{tFilters('all')}</option>
                <option value="office">{t('Property.office')}</option>
                <option value="warehouse">{t('Property.warehouse')}</option>
                <option value="shop">{t('Property.shop')}</option>
                <option value="cafe_restaurant">{t('Property.cafeRestaurant')}</option>
                <option value="industrial">{t('Property.industrial')}</option>
                <option value="salon">{t('Property.salon')}</option>
                <option value="recreation">{t('Property.recreation')}</option>
                <option value="other">{t('Property.other')}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-700 pointer-events-none stroke-[2.5px]" />
            </div>
          </section>

          {/* Price */}
          <section>
            <label className="text-xs font-bold text-secondary-900 mb-3 block">{tFilters('priceUzs')}</label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={tFilters('from')}
                  className="input input-md bg-secondary-50 border-secondary-100 hide-spinners"
                  value={minPriceStr}
                  onChange={(e) => handlePriceStrChange('min', e.target.value)}
                />
                <span className="text-secondary-400">-</span>
                <input
                  type="text"
                  placeholder={tFilters('to')}
                  className="input input-md bg-secondary-50 border-secondary-100 hide-spinners"
                  value={maxPriceStr}
                  onChange={(e) => handlePriceStrChange('max', e.target.value)}
                />
              </div>
              <div className="px-2">
                <Slider 
                  range 
                  min={0} 
                  max={10000000000} 
                  step={1000000}
                  value={[filters.minPrice || 0, filters.maxPrice || 10000000000]}
                  onChange={(val: any) => {
                    const [min, max] = val;
                    handleFilterChange('minPrice', min === 0 ? undefined : min);
                    setMinPriceStr(formatNumber(min === 0 ? '' : min));
                    handleFilterChange('maxPrice', max === 10000000000 ? undefined : max);
                    setMaxPriceStr(formatNumber(max === 10000000000 ? '' : max));
                  }}
                  trackStyle={[{ backgroundColor: '#3b7ed9', height: 4 }]}
                  handleStyle={[
                    { borderColor: '#3b7ed9', backgroundColor: 'white', opacity: 1, width: 20, height: 20, marginTop: -8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    { borderColor: '#3b7ed9', backgroundColor: 'white', opacity: 1, width: 20, height: 20, marginTop: -8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                  ]}
                  railStyle={{ backgroundColor: '#e2e8f0', height: 4 }}
                />
              </div>
            </div>
          </section>

          {/* Area */}
          <section>
            <label className="text-xs font-bold text-secondary-900 mb-3 block">{tFilters('areaM2')}</label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={tFilters('from')}
                  className="input input-md bg-secondary-50 border-secondary-100 hide-spinners"
                  value={minAreaStr}
                  onChange={(e) => handleAreaStrChange('min', e.target.value)}
                />
                <span className="text-secondary-400">-</span>
                <input
                  type="text"
                  placeholder={tFilters('to')}
                  className="input input-md bg-secondary-50 border-secondary-100 hide-spinners"
                  value={maxAreaStr}
                  onChange={(e) => handleAreaStrChange('max', e.target.value)}
                />
              </div>
              <div className="px-2">
                <Slider 
                  range 
                  min={0} 
                  max={5000} 
                  step={10}
                  value={[filters.minArea || 0, filters.maxArea || 5000]}
                  onChange={(val: any) => {
                    const [min, max] = val;
                    handleFilterChange('minArea', min === 0 ? undefined : min);
                    setMinAreaStr(formatNumber(min === 0 ? '' : min));
                    handleFilterChange('maxArea', max === 5000 ? undefined : max);
                    setMaxAreaStr(formatNumber(max === 5000 ? '' : max));
                  }}
                  trackStyle={[{ backgroundColor: '#3b7ed9', height: 4 }]}
                  handleStyle={[
                    { borderColor: '#3b7ed9', backgroundColor: 'white', opacity: 1, width: 20, height: 20, marginTop: -8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    { borderColor: '#3b7ed9', backgroundColor: 'white', opacity: 1, width: 20, height: 20, marginTop: -8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                  ]}
                  railStyle={{ backgroundColor: '#e2e8f0', height: 4 }}
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <label className="text-xs font-bold text-secondary-900 mb-3 block">{t('Property.location')}</label>
            <div className="space-y-3">
              <div className="relative">
                <select
                  className="input input-md appearance-none pr-10 bg-secondary-50 border-secondary-100"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                >
                  <option value="">{t('Filters.city')}</option>
                  <option value="Ташкент">Ташкент</option>
                  <option value="Самарканд">Самарканд</option>
                  <option value="Бухара">Бухара</option>
                  <option value="Хива">Хива</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-700 pointer-events-none stroke-[2.5px]" />
              </div>
              <div className="relative">
                <select
                  className="input input-md appearance-none pr-10 bg-secondary-50 border-secondary-100"
                  value={filters.district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value || undefined)}
                >
                  <option value="">{t('Filters.district')}</option>
                  <option value="Юнусабадский">Юнусабадский</option>
                  <option value="Мирзо-Улугбекский">Мирзо-Улугбекский</option>
                  <option value="Мирабадский">Мирабадский</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-700 pointer-events-none stroke-[2.5px]" />
              </div>
            </div>
          </section>

          {/* Additional Options (Collapsible) */}
          <section>
            <button 
              className="flex items-center justify-between w-full py-2 group"
              onClick={() => setIsAdditionalOpen(!isAdditionalOpen)}
            >
              <label className="text-xs font-bold text-secondary-900 block cursor-pointer">{tFilters('options')}</label>
              {isAdditionalOpen ? (
                <ChevronUp className="w-5 h-5 text-secondary-500 group-hover:text-secondary-900 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-500 group-hover:text-secondary-900 transition-colors" />
              )}
            </button>
            
            {isAdditionalOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {[
                  { key: 'isVerified', label: t('Filters.verifiedOnly') },
                  { key: 'hasTour360', label: t('Filters.hasTour360') },
                  { key: 'hasVideo', label: t('Filters.hasVideo') },
                  { key: 'hasParking', label: t('Filters.hasParking') },
                  { key: 'hasElevator', label: t('Filters.hasElevator') },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-50 border border-secondary-100 hover:border-primary-200 cursor-pointer transition-all group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500/20 border-secondary-300"
                      checked={!!filters[key as keyof PropertyFilters]}
                      onChange={(e) => handleFilterChange(key as keyof PropertyFilters, e.target.checked || undefined)}
                    />
                    <span className="text-sm font-medium text-secondary-700 group-hover:text-secondary-900">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Sticky Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-secondary-100 bg-white flex items-center gap-3 flex-shrink-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button
            onClick={handleClear}
            className="btn btn-md btn-ghost"
          >
            {t('Filters.reset')}
          </button>
          <button
            onClick={handleApply}
            className="btn btn-md btn-primary flex-1 !rounded-full"
          >
            {resultsCount !== undefined ? `${resultsCount} ta obyektni ko'rsatish` : "Ko'rsatish"}
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        /* Hide number input spinners */
        .hide-spinners::-webkit-inner-spin-button, 
        .hide-spinners::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .hide-spinners {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  )
}
