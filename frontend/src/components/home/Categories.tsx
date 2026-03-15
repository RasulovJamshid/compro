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
              className="group flex flex-col items-center justify-center p-6 card card-hover active:scale-95 text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${index * 50}ms`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary-50 group-hover:bg-primary-50 flex items-center justify-center mb-3 transition-colors duration-300">
                <category.icon className="w-6 h-6 text-secondary-500 group-hover:text-primary-600 transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-secondary-900 mb-1 group-hover:text-primary-700 transition-colors">
                {category.title}
              </h3>
              <span className="text-xs text-secondary-500">
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
