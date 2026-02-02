'use client'

import { Star, Quote } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Алишер Каримов',
    role: 'Владелец сети кафе',
    avatar: 'AK',
    rating: 5,
    text: 'Нашли идеальное помещение для нашего нового кафе всего за неделю! Отличный сервис, проверенные объекты и удобный поиск.',
    company: 'Coffee House Chain'
  },
  {
    name: 'Дилноза Рахимова',
    role: 'Директор логистической компании',
    avatar: 'DR',
    rating: 5,
    text: 'Искали склад больше месяца на других платформах. Здесь нашли за 3 дня! Все документы в порядке, владелец адекватный.',
    company: 'Logistics Pro'
  },
  {
    name: 'Бахтиёр Усманов',
    role: 'Основатель IT-компании',
    avatar: 'BU',
    rating: 5,
    text: 'Переезжали в новый офис. Платформа помогла сравнить десятки вариантов и выбрать лучший. Рекомендую всем!',
    company: 'Tech Solutions'
  },
  {
    name: 'Нигора Азимова',
    role: 'Владелица салона красоты',
    avatar: 'NA',
    rating: 5,
    text: 'Очень удобно, что можно посмотреть 360-тур и фото до визита. Сэкономила кучу времени! Нашла помещение мечты.',
    company: 'Beauty Studio'
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-200">
            <span className="text-sm font-medium text-yellow-700 flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              Отзывы клиентов
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
            Что говорят наши клиенты
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Более 15,000 довольных клиентов уже нашли свои идеальные помещения
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main testimonial */}
          <div className="bg-gradient-to-br from-secondary-900 to-primary-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
            {/* Quote icon */}
            <Quote className="absolute top-8 right-8 w-24 h-24 text-white/10" />
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed font-light">
                "{testimonials[activeIndex].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{testimonials[activeIndex].name}</div>
                  <div className="text-primary-200 text-sm">{testimonials[activeIndex].role}</div>
                  <div className="text-primary-300 text-xs">{testimonials[activeIndex].company}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  activeIndex === index
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-secondary-200 bg-white hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    activeIndex === index ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-secondary-400'
                  }`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${
                      activeIndex === index ? 'text-primary-900' : 'text-secondary-900'
                    }`}>
                      {testimonial.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${
                      activeIndex === index ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-300 text-yellow-300'
                    }`} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
