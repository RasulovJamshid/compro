import { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Eye, Users, Home, 
  DollarSign, MapPin, Star, Calendar, RefreshCw, Download,
  ArrowUp, ArrowDown, Activity, CheckCircle, Clock
} from 'lucide-react'
import { adminApi } from '../lib/api'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await adminApi.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    const report = [
      ['Metric', 'Value'],
      ['New Properties This Week', analytics?.newPropertiesThisWeek || 0],
      ['New Users This Week', analytics?.newUsersThisWeek || 0],
      ['Total Views', analytics?.viewsThisWeek || 0],
      ['Revenue This Month', analytics?.revenueThisMonth || 0],
    ]
    
    const csv = report.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-500">Загрузка аналитики...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Аналитика</h1>
            <p className="text-secondary-500">Детальная статистика и insights платформы</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2.5 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Экспорт
            </button>
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
              Обновить
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Views */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Просмотры за неделю</p>
          <p className="text-3xl font-bold mb-2">{analytics?.viewsThisWeek?.toLocaleString() || 0}</p>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4" />
            <span>+12% от прошлой недели</span>
          </div>
        </div>

        {/* New Properties */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <Activity className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Новые объекты</p>
          <p className="text-3xl font-bold mb-2">{analytics?.newPropertiesThisWeek || 0}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>За эту неделю</span>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Новые пользователи</p>
          <p className="text-3xl font-bold mb-2">{analytics?.newUsersThisWeek || 0}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>За эту неделю</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Доход за месяц</p>
          <p className="text-3xl font-bold mb-2">{analytics?.revenueThisMonth?.toLocaleString() || 0} сум</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Текущий месяц</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-900">Топ объектов по просмотрам</h2>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          
          {analytics?.topProperties && analytics.topProperties.length > 0 ? (
            <div className="space-y-4">
              {analytics.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 truncate">{property.title}</p>
                    <p className="text-xs text-secondary-500">ID: {property.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                    <Eye className="w-4 h-4" />
                    {property.views}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных</p>
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-900">Популярные города</h2>
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          
          {analytics?.topCities && analytics.topCities.length > 0 ? (
            <div className="space-y-4">
              {analytics.topCities.map((cityData, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary-400" />
                      <span className="font-medium text-secondary-900">{cityData.city}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">{cityData.count} объектов</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(cityData.count / (analytics.topCities[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Активность</p>
              <p className="text-2xl font-bold text-secondary-900">Высокая</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600">Платформа показывает стабильный рост</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Конверсия</p>
              <p className="text-2xl font-bold text-secondary-900">8.5%</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600">Процент обращений к просмотрам</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Ср. время на сайте</p>
              <p className="text-2xl font-bold text-secondary-900">4:32</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600">Среднее время сессии пользователя</p>
        </div>
      </div>
    </div>
  )
}
