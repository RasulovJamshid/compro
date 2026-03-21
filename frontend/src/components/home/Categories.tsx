'use client'

import { ArrowRight, Building2, Store, Factory, Coffee, Landmark, Trees } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const getCategories = (t: any) => [
  {
    title: t('offices'),
    count: `1250`,
    icon: Building2,
    type: 'office'
  },
  {
    title: t('warehouses'),
    count: `420`,
    icon: Factory,
    type: 'warehouse'
  },
  {
    title: t('retail'),
    count: `650`,
    icon: Store,
    type: 'shop'
  },
  {
    title: t('dining'),
    count: `280`,
    icon: Coffee,
    type: 'cafe_restaurant'
  },
  {
    title: t('industrial'),
    count: `150`,
    icon: Landmark,
    type: 'industrial'
  },
  {
    title: t('land'),
    count: `320`,
    icon: Trees,
    type: 'land'
  }
]

export default function Categories() {
  const router = useRouter()
  const tCat = useTranslations('Categories')
  const tHome = useTranslations('Home')
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const categories = getCategories(tCat)

  const handleCategoryClick = (type: string) => {
    router.push(`/properties?propertyType=${type}`)
  }

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-secondary-50">
      <div className="container">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">
            {tHome('categoriesTitle')}
          </h2>
          <button
            onClick={() => router.push('/properties')}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            {tHome('allCategories')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <button
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl ring-1 ring-secondary-100 shadow-sm hover:shadow-xl hover:ring-primary-200 active:scale-95 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${index * 50}ms`
              }}
            >
              <div className="w-14 h-14 rounded-full bg-secondary-50 group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-accent-500 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <category.icon className="w-7 h-7 text-secondary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-bold text-secondary-900 mb-1 group-hover:text-primary-700 transition-colors">
                {category.title}
              </h3>
              <span className="text-xs font-medium text-secondary-500 bg-secondary-50 px-2 py-0.5 rounded-full mt-1">
                {category.count} {tCat('objectsSuffix')}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="text-center md:hidden mt-6">
          <button
            onClick={() => router.push('/properties')}
            className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 bg-white border border-secondary-200 rounded-xl font-semibold text-sm text-secondary-900 hover:bg-secondary-50 transition-colors"
          >
            {tHome('allCategories')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
