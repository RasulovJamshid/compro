'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

        <div className="card mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Информация о профиле</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Телефон:</span>
                <span className="ml-2 font-medium">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Роль:</span>
                <span className="ml-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isPremium ? 'Premium' : 'Free'}
                  </span>
                </span>
              </div>
              {user.firstName && (
                <div>
                  <span className="text-gray-600">Имя:</span>
                  <span className="ml-2 font-medium">{user.firstName} {user.lastName}</span>
                </div>
              )}
              {user.email && (
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!user.isPremium && (
          <div className="card mb-6 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Получите Premium доступ</h3>
              <p className="text-gray-700 mb-4">
                Получите полный доступ ко всем контактам, видео и 360-турам
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="btn btn-primary"
              >
                Выбрать тариф
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Действия</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/saved')}
                className="w-full btn btn-outline text-left"
              >
                Сохраненные объекты
              </button>
              <button
                onClick={handleLogout}
                className="w-full btn btn-secondary text-left"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
