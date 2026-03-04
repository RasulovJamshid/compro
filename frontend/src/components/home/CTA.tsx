'use client'

import { ArrowRight, Building2, Users } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-secondary-600">
            Присоединяйтесь к тысячам профессионалов на ведущей платформе коммерческой недвижимости
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* For Tenants/Buyers Card */}
          <div className="relative overflow-hidden rounded-2xl group min-h-[400px] flex flex-col justify-end">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop")',
              }}
            ></div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/80 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-end">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                Ищете помещение?
              </h3>
              
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Найдите идеальный офис, склад или торговую площадь среди 2,500+ проверенных объектов от собственников.
              </p>

              <Link
                href="/properties"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors w-fit text-lg"
              >
                Начать поиск
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* For Landlords/Sellers Card */}
          <div className="relative overflow-hidden rounded-2xl group min-h-[400px] flex flex-col justify-end">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop")',
              }}
            ></div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/80 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-end">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                Есть объект?
              </h3>
              
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Разместите свою недвижимость и получите доступ к 15,000+ активных арендаторов и покупателей ежемесячно.
              </p>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-secondary-50 text-secondary-900 font-bold rounded-xl transition-colors w-fit text-lg"
              >
                Добавить объявление
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
