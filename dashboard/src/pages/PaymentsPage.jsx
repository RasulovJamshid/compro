import { useState, useEffect } from 'react'
import { 
  CreditCard, DollarSign, TrendingUp, Calendar, Search, Filter,
  Download, RefreshCw, CheckCircle, XCircle, Clock, Users,
  Award, ArrowUp, ArrowDown, Eye, MoreVertical
} from 'lucide-react'
import { adminApi } from '../lib/api'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    lastMonth: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0
  })

  useEffect(() => {
    fetchPayments()
  }, [statusFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter

      const [transactionsResponse, statsResponse] = await Promise.all([
        adminApi.getTransactions(params),
        adminApi.getTransactionStats()
      ])

      // Handle paginated response (new format) or legacy array format
      const paymentsData = transactionsResponse.data.data || transactionsResponse.data
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
      setStats({
        totalRevenue: statsResponse.data.totalRevenue,
        thisMonth: statsResponse.data.thisMonthRevenue,
        lastMonth: statsResponse.data.lastMonthRevenue,
        totalTransactions: statsResponse.data.completedCount + statsResponse.data.pendingCount + statsResponse.data.failedCount,
        successfulTransactions: statsResponse.data.completedCount,
        pendingTransactions: statsResponse.data.pendingCount,
        failedTransactions: statsResponse.data.failedCount,
      })
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'User', 'Phone', 'Amount', 'Plan', 'Status', 'Method', 'Date']
    const csvData = filteredPayments.map(p => [
      p.transactionId,
      p.userName,
      p.userPhone,
      p.amount,
      p.plan,
      p.status,
      p.paymentMethod,
      new Date(p.createdAt).toLocaleDateString()
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusBadge = (status) => {
    const config = {
      success: { label: 'Успешно', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      pending: { label: 'Ожидание', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      failed: { label: 'Отклонено', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    }
    const { label, className, icon: Icon } = config[status] || config.pending
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    )
  }

  const getPaymentMethodLabel = (method) => {
    const methods = {
      card: 'Банк. карта',
      payme: 'Payme',
      click: 'Click',
      uzum: 'Uzum',
    }
    return methods[method] || method
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userPhone.includes(searchQuery) ||
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Платежи</h1>
            <p className="text-secondary-500">История транзакций и подписок</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Экспорт
            </button>
            <button
              onClick={fetchPayments}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Общий доход</p>
          <p className="text-3xl font-bold mb-2">{stats.totalRevenue.toLocaleString()} сум</p>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4" />
            <span>+15% от прошлого месяца</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Успешные платежи</p>
          <p className="text-3xl font-bold mb-2">{stats.successfulTransactions}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Из {stats.totalTransactions} транзакций</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">В ожидании</p>
          <p className="text-3xl font-bold mb-2">{stats.pendingTransactions}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Требуют проверки</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Отклоненные</p>
          <p className="text-3xl font-bold mb-2">{stats.failedTransactions}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Неудачные платежи</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Поиск по имени, телефону, ID транзакции..."
              className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="success">Успешные</option>
            <option value="pending">В ожидании</option>
            <option value="failed">Отклоненные</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-secondary-600">
          <span>Найдено: <strong>{filteredPayments.length}</strong></span>
          <span>•</span>
          <span>Всего: <strong>{payments.length}</strong></span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка платежей...</p>
            </div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-secondary-300 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg font-medium text-secondary-900 mb-2">Платежи не найдены</p>
            <p className="text-secondary-500">Попробуйте изменить фильтры поиска</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Транзакция
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    План
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Метод
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-sm font-medium text-secondary-900">{payment.transactionId}</p>
                        <p className="text-xs text-secondary-500">ID: {payment.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary-900">{payment.userName}</p>
                        <p className="text-sm text-secondary-500">{payment.userPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        <Award className="w-3 h-3" />
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-secondary-900">{payment.amount.toLocaleString()} сум</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-secondary-700">{getPaymentMethodLabel(payment.paymentMethod)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        {new Date(payment.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
