'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Eye, Building2, Users, DollarSign } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

interface AnalyticsData {
  viewsToday: number
  viewsYesterday: number
  viewsThisWeek: number
  viewsLastWeek: number
  newPropertiesThisWeek: number
  newPropertiesLastWeek: number
  newUsersThisWeek: number
  newUsersLastWeek: number
  revenueThisMonth: number
  revenueLastMonth: number
  topProperties: Array<{
    id: string
    title: string
    views: number
  }>
  topCities: Array<{
    city: string
    count: number
  }>
}

export default function DashboardAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data } = await apiClient.get('/admin/analytics')
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percent: 0, isPositive: true }
    const percent = ((current - previous) / previous) * 100
    return { percent: Math.abs(percent).toFixed(1), isPositive: percent >= 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Загрузка аналитики...</p>
        </div>
      </div>
    )
  }

  const viewsChange = calculateChange(analytics?.viewsToday || 0, analytics?.viewsYesterday || 0)
  const propertiesChange = calculateChange(analytics?.newPropertiesThisWeek || 0, analytics?.newPropertiesLastWeek || 0)
  const usersChange = calculateChange(analytics?.newUsersThisWeek || 0, analytics?.newUsersLastWeek || 0)
  const revenueChange = calculateChange(analytics?.revenueThisMonth || 0, analytics?.revenueLastMonth || 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Аналитика</h1>
        <p className="text-secondary-500">Детальная статистика и метрики платформы</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${viewsChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {viewsChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {viewsChange.percent}%
            </div>
          </div>
          <h3 className="text-secondary-500 text-sm font-medium mb-1">Просмотры сегодня</h3>
          <p className="text-2xl font-bold text-secondary-900">{analytics?.viewsToday || 0}</p>
          <p className="text-xs text-secondary-400 mt-1">Вчера: {analytics?.viewsYesterday || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${propertiesChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {propertiesChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {propertiesChange.percent}%
            </div>
          </div>
          <h3 className="text-secondary-500 text-sm font-medium mb-1">Новые объекты</h3>
          <p className="text-2xl font-bold text-secondary-900">{analytics?.newPropertiesThisWeek || 0}</p>
          <p className="text-xs text-secondary-400 mt-1">За эту неделю</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${usersChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {usersChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {usersChange.percent}%
            </div>
          </div>
          <h3 className="text-secondary-500 text-sm font-medium mb-1">Новые пользователи</h3>
          <p className="text-2xl font-bold text-secondary-900">{analytics?.newUsersThisWeek || 0}</p>
          <p className="text-xs text-secondary-400 mt-1">За эту неделю</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${revenueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {revenueChange.percent}%
            </div>
          </div>
          <h3 className="text-secondary-500 text-sm font-medium mb-1">Доход за месяц</h3>
          <p className="text-2xl font-bold text-secondary-900">{(analytics?.revenueThisMonth || 0).toLocaleString()} сум</p>
          <p className="text-xs text-secondary-400 mt-1">Прошлый месяц: {(analytics?.revenueLastMonth || 0).toLocaleString()} сум</p>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Популярные объекты</h2>
          <div className="space-y-3">
            {analytics?.topProperties && analytics.topProperties.length > 0 ? (
              analytics.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 text-sm">{property.title}</p>
                      <p className="text-xs text-secondary-500">ID: {property.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-secondary-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{property.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-secondary-500 py-4">Нет данных</p>
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Популярные города</h2>
          <div className="space-y-3">
            {analytics?.topCities && analytics.topCities.length > 0 ? (
              analytics.topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="font-medium text-secondary-900">{city.city}</p>
                  </div>
                  <div className="flex items-center gap-1 text-secondary-600">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{city.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-secondary-500 py-4">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
