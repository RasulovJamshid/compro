'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Eye, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api/client'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  pendingProperties: number
  totalUsers: number
  totalViews: number
  totalRevenue: number
  verifiedProperties: number
  topProperties: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await apiClient.get('/admin/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Всего объектов',
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Активные',
      value: stats?.activeProperties || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'На модерации',
      value: stats?.pendingProperties || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Пользователи',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Просмотры',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Проверенные',
      value: stats?.verifiedProperties || 0,
      icon: CheckCircle,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      title: 'ТОП объекты',
      value: stats?.topProperties || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Доход',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} сум`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Панель управления</h1>
        <p className="text-secondary-500">Обзор основных показателей платформы</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-secondary-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Последние действия</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Новый объект на модерации</p>
                <p className="text-xs text-secondary-500">5 минут назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Объект одобрен</p>
                <p className="text-xs text-secondary-500">15 минут назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Новый пользователь</p>
                <p className="text-xs text-secondary-500">1 час назад</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/properties?status=pending"
              className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Проверить объекты</p>
                  <p className="text-sm text-secondary-500">{stats?.pendingProperties || 0} на модерации</p>
                </div>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </a>
            <a
              href="/dashboard/users"
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Управление пользователями</p>
                  <p className="text-sm text-secondary-500">{stats?.totalUsers || 0} пользователей</p>
                </div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </a>
            <a
              href="/dashboard/analytics"
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Посмотреть аналитику</p>
                  <p className="text-sm text-secondary-500">Детальная статистика</p>
                </div>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
