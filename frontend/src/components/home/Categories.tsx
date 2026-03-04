'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const categories = [
  {
    title: 'Офисы',
    count: '850+ объектов',
    description: 'Бизнес-центры, коворкинги и отдельные кабинеты',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    type: 'office'
  },
  {
    title: 'Склады и логистика',
    count: '420+ объектов',
    description: 'Складские комплексы, ангары и базы',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    type: 'warehouse'
  },
  {
    title: 'Торговые площади',
    count: '650+ объектов',
    description: 'Магазины, бутики и помещения свободного назначения',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    type: 'shop'
  },
  {
    title: 'Общепит',
    count: '280+ объектов',
    description: 'Кафе, рестораны, столовые и фудкорты',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    type: 'cafe_restaurant'
  },
  {
    title: 'Производство',
    count: '150+ объектов',
    description: 'Производственные цеха и промышленные базы',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    type: 'industrial'
  },
  {
    title: 'Земельные участки',
    count: '320+ объектов',
    description: 'Участки под коммерческую застройку',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    type: 'land'
  }
]

export default function Categories() {
  const router = useRouter()

  const handleCategoryClick = (type: string) => {
    router.push(`/properties?propertyType=${type}`)
  }

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white border-y border-secondary-200">
      <div className="container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-2 sm:mb-3">
              Категории недвижимости
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-600">
              Поиск идеального помещения по типу бизнеса
            </p>
          </div>
          <button
            onClick={() => router.push('/properties')}
            className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-base lg:text-lg transition-colors"
          >
            Все категории
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Property Type Grid - LoopNet Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {categories.map((category) => (
            <button
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative h-[260px] sm:h-[300px] lg:h-[320px] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 block w-full text-left bg-secondary-900"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
                    {category.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto overflow-hidden">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="text-center md:hidden mt-6 sm:mt-8">
          <button
            onClick={() => router.push('/properties')}
            className="inline-flex items-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4 bg-secondary-50 border border-secondary-200 rounded-xl font-bold text-secondary-900 hover:bg-secondary-100 hover:border-secondary-300 transition-all w-full justify-center text-base sm:text-lg"
          >
            Смотреть все категории
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
