'use client'

import { Search, FileCheck, Phone, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const getSteps = (t: any) => [
  {
    icon: Search,
    title: t('s1Title'),
    description: t('s1Desc'),
    color: 'from-blue-500 to-blue-600',
    number: '01'
  },
  {
    icon: FileCheck,
    title: t('s2Title'),
    description: t('s2Desc'),
    color: 'from-emerald-500 to-emerald-600',
    number: '02'
  },
  {
    icon: Phone,
    title: t('s3Title'),
    description: t('s3Desc'),
    color: 'from-violet-500 to-violet-600',
    number: '03'
  },
  {
    icon: Sparkles,
    title: t('s4Title'),
    description: t('s4Desc'),
    color: 'from-orange-500 to-orange-600',
    number: '04'
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const tHowItWorks = useTranslations('HowItWorks')
  const steps = getSteps(tHowItWorks)

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-secondary-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-primary-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-accent-200 rounded-full blur-[100px] opacity-15 pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3">{tHowItWorks('subtitle')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-secondary-900">
            {tHowItWorks('title')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto">
            {tHowItWorks('desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 relative">
          {/* Animated connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index

            return (
              <div key={index} className="relative">
                {/* Step card with enhanced interactivity */}
                <button
                  onClick={() => setActiveStep(index)}
                  className={`group w-full bg-white rounded-2xl p-5 sm:p-7 border transition-all duration-300 text-left ${
                    isActive
                      ? 'border-primary-200 shadow-elevated bg-primary-50/60'
                      : 'border-secondary-100/80 shadow-card hover:shadow-card-hover hover:border-primary-200'
                  }`}
                >
                  {/* Step number badge */}
                  <div className={`absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${step.color} rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <span className="text-white font-bold text-base sm:text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} rounded-xl mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300 ${isActive ? 'text-primary-900' : 'text-secondary-900 group-hover:text-primary-600'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm sm:text-base transition-colors duration-300 ${isActive ? 'text-primary-700' : 'text-secondary-600'} leading-relaxed`}>
                    {step.description}
                  </p>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <div className="text-xs font-semibold text-primary-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                        {tHowItWorks('selectedStep')}
                      </div>
                    </div>
                  )}
                </button>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-secondary-200 flex items-center justify-center group-hover:border-primary-500 transition-colors">
                      <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeStep ? 'bg-primary-600 w-8' : 'bg-secondary-200 w-2 hover:bg-secondary-300'
              }`}
            ></button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-16">
          <a
            href="/properties"
            className="btn btn-lg btn-primary"
          >
            {tHowItWorks('btn')}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
