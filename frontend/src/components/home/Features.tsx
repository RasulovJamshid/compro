'use client'

import { Shield, Target, Map, LineChart, MessageSquare, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const getFeatures = (t: any) => [
  {
    icon: Shield,
    title: t('f1Title'),
    description: t('f1Desc'),
    details: t('f1Det'),
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Target,
    title: t('f2Title'),
    description: t('f2Desc'),
    details: t('f2Det'),
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: LineChart,
    title: t('f3Title'),
    description: t('f3Desc'),
    details: t('f3Det'),
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: MessageSquare,
    title: t('f4Title'),
    description: t('f4Desc'),
    details: t('f4Det'),
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Zap,
    title: t('f5Title'),
    description: t('f5Desc'),
    details: t('f5Det'),
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Shield,
    title: t('f6Title'),
    description: t('f6Desc'),
    details: t('f6Det'),
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
]

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const tFeatures = useTranslations('Features')
  
  const features = getFeatures(tFeatures)

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-secondary-50/50 to-white">
      <div className="container">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-20">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3">{tFeatures('subtitle')}</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-secondary-900 font-display tracking-tight leading-[1.1]">
            {tFeatures('titlePart1')} <br className="hidden md:block" />
            <span className="text-primary-600">{tFeatures('titlePart2')}</span>
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl">
            {tFeatures('desc')}
          </p>
        </div>
        
        {/* Modern grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isSelected = selectedFeature === index
            const isHovered = hoveredIndex === index

            return (
              <button
                key={index}
                onClick={() => setSelectedFeature(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative text-left p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-primary-200 bg-primary-50/70 shadow-elevated'
                    : 'border-secondary-100/80 bg-white hover:border-primary-200 shadow-card hover:shadow-card-hover'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-0 transition-opacity duration-300 ${isHovered || isSelected ? 'opacity-10' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, var(--color-start), var(--color-end))`,
                    '--color-start': 'rgb(59, 130, 246)',
                    '--color-end': 'rgb(37, 99, 235)',
                  } as any}
                />

                <div className="relative z-10">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 ${feature.bgColor} ${isHovered || isSelected ? 'scale-110' : ''}`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300`} style={{
                      color: feature.color.includes('green') ? 'rgb(34, 197, 94)' :
                             feature.color.includes('blue') ? 'rgb(59, 130, 246)' :
                             feature.color.includes('purple') ? 'rgb(147, 51, 234)' :
                             feature.color.includes('red') ? 'rgb(220, 38, 38)' :
                             feature.color.includes('yellow') ? 'rgb(202, 138, 4)' :
                             'rgb(79, 70, 229)'
                    }} />
                  </div>

                  <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${isSelected ? 'text-primary-900' : 'text-secondary-900'}`}>
                    {feature.title}
                  </h3>

                  <p className={`text-sm transition-colors duration-300 ${isSelected ? 'text-primary-700' : 'text-secondary-500'} mb-3 sm:mb-4`}>
                    {feature.description}
                  </p>

                  {/* Expandable details */}
                  <div className={`overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-3 border-t border-secondary-100/30">
                      <p className="text-sm text-secondary-600 leading-relaxed">
                        {feature.details}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shine effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom accent */}
        <div className="mt-10 sm:mt-16 text-center">
          <p className="text-secondary-500 font-medium text-sm">
            {tFeatures('footerText')}
          </p>
        </div>
      </div>
    </section>
  )
}
