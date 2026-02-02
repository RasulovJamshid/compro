import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('dashboard_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const { data } = await authApi.getCurrentUser()
      
      // Check if user has admin or moderator role
      if (data.role === 'admin' || data.role === 'moderator') {
        setUser(data)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('dashboard_token')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      localStorage.removeItem('dashboard_token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (phone, code) => {
    const { data } = await authApi.verifyCode(phone, code)
    
    if (data.accessToken) {
      localStorage.setItem('dashboard_token', data.accessToken)
      
      // Fetch user data to verify role
      const userData = await authApi.getCurrentUser()
      
      if (userData.data.role === 'admin' || userData.data.role === 'moderator') {
        setUser(userData.data)
        setIsAuthenticated(true)
        return true
      } else {
        localStorage.removeItem('dashboard_token')
        throw new Error('У вас нет доступа к панели управления')
      }
    }
    
    return false
  }

  const logout = () => {
    localStorage.removeItem('dashboard_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
