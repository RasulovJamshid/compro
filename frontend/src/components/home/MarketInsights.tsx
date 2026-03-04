'use client'

import { TrendingUp, Building2, MousePointerClick, Users } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    icon: Users,
    title: 'Самая большая аудитория',
    description: 'Более 100,000 уникальных посетителей ежемесячно ищут коммерческую недвижимость на нашей платформе.'
  },
  {
    icon: Building2,
    title: 'Максимальный охват рынка',
    description: 'Тысячи актуальных предложений от собственников, застройщиков и ведущих агентств недвижимости.'
  },
  {
    icon: MousePointerClick,
    title: 'Эффективные инструменты',
    description: 'Продвинутая аналитика, умный поиск и инструменты продвижения для быстрого заключения сделок.'
  },
  {
    icon: TrendingUp,
    title: 'Высокая конверсия',
    description: 'Целевой трафик B2B сегмента обеспечивает качественные лиды и реальные просмотры.'
  }
]

export default function MarketInsights() {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-secondary-50">
      <div className="container">
        
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight">
              Ведущая платформа <br />коммерческой недвижимости
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-600 mb-6 sm:mb-10">
              Compro.uz — это профессиональный инструмент для поиска, аренды и продажи коммерческой недвижимости в Узбекистане. Мы объединяем арендаторов, покупателей и владельцев бизнеса.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index}>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-secondary-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                alt="Современный бизнес центр"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-secondary-900">2.5K+</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-secondary-600 mt-1 uppercase tracking-wider">Объектов</div>
                  </div>
                  <div className="w-px h-12 sm:h-16 bg-secondary-200"></div>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-secondary-900">100K+</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-secondary-600 mt-1 uppercase tracking-wider">Визитов/мес</div>
                  </div>
                  <div className="w-px h-12 sm:h-16 bg-secondary-200"></div>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-primary-600">#1</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-secondary-600 mt-1 uppercase tracking-wider">Платформа</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
