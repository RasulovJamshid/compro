'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, User as UserIcon, Crown, Ban } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import type { User } from '@/lib/types'

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/admin/users')
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole })
      fetchUsers()
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.phone.includes(searchQuery) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; className: string; icon: any }> = {
      admin: { label: 'Администратор', className: 'bg-red-100 text-red-700', icon: Shield },
      moderator: { label: 'Модератор', className: 'bg-purple-100 text-purple-700', icon: Shield },
      premium: { label: 'Premium', className: 'bg-yellow-100 text-yellow-700', icon: Crown },
      free: { label: 'Бесплатный', className: 'bg-blue-100 text-blue-700', icon: UserIcon },
      guest: { label: 'Гость', className: 'bg-gray-100 text-gray-700', icon: UserIcon },
    }

    const config = roleConfig[role] || roleConfig.guest
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Управление пользователями</h1>
        <p className="text-secondary-500">Просмотр и управление пользователями платформы</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Поиск по телефону, имени или email..."
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка пользователей...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-500">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
                          {user.firstName ? user.firstName[0].toUpperCase() : user.phone[0]}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : 'Без имени'}
                          </p>
                          <p className="text-sm text-secondary-500">ID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary-900">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary-600">{user.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
    </div>
  )
}
