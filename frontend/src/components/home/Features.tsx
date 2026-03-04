'use client'

import { CheckCircle, Camera, Video, MapPin, Zap, Shield } from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: CheckCircle,
    title: 'Проверенные объекты',
    description: 'Все объекты проходят модерацию и проверку',
    details: 'Каждое объявление проходит ручную верификацию. Мы проверяем юридическую чистоту и соответствие фактических данных.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Camera,
    title: 'Профессиональная съёмка',
    description: 'Качественные фото от профессиональных фотографов',
    details: 'Все фото обработаны и водяные знаки нанесены профессионально для защиты авторских прав.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Video,
    title: '360-туры и видео',
    description: 'Виртуальные туры и видеообзоры объектов',
    details: 'Осмотрите помещение со всех сторон не выходя из офиса с помощью панорам 360°.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: MapPin,
    title: 'Точная локация',
    description: 'Интерактивная карта с точными адресами',
    details: 'Интерактивные карты с инфраструктурой и транспортной доступностью для удобного выбора.',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Zap,
    title: 'Быстрый поиск',
    description: 'Умный алгоритм подбора',
    details: 'Фильтры работают мгновенно, находя идеальные варианты в миллисекунды.',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Shield,
    title: 'Безопасность сделок',
    description: 'Защита ваших интересов',
    details: 'Рекомендации и шаблоны договоров от юридических специалистов.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
]

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-secondary-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white border border-secondary-100 rounded-full shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-[0.2em]">Наши преимущества</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-secondary-900 font-display tracking-tight leading-[1.1]">
            Стандарт профессиональной <br className="hidden md:block" />
            <span className="text-primary-600 italic">коммерции</span>
          </h2>
          <p className="text-xl text-secondary-500 font-medium">
            Мы переосмыслили процесс поиска недвижимости, внедрив технологии <br className="hidden md:block" />
            проверки и визуализации мирового уровня.
          </p>
        </div>
        
        {/* Modern grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`group relative text-left p-8 rounded-[32px] border-2 transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-xl'
                    : 'border-secondary-100 bg-white hover:border-primary-300 hover:shadow-lg'
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
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${feature.bgColor} ${isHovered || isSelected ? 'scale-110' : ''}`}>
                    <Icon className={`w-7 h-7 transition-all duration-300`} style={{
                      color: feature.color.includes('green') ? 'rgb(34, 197, 94)' :
                             feature.color.includes('blue') ? 'rgb(59, 130, 246)' :
                             feature.color.includes('purple') ? 'rgb(147, 51, 234)' :
                             feature.color.includes('red') ? 'rgb(220, 38, 38)' :
                             feature.color.includes('yellow') ? 'rgb(202, 138, 4)' :
                             'rgb(79, 70, 229)'
                    }} />
                  </div>

                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isSelected ? 'text-primary-900' : 'text-secondary-900'}`}>
                    {feature.title}
                  </h3>

                  <p className={`text-sm transition-colors duration-300 ${isSelected ? 'text-primary-700' : 'text-secondary-500'} mb-4`}>
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
        <div className="mt-16 text-center">
          <p className="text-secondary-600 font-medium">
            🎯 Выбирайте надежную платформу для ваших коммерческих решений
          </p>
        </div>
      </div>
    </section>
  )
}
