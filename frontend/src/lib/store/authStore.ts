import { create } from 'zustand'
import type { User } from '../types'
import { getCurrentUser } from '../api/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  logout: () => void
  checkAuth: () => Promise<void>
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    })
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      set({ isLoading: true })
      const user = await getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false, error: null })
    } catch (error) {
      // Token might be expired, try refresh
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          // Attempt to refresh token
          // const { token: newToken } = await refreshAuthToken(refreshToken)
          // localStorage.setItem('token', newToken)
          // Retry fetching user
          // const user = await getCurrentUser()
          // set({ user, isAuthenticated: true, isLoading: false, error: null })
          // return
        } catch {
          // Refresh failed, clear auth
        }
      }

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Ошибка аутентификации. Пожалуйста, авторизуйтесь заново.',
      })
    }
  },
}))
