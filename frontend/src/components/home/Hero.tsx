'use client'

import { Search, MapPin, Building2, DollarSign, Maximize } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('rent')
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minArea, setMinArea] = useState('')
  const [maxArea, setMaxArea] = useState('')

  const normalizeRange = (minValue: string, maxValue: string) => {
    const min = Number(minValue)
    const max = Number(maxValue)

    const hasMin = Number.isFinite(min) && min > 0
    const hasMax = Number.isFinite(max) && max > 0

    if (!hasMin && !hasMax) return { min: null, max: null }
    if (hasMin && !hasMax) return { min, max: null }
    if (!hasMin && hasMax) return { min: null, max }

    return min <= max ? { min, max } : { min: max, max: min }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    const normalizedPrice = normalizeRange(minPrice, maxPrice)
    const normalizedArea = normalizeRange(minArea, maxArea)

    if (searchQuery.trim()) params.append('q', searchQuery.trim())
    if (propertyType !== 'all') params.append('propertyType', propertyType)
    if (normalizedPrice.min !== null) params.append('minPrice', String(normalizedPrice.min))
    if (normalizedPrice.max !== null) params.append('maxPrice', String(normalizedPrice.max))
    if (normalizedArea.min !== null) params.append('minArea', String(normalizedArea.min))
    if (normalizedArea.max !== null) params.append('maxArea', String(normalizedArea.max))
    params.append('dealType', activeTab)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[650px] lg:min-h-[800px] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Image & Overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        {/* Stronger gradient overlay for excellent text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/25" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl">
        <div className="mx-auto">
          
          {/* Heading */}
          <div className="text-center mb-12 transform transition-all">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-xl leading-tight max-w-4xl mx-auto text-balance">
              Идеальное место для <br className="hidden md:block" />
              <span className="text-primary-500 drop-shadow-md">вашего бизнеса</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg font-medium max-w-2xl mx-auto">
              Самая большая база коммерческой недвижимости в Узбекистане
            </p>
          </div>

          {/* Search Box - Modern Glassmorphism Style */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-visible border border-white/40">
            
            {/* Tabs */}
            <div className="flex border-b border-secondary-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`flex-1 px-6 py-5 font-bold text-lg transition-all duration-300 rounded-tl-2xl ${
                  activeTab === 'rent'
                    ? 'bg-white text-primary-600 border-b-2 border-primary-600 shadow-[0_4px_20px_-10px_rgba(227,24,55,0.3)] relative z-10'
                    : 'bg-secondary-50/50 text-secondary-500 hover:bg-white/80 hover:text-secondary-900'
                }`}
                aria-pressed={activeTab === 'rent'}
              >
                Арендовать
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sale')}
                className={`flex-1 px-6 py-5 font-bold text-lg transition-all duration-300 rounded-tr-2xl ${
                  activeTab === 'sale'
                    ? 'bg-white text-primary-600 border-b-2 border-primary-600 shadow-[0_4px_20px_-10px_rgba(227,24,55,0.3)] relative z-10'
                    : 'bg-secondary-50/50 text-secondary-500 hover:bg-white/80 hover:text-secondary-900'
                }`}
                aria-pressed={activeTab === 'sale'}
              >
                Купить
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-6 md:p-8 space-y-4">
              {/* Top Row: Location and Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Location Search */}
                <div className="md:col-span-8">
                  <div className="relative group h-full">
                    <label htmlFor="hero-search-location" className="sr-only">
                      Локация
                    </label>
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      id="hero-search-location"
                      type="text"
                      placeholder="Город, район, улица или БЦ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full min-h-[60px] pl-14 pr-4 py-4 text-lg border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="md:col-span-4">
                  <div className="relative h-full group">
                    <label htmlFor="hero-property-type" className="sr-only">
                      Тип недвижимости
                    </label>
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                    <select
                      id="hero-property-type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-full min-h-[60px] pl-14 pr-4 py-4 text-lg border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 appearance-none bg-white cursor-pointer transition-all font-medium text-secondary-900"
                    >
                      <option value="all">Любой тип</option>
                      <option value="office">Офисы</option>
                      <option value="warehouse">Склады</option>
                      <option value="shop">Магазины</option>
                      <option value="cafe_restaurant">Общепит</option>
                      <option value="industrial">Производство</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Filters & Search Button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Price Range */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 ml-1">
                    {activeTab === 'rent' ? 'Цена за месяц (сум)' : 'Стоимость (сум)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="От"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-9 pr-3 py-3.5 border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                      />
                    </div>
                    <span className="text-secondary-400">-</span>
                    <div className="relative flex-1 group">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="До"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Area Range */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 ml-1">Площадь (м²)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                      <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="От"
                        value={minArea}
                        onChange={(e) => setMinArea(e.target.value)}
                        className="w-full pl-9 pr-3 py-3.5 border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                      />
                    </div>
                    <span className="text-secondary-400">-</span>
                    <div className="relative flex-1 group">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="До"
                        value={maxArea}
                        onChange={(e) => setMaxArea(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-4">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] md:min-h-[56px] px-6 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-lg rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-primary-600/20"
                  >
                    <Search className="w-5 h-5" />
                    Показать результаты
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
