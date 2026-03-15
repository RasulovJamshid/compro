'use client'

import { useEffect, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { TrendingUp, Users, Building2, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

const getStats = (tHome: any) => [
  {
    icon: Building2,
    value: '2500',
    suffix: '+',
    label: tHome('statsObjects'),
    description: tHome('statsObjectsDesc')
  },
  {
    icon: Users,
    value: '15000',
    suffix: '+',
    label: tHome('statsActiveUsers'),
    description: tHome('statsActiveUsersDesc')
  },
  {
    icon: TrendingUp,
    value: '100',
    suffix: 'K+',
    label: tHome('statsVisits'),
    description: tHome('statsVisitsDesc')
  },
  {
    icon: Zap,
    value: '24',
    suffix: '/7',
    label: tHome('statsSupport'),
    description: tHome('statsSupportDesc')
  }
]

function AnimatedCounter({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = target / steps
    let current = 0
    let stepCount = 0

    const interval = setInterval(() => {
      current += increment
      stepCount++

      if (stepCount >= steps) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [isVisible, target])

  return <>{count}</>
}

export default function AnimatedStats() {
  const tHome = useTranslations('Home')
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  
  const stats = getStats(tHome)

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-2">{tHome('statsResults')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary-900 mb-4">
            {tHome('statsTitle')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {tHome('statsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${index * 100}ms`
                }}
              >
                <div className="relative bg-white rounded-2xl border border-secondary-100/60 p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 h-full flex flex-col">
                  {/* Icon background */}
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>

                  {/* Stats value */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-primary-600">
                      <AnimatedCounter target={parseInt(stat.value)} isVisible={isVisible} />
                    </span>
                    <span className="text-2xl font-bold text-primary-500">{stat.suffix}</span>
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-1">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-secondary-500 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Hover accent line */}
                  <div className="mt-4 h-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
