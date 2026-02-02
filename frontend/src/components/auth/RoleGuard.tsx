'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'moderator' | 'premium' | 'free' | 'guest')[]
  redirectTo?: string
}

export default function RoleGuard({ children, allowedRoles, redirectTo = '/auth/login' }: RoleGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (user && !allowedRoles.includes(user.role)) {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}
