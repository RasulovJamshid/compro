import { useState, useEffect } from 'react'
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Filter, RefreshCw } from 'lucide-react'
import { adminApi } from '../lib/api'
import PropertyFormModal from '../components/PropertyFormModal'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [notification, setNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 })

  useEffect(() => {
    fetchProperties()
  }, [statusFilter, currentPage, itemsPerPage])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await adminApi.getProperties(params)
      
      const propertyList = Array.isArray(data) ? data : (data?.items || data?.data || [])
      setProperties(propertyList)
      
      if (data?.pagination) {
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([])
      showNotification('Ошибка загрузки объектов', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCreate = () => {
    setSelectedProperty(null)
    setIsModalOpen(true)
  }

  const handleEdit = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      if (selectedProperty) {
        await adminApi.updateProperty(selectedProperty.id, formData)
        showNotification('Объект обновлен')
      } else {
        await adminApi.createProperty(formData)
        showNotification('Объект создан')
      }
      setIsModalOpen(false)
      fetchProperties()
    } catch (error) {
      console.error('Failed to save property:', error)
      showNotification('Ошибка сохранения объекта', 'error')
    } finally {
      setIsSubmitting(false)
    }
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
    ? properties.filter(p => {
        const matchesSearch = p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p?.city?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === 'all' || p?.propertyType === typeFilter
        return matchesSearch && matchesType
      })
    : []

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Активен', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      pending: { label: 'Модерация', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      inactive: { label: 'Неактивен', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
      sold: { label: 'Продано', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
      rented: { label: 'Сдано', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
    }

    const { label, className, icon: Icon } = config[status] || config.pending

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    )
  }

  const getPropertyTypeLabel = (type) => {
    const types = {
      office: 'Офис',
      warehouse: 'Склад',
      shop: 'Магазин',
      cafe_restaurant: 'Кафе/Ресторан',
      industrial: 'Промышленное',
      salon: 'Салон',
      recreation: 'База отдыха',
      other: 'Другое',
    }
    return types[type] || type
  }

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
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Управление объектами</h1>
            <p className="text-secondary-500">Создание, редактирование и модерация объявлений</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Создать объект
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Поиск по названию или городу..."
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
            <option value="active">Активные</option>
            <option value="pending">На модерации</option>
            <option value="inactive">Неактивные</option>
            <option value="sold">Проданные</option>
            <option value="rented">Сданные</option>
          </select>

          <select
            className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="office">Офис</option>
            <option value="warehouse">Склад</option>
            <option value="shop">Магазин</option>
            <option value="cafe_restaurant">Кафе/Ресторан</option>
            <option value="industrial">Промышленное</option>
          </select>

          <button
            onClick={fetchProperties}
            className="flex items-center gap-2 px-4 py-2.5 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-secondary-600">
          <span>Найдено: <strong>{filteredProperties.length}</strong></span>
          <span>•</span>
          <span>Всего: <strong>{properties.length}</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка объектов...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-secondary-300 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg font-medium text-secondary-900 mb-2">Объекты не найдены</p>
            <p className="text-secondary-500">Попробуйте изменить фильтры или создайте новый объект</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Объект
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Тип / Сделка
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Цена / Площадь
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0].thumbnailUrl || property.images[0].url}
                            alt={property.title}
                            className="w-16 h-16 rounded-lg object-cover border border-secondary-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center border border-secondary-200">
                            <Eye className="w-6 h-6 text-secondary-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-secondary-900 truncate">{property.title}</p>
                          <p className="text-sm text-secondary-500">{property.city}, {property.district}</p>
                          {property.isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                              <CheckCircle className="w-3 h-3" />
                              Проверено
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{getPropertyTypeLabel(property.propertyType)}</p>
                        <p className="text-xs text-secondary-500 capitalize">{property.dealType === 'rent' ? 'Аренда' : 'Продажа'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">{property.price.toLocaleString()} сум</p>
                        <p className="text-xs text-secondary-500">{property.area} м²</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-secondary-600">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{property.viewCount || 0}</span>
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
                              onClick={() => handleStatusChange(property.id, 'inactive')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Отклонить"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <a
                          href={`http://localhost:3000/properties/${property.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        property={selectedProperty}
        isLoading={isSubmitting}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              Показано {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.total)} из {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Назад
              </button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'border border-secondary-300 hover:bg-secondary-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>
                  }
                  return null
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Вперед
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="ml-4 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={10}>10 / страница</option>
                <option value={25}>25 / страница</option>
                <option value={50}>50 / страница</option>
                <option value={100}>100 / страница</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
