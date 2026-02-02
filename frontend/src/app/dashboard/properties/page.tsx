'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import type { Property } from '@/lib/types'

export default function DashboardPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchProperties()
  }, [statusFilter])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 100 }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      const { data } = await apiClient.get('/properties', { params })
      setProperties(data.items || data)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/properties/${propertyId}/status`, { status: newStatus })
      fetchProperties()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) return
    
    try {
      await apiClient.delete(`/admin/properties/${propertyId}`)
      fetchProperties()
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      active: { label: 'Активен', className: 'bg-green-100 text-green-700', icon: CheckCircle },
      pending: { label: 'На модерации', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      rejected: { label: 'Отклонен', className: 'bg-red-100 text-red-700', icon: XCircle },
      archived: { label: 'Архив', className: 'bg-gray-100 text-gray-700', icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
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
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Управление объектами</h1>
        <p className="text-secondary-500">Просмотр и модерация объявлений</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Поиск по названию или городу..."
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="pending">На модерации</option>
            <option value="rejected">Отклоненные</option>
            <option value="archived">Архив</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка объектов...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-500">Объекты не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Объект
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0].thumbnailUrl || property.images[0].url}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-secondary-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-secondary-900">{property.title}</p>
                          <p className="text-sm text-secondary-500">{property.city}, {property.district}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-secondary-600 capitalize">
                        {property.propertyType === 'office' ? 'Офис' : 
                         property.propertyType === 'warehouse' ? 'Склад' : 
                         property.propertyType === 'shop' ? 'Магазин' : property.propertyType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-secondary-900">
                        {property.price.toLocaleString()} сум
                      </p>
                      <p className="text-xs text-secondary-500">{property.area} м²</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-secondary-600">
                        <Eye className="w-4 h-4" />
                        {property.viewCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {property.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(property.id, 'active')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Одобрить"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(property.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Отклонить"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <a
                          href={`/properties/${property.id}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
