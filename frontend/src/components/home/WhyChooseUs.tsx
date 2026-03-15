'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { CheckCircle2, Search, ShieldCheck, FileText, Phone, HeartHandshake as HandshakeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const getWhyUsFeatures = (t: any) => [
  {
    icon: ShieldCheck,
    title: t('f1Title'),
    description: t('f1Desc'),
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: Search,
    title: t('f2Title'),
    description: t('f2Desc'),
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: HandshakeIcon,
    title: t('f3Title'),
    description: t('f3Desc'),
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50'
  },
  {
    icon: Phone,
    title: t('f4Title'),
    description: t('f4Desc'),
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    icon: FileText,
    title: t('f5Title'),
    description: t('f5Desc'),
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    icon: CheckCircle2,
    title: t('f6Title'),
    description: t('f6Desc'),
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  }
]

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const tWhyChooseUs = useTranslations('WhyChooseUs')
  const features = getWhyUsFeatures(tWhyChooseUs)

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3">{tWhyChooseUs('subtitle')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary-900 mb-4">
            {tWhyChooseUs('title')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500">
            {tWhyChooseUs('desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease-out ${index * 80}ms`
                }}
              >
                <div className="relative h-full bg-white rounded-2xl border border-secondary-100/60 p-6 sm:p-8 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                  {/* Icon background */}
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary-500 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
