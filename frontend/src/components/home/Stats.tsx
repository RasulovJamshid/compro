'use client'

import { Building2, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const getStats = (t: any) => [
  {
    icon: Building2,
    value: '2,500',
    label: t('activeObjects'),
    description: t('activeObjectsDesc'),
    color: 'from-blue-500 to-blue-600',
    suffix: '+'
  },
  {
    icon: Users,
    value: '15,000',
    label: t('happyClients'),
    description: t('happyClientsDesc'),
    color: 'from-green-500 to-green-600',
    suffix: '+'
  },
  {
    icon: TrendingUp,
    value: '98',
    label: t('salesGrowth'),
    description: t('salesGrowthDesc'),
    color: 'from-purple-500 to-purple-600',
    suffix: '%'
  },
  {
    icon: CheckCircle,
    value: '100',
    label: t('verifiedObjects'),
    description: t('verifiedObjectsDesc'),
    color: 'from-orange-500 to-orange-600',
    suffix: '%'
  },
]

export default function Stats() {
  const [animate, setAnimate] = useState(false)
  const tStats = useTranslations('Stats')
  const stats = getStats(tStats)
  const [displayValues, setDisplayValues] = useState(stats.map(s => 0))

  useEffect(() => {
    setAnimate(true)

    // Animate counter
    const interval = setInterval(() => {
      setDisplayValues(prev =>
        prev.map((_, index) => {
          const targetValue = parseInt(stats[index].value)
          const currentValue = displayValues[index]
          const increment = Math.ceil(targetValue / 30)
          return Math.min(currentValue + increment, targetValue)
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container">
        <div className="bg-gradient-to-br from-secondary-950 via-secondary-900 to-primary-950 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-elevated">
          {/* Aurora background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-15">
            <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-primary-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-accent-500 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 sm:gap-14">
              <div className="max-w-xl">
                <div className={`inline-block mb-4 sm:mb-6 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-1000 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <span className="text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">{tStats('results2024')}</span>
                </div>
                <h2 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-8 text-white font-display tracking-tight leading-[1.05] transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  {tStats('titlePart1')} <br className="hidden md:block" />
                  <span className="text-primary-300">{tStats('titlePart2')}</span>
                </h2>
                <p className={`text-base sm:text-lg text-secondary-400 font-medium leading-relaxed transition-all duration-1000 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  {tStats('desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full lg:max-w-xl">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div 
                      key={index} 
                      className={`group p-4 sm:p-6 md:p-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl sm:rounded-3xl hover:bg-white/[0.08] transition-all duration-500 cursor-default ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 sm:mb-5 shadow-lg shadow-black/20`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1.5 font-display h-10 sm:h-12 flex items-center">
                        {displayValues[index]}{stat.suffix}
                      </div>
                      <div className="text-[11px] md:text-xs font-bold text-secondary-400 uppercase tracking-widest leading-snug">{stat.label}</div>
                      <div className="text-[11px] text-secondary-500 mt-1.5">{stat.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
