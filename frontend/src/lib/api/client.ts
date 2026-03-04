import axios from 'axios'
import { ApiErrorHandler } from './errorHandler'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Enhanced error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = ApiErrorHandler.handle(error)

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      // Redirect to login only if not already on auth page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login?redirected=true'
      }
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        url: error.config?.url,
        method: error.config?.method,
      })
    }

    return Promise.reject(apiError)
  }
)

export { ApiErrorHandler }
