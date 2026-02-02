import { Building2, Users, Target, Award, Heart, Shield, TrendingUp, Zap } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Надежность',
    description: 'Все объекты проходят тщательную проверку и модерацию перед публикацией'
  },
  {
    icon: Heart,
    title: 'Забота о клиентах',
    description: 'Мы всегда на связи и готовы помочь на каждом этапе поиска'
  },
  {
    icon: Zap,
    title: 'Инновации',
    description: 'Используем современные технологии для удобства пользователей'
  },
  {
    icon: Award,
    title: 'Качество',
    description: 'Высокие стандарты сервиса и профессиональный подход'
  }
]

const team = [
  {
    name: 'Алишер Каримов',
    role: 'CEO & Основатель',
    avatar: 'AK',
    description: '15 лет опыта в сфере недвижимости'
  },
  {
    name: 'Дилноза Рахимова',
    role: 'Директор по развитию',
    avatar: 'DR',
    description: 'Эксперт в коммерческой недвижимости'
  },
  {
    name: 'Бахтиёр Усманов',
    role: 'Технический директор',
    avatar: 'BU',
    description: 'Создатель платформы и инноваций'
  },
  {
    name: 'Нигора Азимова',
    role: 'Руководитель поддержки',
    avatar: 'NA',
    description: 'Забота о каждом клиенте'
  }
]

const stats = [
  { value: '2015', label: 'Год основания' },
  { value: '15,000+', label: 'Довольных клиентов' },
  { value: '2,500+', label: 'Активных объектов' },
  { value: '98%', label: 'Успешных сделок' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              О нашей компании
            </h1>
            <p className="text-xl md:text-2xl text-secondary-200 leading-relaxed">
              Мы создаем лучшую платформу для поиска коммерческой недвижимости в Узбекистане
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Target className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary-900">
                Наша миссия
              </h2>
              <p className="text-xl text-secondary-600 leading-relaxed">
                Мы стремимся сделать процесс поиска и аренды коммерческой недвижимости максимально простым, 
                прозрачным и безопасным. Наша цель — помочь каждому бизнесу найти идеальное помещение для роста и развития.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100 hover:shadow-lg transition-shadow">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-6">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-secondary-900">{value.title}</h3>
                    <p className="text-secondary-600 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Users className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary-900">
              Наша команда
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Профессионалы с многолетним опытом в сфере недвижимости и технологий
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg group-hover:scale-105 transition-transform">
                    {member.avatar}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary-900">{member.name}</h3>
                <div className="text-primary-600 font-medium mb-2">{member.role}</div>
                <p className="text-sm text-secondary-500">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы начать работу с нами?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Присоединяйтесь к тысячам довольных клиентов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/properties"
                className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-lg"
              >
                Найти объект
              </a>
              <a
                href="/auth/register"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Разместить объект
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
