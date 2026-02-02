'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendVerificationCode, verifyCode } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber } from '@/lib/utils/phoneMask'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('+998 ')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isValidPhoneNumber(phone)) {
      setError('Неверный формат номера телефона')
      return
    }
    
    setLoading(true)

    try {
      const cleanPhone = unformatPhoneNumber(phone)
      await sendVerificationCode(cleanPhone)
      setStep('code')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка отправки кода')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const cleanPhone = unformatPhoneNumber(phone)
      const response = await verifyCode(cleanPhone, code)
      setUser(response.user)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Вход в систему
            </h2>

            {step === 'phone' ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Номер телефона
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="input"
                    required
                    maxLength={17}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Мы отправим вам SMS с кодом подтверждения
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary"
                >
                  {loading ? 'Отправка...' : 'Получить код'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Код подтверждения
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Код отправлен на номер {phone}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary"
                >
                  {loading ? 'Проверка...' : 'Войти'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('phone')
                    setCode('')
                    setError('')
                  }}
                  className="w-full btn btn-secondary"
                >
                  Изменить номер
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          В режиме разработки код выводится в консоль сервера
        </p>
      </div>
    </div>
  )
}
