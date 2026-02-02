import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'Бесплатный доступ к базе объектов',
  'Проверенные объявления',
  'Прямая связь с владельцами',
  'Юридическая поддержка'
]

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Присоединяйтесь к 15,000+ довольных клиентов
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Готовы найти идеальное<br />
            помещение для бизнеса?
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto font-light">
            Начните поиск прямо сейчас и получите доступ ко всем функциям платформы
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              Начать поиск
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 w-full sm:w-auto justify-center"
            >
              Разместить объект
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2,500+</div>
                <div className="text-sm">Активных объектов</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">15,000+</div>
                <div className="text-sm">Довольных клиентов</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm">Успешных сделок</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
