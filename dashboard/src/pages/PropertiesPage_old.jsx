import { useState, useEffect } from 'react'
import { Search, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { adminApi } from '../lib/api'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchProperties()
  }, [statusFilter])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = { limit: 100 }
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await adminApi.getProperties(params)
      
      // Ensure we always have an array
      const propertyList = Array.isArray(data) ? data : (data?.items || data?.data || [])
      setProperties(propertyList)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await adminApi.updatePropertyStatus(propertyId, newStatus)
      showNotification(`Статус изменен на "${newStatus}"`)
      fetchProperties()
    } catch (error) {
      console.error('Failed to update status:', error)
      showNotification('Ошибка изменения статуса', 'error')
    }
  }

  const handleDelete = async (propertyId) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) return
    try {
      await adminApi.deleteProperty(propertyId)
      showNotification('Объект удален')
      fetchProperties()
    } catch (error) {
      console.error('Failed to delete:', error)
      showNotification('Ошибка удаления объекта', 'error')
    }
  }

  const filteredProperties = Array.isArray(properties) 
    ? properties.filter(p => p?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div className="p-8">
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Управление объектами</h1>
        <p className="text-secondary-500">Просмотр и модерация объявлений</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Объект</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Цена</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Статус</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-secondary-900">{property.title}</p>
                      <p className="text-sm text-secondary-500">{property.city}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{property.price.toLocaleString()} сум</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'active' ? 'bg-green-100 text-green-700' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {property.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusChange(property.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatusChange(property.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(property.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
