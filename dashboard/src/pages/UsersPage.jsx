import { useState, useEffect } from 'react'
import { Search, Shield, User as UserIcon, Crown, Filter, RefreshCw, Download, Mail, Phone, Calendar, CheckCircle, XCircle, Edit, Trash2, MoreVertical, Users, TrendingUp, Award, Eye } from 'lucide-react'
import { adminApi } from '../lib/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [notification, setNotification] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    moderators: 0,
    premium: 0,
    free: 0,
    guests: 0
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await adminApi.getUsers()
      
      // Handle paginated response (new format) or legacy array format
      const usersData = data.data || data
      const usersArray = Array.isArray(usersData) ? usersData : []
      setUsers(usersArray)
      
      // Calculate statistics
      const statsData = {
        total: usersArray.length,
        admins: usersArray.filter(u => u.role === 'admin').length,
        moderators: usersArray.filter(u => u.role === 'moderator').length,
        premium: usersArray.filter(u => u.role === 'premium').length,
        free: usersArray.filter(u => u.role === 'free').length,
        guests: usersArray.filter(u => u.role === 'guest').length
      }
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      showNotification('Ошибка загрузки пользователей', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole)
      showNotification(`Роль изменена на "${newRole}"`)
      fetchUsers()
    } catch (error) {
      console.error('Failed to update role:', error)
      showNotification('Ошибка изменения роли', 'error')
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Phone', 'Name', 'Email', 'Role', 'Created At']
    const csvData = filteredUsers.map(u => [
      u.id,
      u.phone,
      `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A',
      u.email || 'N/A',
      u.role,
      new Date(u.createdAt).toLocaleDateString()
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showNotification('Пользователи экспортированы')
  }

  const getRoleBadge = (role) => {
    const config = {
      admin: { label: 'Администратор', className: 'bg-red-100 text-red-700 border-red-200', icon: Crown },
      moderator: { label: 'Модератор', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: Shield },
      premium: { label: 'Premium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Award },
      free: { label: 'Бесплатный', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: UserIcon },
      guest: { label: 'Гость', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: UserIcon },
    }
    const { label, className, icon: Icon } = config[role] || config.guest
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    )
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.phone.includes(searchQuery) || 
                         u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="p-8">
      {notification && (
        <div className={`mb-4 p-4 rounded-lg border ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Управление пользователями</h1>
            <p className="text-secondary-500">Просмотр и управление пользователями системы</p>
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
              onClick={fetchUsers}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Всего</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Админы</span>
            <Crown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.admins}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Модераторы</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.moderators}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Premium</span>
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.premium}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Бесплатные</span>
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.free}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Гости</span>
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.guests}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Поиск по телефону, имени, email..."
              className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Все роли</option>
            <option value="admin">Администраторы</option>
            <option value="moderator">Модераторы</option>
            <option value="premium">Premium</option>
            <option value="free">Бесплатные</option>
            <option value="guest">Гости</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-secondary-600">
          <span>Найдено: <strong>{filteredUsers.length}</strong></span>
          <span>•</span>
          <span>Всего: <strong>{users.length}</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка пользователей...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-secondary-300 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg font-medium text-secondary-900 mb-2">Пользователи не найдены</p>
            <p className="text-secondary-500">Попробуйте изменить фильтры поиска</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Контакты
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-sm">
                          {(user.firstName?.[0] || user.phone[4] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">
                            {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Без имени'}
                          </p>
                          <p className="text-xs text-secondary-500 font-mono">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-secondary-900">
                          <Phone className="w-4 h-4 text-secondary-400" />
                          {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-secondary-600">
                            <Mail className="w-4 h-4 text-secondary-400" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-100 hover:border-primary-300 transition-colors"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          title="Изменить роль"
                        >
                          <option value="guest">Гость</option>
                          <option value="free">Бесплатный</option>
                          <option value="premium">Premium</option>
                          <option value="moderator">Модератор</option>
                          <option value="admin">Администратор</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary-900">Детали пользователя</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-lg">
                  {(selectedUser.firstName?.[0] || selectedUser.phone[4] || 'U').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">
                    {selectedUser.firstName || selectedUser.lastName ? 
                      `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() : 
                      'Без имени'}
                  </h3>
                  <p className="text-sm text-secondary-500 font-mono">ID: {selectedUser.id}</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-secondary-900 mb-3">Контактная информация</h4>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-xs text-secondary-500">Телефон</p>
                    <p className="font-medium text-secondary-900">{selectedUser.phone}</p>
                  </div>
                </div>

                {selectedUser.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-xs text-secondary-500">Email</p>
                      <p className="font-medium text-secondary-900">{selectedUser.email}</p>
                    </div>
                  </div>
                )}

                {selectedUser.company && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-xs text-secondary-500">Компания</p>
                      <p className="font-medium text-secondary-900">{selectedUser.company}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Details */}
              <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-secondary-900 mb-3">Детали аккаунта</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-secondary-500 mb-1">Дата регистрации</p>
                    <p className="font-medium text-secondary-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-secondary-500 mb-1">Последнее обновление</p>
                    <p className="font-medium text-secondary-900">
                      {new Date(selectedUser.updatedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
