import { Search, FileCheck, Key, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Найдите объект',
    description: 'Используйте удобные фильтры для поиска идеального помещения. Просматривайте фото, видео и 360-туры.',
    color: 'from-blue-500 to-blue-600',
    number: '01'
  },
  {
    icon: FileCheck,
    title: 'Проверьте документы',
    description: 'Все объекты проходят проверку. Получите доступ к документам и юридической информации.',
    color: 'from-green-500 to-green-600',
    number: '02'
  },
  {
    icon: Key,
    title: 'Свяжитесь с владельцем',
    description: 'Напрямую связывайтесь с собственником или агентом. Договаривайтесь о просмотре и условиях.',
    color: 'from-purple-500 to-purple-600',
    number: '03'
  },
  {
    icon: Sparkles,
    title: 'Заключите сделку',
    description: 'Используйте наши шаблоны договоров и рекомендации для безопасной сделки.',
    color: 'from-orange-500 to-orange-600',
    number: '04'
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200">
            <span className="text-sm font-medium text-primary-700">Простой процесс</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
            Как это работает?
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Четыре простых шага к вашему идеальному коммерческому помещению
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-200 to-transparent"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-secondary-100 hover:border-primary-200 transition-all duration-300 relative z-10">
                  {/* Step number */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-secondary-200 flex items-center justify-center">
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

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            Начать поиск
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
