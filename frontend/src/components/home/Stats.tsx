'use client'

import { Building2, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const stats = [
  {
    icon: Building2,
    value: '2,500',
    label: 'Активных объектов',
    description: 'Офисы, склады, магазины',
    color: 'from-blue-500 to-blue-600',
    suffix: '+'
  },
  {
    icon: Users,
    value: '15,000',
    label: 'Довольных клиентов',
    description: 'Успешных сделок',
    color: 'from-green-500 to-green-600',
    suffix: '+'
  },
  {
    icon: TrendingUp,
    value: '98',
    label: 'Рост продаж',
    description: 'За последний год',
    color: 'from-purple-500 to-purple-600',
    suffix: '%'
  },
  {
    icon: CheckCircle,
    value: '100',
    label: 'Проверенные объекты',
    description: 'Модерация и верификация',
    color: 'from-orange-500 to-orange-600',
    suffix: '%'
  },
]

export default function Stats() {
  const [animate, setAnimate] = useState(false)
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
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-secondary-900 via-slate-800 to-secondary-900 rounded-[48px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Aurora background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl">
                <div className={`inline-block mb-6 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-1000 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <span className="text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">Результаты 2024</span>
                </div>
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-white font-display tracking-tight leading-[1.05] transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  Платформа, которой <br className="hidden md:block" />
                  <span className="text-primary-400">доверяют лидеры</span>
                </h2>
                <p className={`text-xl text-secondary-300 font-medium leading-relaxed transition-all duration-1000 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  Мы создали экосистему, в которой каждая сделка становится прозрачной, а поиск — эффективным инструментом роста вашего бизнеса.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full lg:max-w-2xl">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div 
                      key={index} 
                      className={`group p-6 md:p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all duration-500 hover:scale-105 active:scale-95 cursor-default ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:rotate-6 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-2 font-display h-12 flex items-center">
                        {displayValues[index]}{stat.suffix}
                      </div>
                      <div className="text-xs md:text-sm font-bold text-secondary-400 uppercase tracking-widest leading-snug">{stat.label}</div>
                      <div className="text-xs text-secondary-500 mt-2">{stat.description}</div>
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
