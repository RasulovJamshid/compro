'use client'

import { Building, Warehouse, ShoppingBag, Coffee, Factory, Dumbbell, Palmtree, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
  {
    icon: Building,
    title: 'Офисы',
    count: '850+',
    description: 'От 20 до 500 м²',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    type: 'office'
  },
  {
    icon: Warehouse,
    title: 'Склады',
    count: '420+',
    description: 'От 100 до 5000 м²',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    type: 'warehouse'
  },
  {
    icon: ShoppingBag,
    title: 'Магазины',
    count: '650+',
    description: 'От 30 до 300 м²',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    type: 'shop'
  },
  {
    icon: Coffee,
    title: 'Кафе/Рестораны',
    count: '280+',
    description: 'От 50 до 400 м²',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    type: 'cafe_restaurant'
  },
  {
    icon: Factory,
    title: 'Промышленные',
    count: '180+',
    description: 'От 500 до 10000 м²',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    type: 'industrial'
  },
  {
    icon: Dumbbell,
    title: 'Салоны',
    count: '120+',
    description: 'От 40 до 200 м²',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    type: 'salon'
  },
  {
    icon: Palmtree,
    title: 'Базы отдыха',
    count: '90+',
    description: 'От 1000 до 50000 м²',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    type: 'recreation'
  },
  {
    icon: MoreHorizontal,
    title: 'Другое',
    count: '200+',
    description: 'Различные типы',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600',
    type: 'other'
  },
]

export default function Categories() {
  const router = useRouter()

  const handleCategoryClick = (type: string) => {
    router.push(`/properties?propertyType=${type}`)
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
            Категории недвижимости
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Выберите подходящий тип коммерческой недвижимости для вашего бизнеса
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.type)}
                className="group relative bg-white border-2 border-secondary-100 rounded-2xl p-6 hover:border-primary-500 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${category.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${category.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                      {category.count}
                    </span>
                    <span className="text-xs text-secondary-500 font-medium">объектов</span>
                  </div>
                  
                  <p className="text-sm text-secondary-500">{category.description}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
