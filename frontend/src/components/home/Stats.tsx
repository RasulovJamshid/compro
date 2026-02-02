import { Building2, Users, TrendingUp, CheckCircle } from 'lucide-react'

const stats = [
  {
    icon: Building2,
    value: '2,500+',
    label: 'Активных объектов',
    description: 'Офисы, склады, магазины',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Users,
    value: '15,000+',
    label: 'Довольных клиентов',
    description: 'Успешных сделок',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: TrendingUp,
    value: '98%',
    label: 'Рост продаж',
    description: 'За последний год',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: CheckCircle,
    value: '100%',
    label: 'Проверенные объекты',
    description: 'Модерация и верификация',
    color: 'from-orange-500 to-orange-600'
  },
]

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('/grid-pattern.svg')]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Цифры, которые говорят сами за себя
          </h2>
          <p className="text-lg text-secondary-300 max-w-2xl mx-auto">
            Мы гордимся нашими достижениями и продолжаем расти вместе с вами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-secondary-300">{stat.description}</div>
                
                {/* Decorative element */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
