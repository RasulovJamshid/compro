import { useState, useEffect } from 'react'
import { 
  Building2, Users, Eye, TrendingUp, DollarSign, CheckCircle, Clock, 
  AlertCircle, XCircle, Star, MessageSquare, FileText, Activity,
  ArrowUp, ArrowDown, Calendar, MapPin, Home
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminApi } from '../lib/api'

export default function OverviewPage() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsResponse, analyticsResponse] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAnalytics()
      ])
      setStats(statsResponse.data)
      setAnalytics(analyticsResponse.data)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('Не удалось загрузить статистику')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-900 mb-2">Ошибка загрузки</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    { 
      title: 'Всего объектов', 
      value: stats?.totalProperties || 0, 
      icon: Building2, 
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Активные', 
      value: stats?.activeProperties || 0, 
      icon: CheckCircle, 
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'На модерации', 
      value: stats?.pendingProperties || 0, 
      icon: Clock, 
      color: 'yellow',
      change: '-5%',
      trend: 'down'
    },
    { 
      title: 'Пользователи', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'purple',
      change: '+15%',
      trend: 'up'
    },
    { 
      title: 'Просмотры', 
      value: stats?.totalViews || 0, 
      icon: Eye, 
      color: 'indigo',
      change: '+23%',
      trend: 'up'
    },
    { 
      title: 'Отзывы', 
      value: analytics?.reviewsCount || 0, 
      icon: MessageSquare, 
      color: 'pink',
      change: '+10%',
      trend: 'up'
    },
    { 
      title: 'Средний рейтинг', 
      value: '4.5', 
      icon: Star, 
      color: 'orange',
      change: '+0.3',
      trend: 'up'
    },
    { 
      title: 'Доход (UZS)', 
      value: '12.5M', 
      icon: DollarSign, 
      color: 'teal',
      change: '+18%',
      trend: 'up'
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Панель управления</h1>
        <p className="text-secondary-500">Обзор основных показателей платформы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-secondary-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900">Последние действия</h2>
            <Link to="/activity" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Все действия
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Новый объект на модерации</p>
                <p className="text-xs text-secondary-600">Офис в центре Ташкента - 250м²</p>
                <p className="text-xs text-secondary-400 mt-1">5 минут назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Новый пользователь</p>
                <p className="text-xs text-secondary-600">+998 90 123 45 67</p>
                <p className="text-xs text-secondary-400 mt-1">15 минут назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Объект одобрен</p>
                <p className="text-xs text-secondary-600">Склад в Сергели - 1000м²</p>
                <p className="text-xs text-secondary-400 mt-1">30 минут назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Новый отзыв</p>
                <p className="text-xs text-secondary-600">Рейтинг: 5 звезд</p>
                <p className="text-xs text-secondary-400 mt-1">1 час назад</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <Link to="/properties?status=pending" className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Проверить объекты</p>
                  <p className="text-sm text-secondary-500">{stats?.pendingProperties || 0} на модерации</p>
                </div>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </Link>
            <Link to="/users" className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Пользователи</p>
                  <p className="text-sm text-secondary-500">{stats?.totalUsers || 0} всего</p>
                </div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </Link>
            <Link to="/reviews" className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Отзывы</p>
                  <p className="text-sm text-secondary-500">Модерация</p>
                </div>
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </Link>
            <Link to="/analytics" className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Аналитика</p>
                  <p className="text-sm text-secondary-500">Статистика</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section - Popular Cities & Top Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Cities */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900">Популярные города</h2>
            <MapPin className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-3">
            {analytics?.propertiesByCity?.slice(0, 5).map((city, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{city.city}</p>
                    <p className="text-xs text-secondary-500">{city.count} объектов</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(city.count / analytics?.propertiesByCity[0]?.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-center text-secondary-500 py-4">Нет данных</p>
            )}
          </div>
        </div>

        {/* Top Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900">ТОП объекты</h2>
            <TrendingUp className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-3">
            {analytics?.topViewedProperties?.slice(0, 5).map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 truncate">{property.title}</p>
                    <p className="text-xs text-secondary-500">{property.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Eye className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm font-medium text-secondary-600">{property.views}</span>
                </div>
              </div>
            )) || (
              <p className="text-center text-secondary-500 py-4">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
