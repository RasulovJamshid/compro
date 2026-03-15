'use client'

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslations } from 'next-intl'

const getTestimonials = (t: any) => [
  {
    name: t('t1Name'),
    role: t('t1Role'),
    company: 'Coffee House',
    text: t('t1Text'),
    rating: 5,
    avatar: 'АК'
  },
  {
    name: t('t2Name'),
    role: t('t2Role'),
    company: 'Logistics Pro',
    text: t('t2Text'),
    rating: 5,
    avatar: 'ДР'
  },
  {
    name: t('t3Name'),
    role: t('t3Role'),
    company: 'Tech Solutions',
    text: t('t3Text'),
    rating: 5,
    avatar: 'БУ'
  },
  {
    name: t('t4Name'),
    role: t('t4Role'),
    company: 'Beauty Style',
    text: t('t4Text'),
    rating: 5,
    avatar: 'НА'
  }
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const tTestimonials = useTranslations('Testimonials')
  
  const testimonials = getTestimonials(tTestimonials)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const goToPrevious = () => {
    setAutoPlay(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full blur-[100px] opacity-25 pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3">{tTestimonials('subtitle')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-secondary-900">
            {tTestimonials('title')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {tTestimonials('desc')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main testimonial with smooth transition */}
          <div 
            className="bg-gradient-to-br from-secondary-950 via-primary-950 to-secondary-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-elevated relative overflow-hidden mb-6 sm:mb-8 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 sm:top-8 right-4 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 text-white/10" />
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 sm:mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text with fade animation */}
              <p className="text-base sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 leading-relaxed font-light min-h-[64px] sm:min-h-[80px] transition-all duration-500">
                "{testimonials[activeIndex].text}"
              </p>

              {/* Author section */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-base sm:text-lg">{testimonials[activeIndex].name}</div>
                  <div className="text-primary-200/80 text-sm">{testimonials[activeIndex].role}</div>
                  <div className="text-primary-300/60 text-xs">{testimonials[activeIndex].company}</div>
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="flex gap-2 mt-6 sm:mt-8">
                <button
                  onClick={goToPrevious}
                  className="btn btn-icon bg-white/10 hover:bg-white/20 text-white !rounded-full"
                  title={tTestimonials('prev')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="btn btn-icon bg-white/10 hover:bg-white/20 text-white !rounded-full"
                  title={tTestimonials('next')}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail navigation with progress indicator */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index)
                  setAutoPlay(false)
                }}
                className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${
                  activeIndex === index
                    ? 'border-primary-200 bg-primary-50/60 shadow-elevated'
                    : 'border-secondary-100/80 bg-white hover:border-primary-200 shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                    activeIndex === index ? 'bg-gradient-to-br from-primary-500 to-primary-600 scale-110' : 'bg-secondary-400'
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

                {/* Progress indicator for active */}
                {activeIndex === index && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 w-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center gap-1 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary-600 w-8' : 'bg-secondary-200 w-2 hover:bg-secondary-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
