import { useState, useEffect } from 'react'
import { 
  MessageSquare, Star, Search, Filter, RefreshCw, Download,
  CheckCircle, XCircle, Clock, Eye, Trash2, User, Home,
  ThumbsUp, ThumbsDown, AlertCircle, Calendar, MoreVertical
} from 'lucide-react'
import { adminApi } from '../lib/api'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 })
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  })

  useEffect(() => {
    fetchReviews()
  }, [statusFilter, ratingFilter, currentPage, itemsPerPage])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      if (statusFilter !== 'all') params.status = statusFilter
      if (ratingFilter !== 'all') params.rating = ratingFilter

      const [reviewsResponse, statsResponse] = await Promise.all([
        adminApi.getReviews(params),
        adminApi.getReviewStats()
      ])

      const reviewsData = (reviewsResponse.data.data || reviewsResponse.data).map(review => ({
        id: review.id,
        propertyId: review.propertyId,
        propertyTitle: review.propertyTitle || 'Без названия',
        userId: review.userId,
        userName: review.userName || (review.userFirstName && review.userLastName 
          ? `${review.userFirstName} ${review.userLastName}`
          : review.userPhone),
        userPhone: review.userPhone,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: new Date(review.createdAt),
        moderatedAt: review.moderatedAt ? new Date(review.moderatedAt) : null,
        moderatedBy: review.moderatedBy
      }))

      setReviews(reviewsData)
      setStats(statsResponse.data)
      if (reviewsResponse.data.pagination) {
        setPagination(reviewsResponse.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      showNotification('Ошибка загрузки отзывов', 'error')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleApprove = async (reviewId) => {
    try {
      const user = JSON.parse(localStorage.getItem('dashboard_user') || '{}')
      await adminApi.approveReview(reviewId, user.id || 'admin')
      await fetchReviews()
      showNotification('Отзыв одобрен')
    } catch (error) {
      console.error('Error approving review:', error)
      showNotification('Ошибка при одобрении отзыва', 'error')
    }
  }

  const handleReject = async (reviewId) => {
    try {
      const user = JSON.parse(localStorage.getItem('dashboard_user') || '{}')
      await adminApi.rejectReview(reviewId, user.id || 'admin')
      await fetchReviews()
      showNotification('Отзыв отклонен')
    } catch (error) {
      console.error('Error rejecting review:', error)
      showNotification('Ошибка при отклонении отзыва', 'error')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return
    try {
      await adminApi.deleteReview(reviewId)
      await fetchReviews()
      showNotification('Отзыв удален')
    } catch (error) {
      console.error('Error deleting review:', error)
      showNotification('Ошибка при удалении отзыва', 'error')
    }
  }

  const handleViewDetails = (review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Property', 'User', 'Rating', 'Comment', 'Status', 'Date']
    const csvData = filteredReviews.map(r => [
      r.id,
      r.propertyTitle,
      r.userName,
      r.rating,
      r.comment,
      r.status,
      new Date(r.createdAt).toLocaleDateString()
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showNotification('Отзывы экспортированы')
  }

  const getStatusBadge = (status) => {
    const config = {
      approved: { label: 'Одобрено', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      pending: { label: 'На модерации', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      rejected: { label: 'Отклонено', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    }
    const { label, className, icon: Icon } = config[status] || config.pending
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    )
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  return (
    <div className="p-8">
      {/* Notification */}
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
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Отзывы</h1>
            <p className="text-secondary-500">Модерация и управление отзывами пользователей</p>
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
              onClick={fetchReviews}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Всего</span>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">На модерации</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Одобрено</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.approved}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Отклонено</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.rejected}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Ср. рейтинг</span>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.averageRating}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Поиск по объекту, пользователю, комментарию..."
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
            <option value="pending">На модерации</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
          </select>

          <select
            className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Все рейтинги</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-secondary-600">
          <span>Найдено: <strong>{filteredReviews.length}</strong></span>
          <span>•</span>
          <span>Всего: <strong>{reviews.length}</strong></span>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Загрузка отзывов...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-secondary-300 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg font-medium text-secondary-900 mb-2">Отзывы не найдены</p>
            <p className="text-secondary-500">Попробуйте изменить фильтры поиска</p>
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
                    Пользователь
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Рейтинг
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Комментарий
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">{review.propertyTitle}</p>
                          <p className="text-xs text-secondary-500">ID: {review.propertyId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">{review.userName}</p>
                          <p className="text-xs text-secondary-500">{review.userPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary-700 line-clamp-2 max-w-xs">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(review.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Одобрить"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(review.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Отклонить"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
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

      {/* Review Details Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary-900">Детали отзыва</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-3">Объект</h3>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="font-medium text-secondary-900">{selectedReview.propertyTitle}</p>
                    <p className="text-sm text-secondary-500">ID: {selectedReview.propertyId}</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-3">Пользователь</h3>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="font-medium text-secondary-900">{selectedReview.userName}</p>
                    <p className="text-sm text-secondary-500">{selectedReview.userPhone}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Рейтинг</h3>
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-lg font-bold text-secondary-900">{selectedReview.rating}/5</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Комментарий</h3>
                <p className="text-secondary-700 bg-secondary-50 rounded-lg p-4">{selectedReview.comment}</p>
              </div>

              {/* Status & Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Статус</h3>
                  {getStatusBadge(selectedReview.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Дата создания</h3>
                  <p className="text-sm text-secondary-600">
                    {new Date(selectedReview.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

              {selectedReview.moderatedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Модератор</h3>
                    <p className="text-sm text-secondary-600">{selectedReview.moderatedBy}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Дата модерации</h3>
                    <p className="text-sm text-secondary-600">
                      {new Date(selectedReview.moderatedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
                {selectedReview.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedReview.id)
                        setIsModalOpen(false)
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedReview.id)
                        setIsModalOpen(false)
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Отклонить
                    </button>
                  </>
                )}
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
