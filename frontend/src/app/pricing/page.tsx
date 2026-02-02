'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Crown } from 'lucide-react'
import { getSubscriptionPlans } from '@/lib/api/subscriptions'
import { useAuthStore } from '@/lib/store/authStore'
import type { SubscriptionPlan } from '@/lib/types'

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const data = await getSubscriptionPlans()
      setPlans(data || [])
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/pricing')
      return
    }
    // TODO: Implement payment flow
    alert('Оплата в разработке')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const isPopular = (code: string) => code === 'premium_3m'

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Тарифные планы</h1>
          <p className="text-xl text-gray-600">
            Выберите подходящий тариф для полного доступа
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Не удалось загрузить тарифы</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const popular = isPopular(plan.code)
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 ${
                      popular ? 'ring-2 ring-blue-500 relative' : ''
                    }`}
                  >
                    {popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Популярный
                        </span>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-blue-600">{formatPrice(plan.price)}</span>
                        <span className="text-gray-600"> сум</span>
                        <p className="text-gray-500 mt-1">{plan.durationDays} дней</p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`w-full btn ${
                          popular ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        Выбрать тариф
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow">
                <h3 className="text-xl font-bold mb-4">Преимущества Premium</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">Полный доступ</p>
                      <p className="text-sm text-gray-600">Ко всем контактам и деталям</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">Видео и 3D-туры</p>
                      <p className="text-sm text-gray-600">Виртуальные просмотры объектов</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">Без ограничений</p>
                      <p className="text-sm text-gray-600">Неограниченный просмотр объектов</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">Приоритетная поддержка</p>
                      <p className="text-sm text-gray-600">Быстрые ответы на вопросы</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-gray-600">
              <p className="mb-2">Принимаем оплату через <span className="font-semibold">Payme</span> и <span className="font-semibold">Click</span></p>
              <p className="text-sm">Безопасные платежи с защитой данных</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
