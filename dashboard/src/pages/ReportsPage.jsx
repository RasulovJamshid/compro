import { useState } from 'react'
import { 
  FileText, Download, Calendar, TrendingUp, Users, Home,
  DollarSign, BarChart3, PieChart, Activity, CheckCircle,
  Clock, Filter, RefreshCw, FileSpreadsheet, File
} from 'lucide-react'
import { adminApi } from '../lib/api'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState('month')
  const [generating, setGenerating] = useState(false)
  const [notification, setNotification] = useState(null)

  const reportTemplates = [
    {
      id: 'properties',
      title: 'Отчет по объектам',
      description: 'Полная статистика по объектам недвижимости',
      icon: Home,
      color: 'blue',
      metrics: ['Всего объектов', 'Активные', 'Проданные/Сданные', 'На модерации'],
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'users',
      title: 'Отчет по пользователям',
      description: 'Статистика регистраций и активности пользователей',
      icon: Users,
      color: 'purple',
      metrics: ['Всего пользователей', 'Новые за период', 'Premium', 'Активность'],
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'revenue',
      title: 'Финансовый отчет',
      description: 'Доходы, платежи и подписки',
      icon: DollarSign,
      color: 'green',
      metrics: ['Общий доход', 'Подписки', 'Средний чек', 'Динамика'],
      formats: ['PDF', 'Excel']
    },
    {
      id: 'analytics',
      title: 'Аналитический отчет',
      description: 'Детальная аналитика платформы',
      icon: BarChart3,
      color: 'orange',
      metrics: ['Просмотры', 'Конверсия', 'Популярные города', 'Тренды'],
      formats: ['PDF', 'Excel']
    },
    {
      id: 'activity',
      title: 'Отчет по активности',
      description: 'Активность пользователей и модераторов',
      icon: Activity,
      color: 'indigo',
      metrics: ['Действия модераторов', 'Время отклика', 'Обработанные заявки'],
      formats: ['PDF', 'CSV']
    },
    {
      id: 'reviews',
      title: 'Отчет по отзывам',
      description: 'Статистика отзывов и рейтингов',
      icon: CheckCircle,
      color: 'pink',
      metrics: ['Всего отзывов', 'Средний рейтинг', 'Одобренные', 'Отклоненные'],
      formats: ['PDF', 'Excel', 'CSV']
    },
  ]

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleGenerateReport = async (reportId, format) => {
    setGenerating(true)
    try {
      const { startDate, endDate } = getDateRangeValues(dateRange)
      const report = reportTemplates.find(r => r.id === reportId)
      
      let reportData
      
      // Call appropriate API based on report type
      switch(reportId) {
        case 'properties':
          const propertiesResponse = await adminApi.generatePropertiesReport(startDate, endDate)
          reportData = propertiesResponse.data
          break
        case 'users':
          const usersResponse = await adminApi.generateUsersReport(startDate, endDate)
          reportData = usersResponse.data
          break
        case 'revenue':
          const revenueResponse = await adminApi.generateRevenueReport(startDate, endDate)
          reportData = revenueResponse.data
          break
        default:
          // For other reports, use existing data
          reportData = { message: 'Report type not yet implemented' }
      }
      
      // Generate and download file
      downloadReport(reportData, reportId, format)
      
      showNotification(`Отчет "${report.title}" сгенерирован в формате ${format}`)
    } catch (error) {
      console.error('Error generating report:', error)
      showNotification('Ошибка при генерации отчета', 'error')
    } finally {
      setGenerating(false)
    }
  }
  
  const getDateRangeValues = (range) => {
    const now = new Date()
    let startDate, endDate = now.toISOString()
    
    switch(range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString()
        break
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        startDate = weekAgo.toISOString()
        break
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        startDate = monthAgo.toISOString()
        break
      case 'quarter':
        const quarterAgo = new Date(now.setMonth(now.getMonth() - 3))
        startDate = quarterAgo.toISOString()
        break
      case 'year':
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1))
        startDate = yearAgo.toISOString()
        break
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
    }
    
    return { startDate, endDate }
  }
  
  const downloadReport = (data, reportId, format) => {
    const filename = `${reportId}-${dateRange}-${new Date().toISOString().split('T')[0]}`
    
    if (format === 'CSV') {
      // Convert to CSV
      const csv = convertToCSV(data, reportId)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else if (format === 'Excel') {
      // Convert to Excel-compatible CSV
      const csv = convertToCSV(data, reportId)
      const blob = new Blob([csv], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      // For PDF, download as JSON for now (would need PDF library for real implementation)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }
  
  const convertToCSV = (data, reportId) => {
    let headers, rows
    
    switch(reportId) {
      case 'properties':
        headers = ['Metric', 'Count']
        rows = [
          ['Total Properties', data.total || 0],
          ['Active', data.active || 0],
          ['Sold', data.sold || 0],
          ['Rented', data.rented || 0],
          ['Pending', data.pending || 0]
        ]
        break
      case 'users':
        headers = ['Metric', 'Count']
        rows = [
          ['Total Users', data.total || 0],
          ['New Users', data.newUsers || 0],
          ['Premium Users', data.premium || 0],
          ['Free Users', data.free || 0]
        ]
        break
      case 'revenue':
        headers = ['Metric', 'Value']
        rows = [
          ['Total Revenue', data.totalRevenue || 0],
          ['Average Transaction', data.averageTransaction || 0],
          ['Transaction Count', data.transactionCount || 0],
          ['Active Subscriptions', data.activeSubscriptions || 0]
        ]
        break
      default:
        headers = ['Data']
        rows = [[JSON.stringify(data)]]
    }
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
    }
    return colors[color] || colors.blue
  }

  const getIconBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-8">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg border ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Отчеты</h1>
            <p className="text-secondary-500">Генерация и экспорт отчетов по различным метрикам</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Сегодня</option>
              <option value="week">Эта неделя</option>
              <option value="month">Этот месяц</option>
              <option value="quarter">Квартал</option>
              <option value="year">Год</option>
              <option value="custom">Произвольный период</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Сгенерировано</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">24</p>
          <p className="text-xs text-secondary-500 mt-1">отчетов за месяц</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Последний</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">2ч</p>
          <p className="text-xs text-secondary-500 mt-1">назад</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Популярный</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-lg font-bold text-secondary-900">Объекты</p>
          <p className="text-xs text-secondary-500 mt-1">чаще всего</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Формат</span>
            <FileSpreadsheet className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-secondary-900">Excel</p>
          <p className="text-xs text-secondary-500 mt-1">предпочтительный</p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Шаблоны отчетов</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((report) => {
          const Icon = report.icon
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-secondary-100 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Header */}
              <div className={`p-6 ${getIconBgColor(report.color)} bg-opacity-10 border-b border-secondary-100`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${getIconBgColor(report.color)} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-secondary-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-secondary-600">{report.description}</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-secondary-700 mb-3">Включает:</h4>
                <div className="space-y-2 mb-4">
                  {report.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-secondary-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {metric}
                    </div>
                  ))}
                </div>

                {/* Format Buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-secondary-600 mb-2">Форматы экспорта:</p>
                  <div className="flex flex-wrap gap-2">
                    {report.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() => handleGenerateReport(report.id, format)}
                        disabled={generating}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {format === 'PDF' && <File className="w-4 h-4 text-red-500" />}
                        {format === 'Excel' && <FileSpreadsheet className="w-4 h-4 text-green-500" />}
                        {format === 'CSV' && <FileText className="w-4 h-4 text-blue-500" />}
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Недавние отчеты</h2>
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                  Отчет
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                  Период
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                  Формат
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {[
                { name: 'Отчет по объектам', period: 'Этот месяц', format: 'Excel', date: '2024-01-19 14:30' },
                { name: 'Финансовый отчет', period: 'Квартал', format: 'PDF', date: '2024-01-18 10:15' },
                { name: 'Отчет по пользователям', period: 'Эта неделя', format: 'CSV', date: '2024-01-17 16:45' },
              ].map((report, index) => (
                <tr key={index} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary-400" />
                      <span className="font-medium text-secondary-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{report.period}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 text-secondary-400" />
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Скачать">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading Overlay */}
      {generating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-secondary-900 mb-2">Генерация отчета...</p>
            <p className="text-sm text-secondary-500">Пожалуйста, подождите</p>
          </div>
        </div>
      )}
    </div>
  )
}
