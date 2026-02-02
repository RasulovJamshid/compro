import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('dashboard_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dashboard_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  sendCode: (phone) => apiClient.post('/auth/send-code', { phone }),
  verifyCode: (phone, code) => apiClient.post('/auth/verify-code', { phone, code }),
  getCurrentUser: () => apiClient.get('/users/me'),
}

// Admin API
export const adminApi = {
  // Dashboard & Analytics
  getStats: () => apiClient.get('/admin/stats'),
  getAnalytics: () => apiClient.get('/admin/analytics'),
  
  // Properties
  getProperties: (params) => apiClient.get('/properties', { params }),
  createProperty: (data) => apiClient.post('/admin/properties', data),
  updateProperty: (id, data) => apiClient.put(`/admin/properties/${id}`, data),
  updatePropertyStatus: (id, status) => apiClient.patch(`/admin/properties/${id}/status`, { status }),
  deleteProperty: (id) => apiClient.delete(`/admin/properties/${id}`),
  
  // Users
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (id, role) => apiClient.patch(`/admin/users/${id}/role`, { role }),
  
  // Reviews
  getReviews: (params) => apiClient.get('/admin/reviews', { params }),
  getReviewStats: () => apiClient.get('/admin/reviews/stats'),
  approveReview: (id, moderatorId) => apiClient.patch(`/admin/reviews/${id}/approve`, { moderatorId }),
  rejectReview: (id, moderatorId) => apiClient.patch(`/admin/reviews/${id}/reject`, { moderatorId }),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`),
  
  // Transactions/Payments
  getTransactions: (params) => apiClient.get('/admin/transactions', { params }),
  getTransactionStats: () => apiClient.get('/admin/transactions/stats'),
  
  // Reports
  generatePropertiesReport: (startDate, endDate) => 
    apiClient.post('/admin/reports/properties', { startDate, endDate }),
  generateUsersReport: (startDate, endDate) => 
    apiClient.post('/admin/reports/users', { startDate, endDate }),
  generateRevenueReport: (startDate, endDate) => 
    apiClient.post('/admin/reports/revenue', { startDate, endDate }),
  
  // Settings
  getSettings: (category) => apiClient.get('/admin/settings', { params: { category } }),
  getSetting: (key) => apiClient.get(`/admin/settings/${key}`),
  updateSetting: (key, value, updatedBy) => 
    apiClient.put(`/admin/settings/${key}`, { value, updatedBy }),
  updateSettings: (settings, updatedBy) => 
    apiClient.put('/admin/settings', { settings, updatedBy }),
}

// Upload API
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadImages: (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return apiClient.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadVideo: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadVideos: (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return apiClient.post('/upload/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}
