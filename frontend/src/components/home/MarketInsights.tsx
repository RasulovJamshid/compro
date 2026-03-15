'use client'

import { TrendingUp, Building2, Users, Search } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslations } from 'next-intl'

const getInsights = (t: any) => [
  {
    icon: Users,
    title: t('f1Title'),
    description: t('f1Desc'),
  },
  {
    icon: Building2,
    title: t('f2Title'),
    description: t('f2Desc'),
  },
  {
    icon: TrendingUp,
    title: t('f3Title'),
    description: t('f3Desc'),
  },
  {
    icon: Search,
    title: t('f4Title'),
    description: t('f4Desc'),
  }
]

export default function MarketInsights() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 })
  const tMarket = useTranslations('MarketInsights')

  const insights = getInsights(tMarket)

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white">
      <div className="container max-w-5xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary-900 mb-4 tracking-tight">
            {tMarket('titlePart1')} {tMarket('titlePart2')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {tMarket('desc1')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {insights.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="group p-6 bg-secondary-50 card card-hover text-center flex flex-col items-center !border-secondary-100"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: `all 0.5s ease-out ${index * 100}ms`
                }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:text-primary-600 transition-colors duration-300 text-secondary-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-500">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
