'use client'

import { TrendingUp, TrendingDown, DollarSign, Building, MapPin, BarChart3, PieChart, Activity } from 'lucide-react'

const marketTrends = [
  {
    category: 'Офисы',
    avgPrice: '45,000',
    change: '+12%',
    trend: 'up',
    demand: 'Высокий'
  },
  {
    category: 'Склады',
    avgPrice: '28,000',
    change: '+8%',
    trend: 'up',
    demand: 'Средний'
  },
  {
    category: 'Магазины',
    avgPrice: '52,000',
    change: '-3%',
    trend: 'down',
    demand: 'Высокий'
  },
  {
    category: 'Кафе/Рестораны',
    avgPrice: '38,000',
    change: '+15%',
    trend: 'up',
    demand: 'Очень высокий'
  }
]

const districts = [
  { name: 'Мирзо-Улугбекский', count: 450, avgPrice: '48,000', growth: '+18%' },
  { name: 'Чиланзарский', count: 380, avgPrice: '42,000', growth: '+12%' },
  { name: 'Яккасарайский', count: 320, avgPrice: '55,000', growth: '+8%' },
  { name: 'Юнусабадский', count: 290, avgPrice: '46,000', growth: '+15%' },
  { name: 'Сергелийский', count: 250, avgPrice: '35,000', growth: '+22%' }
]

const insights = [
  {
    icon: TrendingUp,
    title: 'Рост спроса на офисы',
    description: 'Спрос на офисные помещения вырос на 25% за последний квартал',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: DollarSign,
    title: 'Стабильные цены',
    description: 'Средняя стоимость аренды остается стабильной в течение 6 месяцев',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Building,
    title: 'Новые объекты',
    description: 'Более 200 новых коммерческих объектов добавлено за месяц',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: MapPin,
    title: 'Популярные районы',
    description: 'Мирзо-Улугбекский и Чиланзарский районы лидируют по спросу',
    color: 'from-orange-500 to-orange-600'
  }
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-sm font-medium text-primary-200 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Обновлено сегодня
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Аналитика рынка недвижимости
            </h1>
            <p className="text-xl text-secondary-200">
              Актуальные данные и тренды коммерческой недвижимости в Ташкенте
            </p>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${insight.color} rounded-xl mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-secondary-900">{insight.title}</h3>
                  <p className="text-sm text-secondary-600">{insight.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Market Trends */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-100">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">Тренды по категориям</h2>
                <p className="text-secondary-500">Средняя цена за м² в месяц (сум)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-secondary-600">Категория</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-secondary-600">Средняя цена</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-secondary-600">Изменение</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-secondary-600">Спрос</th>
                  </tr>
                </thead>
                <tbody>
                  {marketTrends.map((item, index) => (
                    <tr key={index} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-secondary-900">{item.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-secondary-900">{item.avgPrice} сум</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {item.change}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.demand === 'Очень высокий' ? 'bg-red-100 text-red-700' :
                          item.demand === 'Высокий' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.demand}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-100">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-8 h-8 text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">Популярные районы</h2>
                <p className="text-secondary-500">Топ-5 районов по количеству объектов</p>
              </div>
            </div>

            <div className="space-y-4">
              {districts.map((district, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-secondary-900 mb-1">{district.name}</div>
                    <div className="text-sm text-secondary-500">{district.count} объектов • {district.avgPrice} сум/м²</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {district.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
            <PieChart className="w-16 h-16 mx-auto mb-6 text-primary-200" />
            <h2 className="text-3xl font-bold mb-4">Хотите получать еженедельную аналитику?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Подпишитесь на нашу рассылку и получайте актуальные данные о рынке недвижимости
            </p>
            <button className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-lg">
              Подписаться на рассылку
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
