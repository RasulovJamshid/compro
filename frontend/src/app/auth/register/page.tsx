'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendVerificationCode, verifyCode } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber } from '@/lib/utils/phoneMask'
import { 
  Phone, 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Building2,
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  
  // Form data
  const [phone, setPhone] = useState('+998 ')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Validation
  const [touched, setTouched] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const isStepValid = () => {
    if (step === 'phone') {
      return isValidPhoneNumber(phone)
    }
    return code.length === 6
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
            <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg group-hover:bg-primary-700 transition-colors">
              <Building2 className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-secondary-900">RealEstate</span>
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              {['Телефон', 'Код'].map((label, index) => {
                const stepIndex = ['phone', 'code'].indexOf(step)
                const isActive = index <= stepIndex
                const isCurrent = index === stepIndex
                
                return (
                  <div key={label} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'bg-white border-secondary-300 text-secondary-400'
                    }`}>
                      {isActive && index < stepIndex ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold text-lg">{index + 1}</span>
                      )}
                    </div>
                    {index < 1 && (
                      <div className={`w-32 h-0.5 mx-4 transition-all ${
                        index < stepIndex ? 'bg-primary-600' : 'bg-secondary-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-32 text-sm text-secondary-600 mt-3">
              <span className={step === 'phone' ? 'font-semibold text-primary-600' : ''}>Телефон</span>
              <span className={step === 'code' ? 'font-semibold text-primary-600' : ''}>Код</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              {step === 'phone' && 'Создать аккаунт'}
              {step === 'code' && 'Введите код'}
            </h2>
            <p className="text-secondary-600">
              {step === 'phone' && 'Введите номер телефона для регистрации'}
              {step === 'code' && `Код отправлен на ${phone}`}
            </p>
          </div>

          {/* Forms */}
          {step === 'phone' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Номер телефона *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() => setTouched(true)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      touched && !isValidPhoneNumber(phone) && phone.length > 5
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-secondary-300 focus:ring-primary-200 focus:border-primary-500'
                    }`}
                    required
                    autoFocus
                    maxLength={17}
                  />
                </div>
                {touched && !isValidPhoneNumber(phone) && phone.length > 5 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Неверный формат номера
                  </p>
                )}
                <p className="mt-2 text-sm text-secondary-500">
                  Формат: +998 XX XXX XX XX
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isStepValid()}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Отправка...' : 'Получить код'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-secondary-700 mb-2 text-center">
                  Код подтверждения
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-4 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-center text-3xl tracking-[0.5em] font-bold transition-all"
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="mt-2 text-sm text-secondary-500 text-center">
                  Введите 6-значный код из SMS
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Проверка...' : 'Завершить регистрацию'}
                <CheckCircle className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setCode('')
                  setError('')
                }}
                className="w-full py-3 px-4 border-2 border-secondary-300 text-secondary-700 font-semibold rounded-xl hover:bg-secondary-50 transition-all"
              >
                Изменить номер
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Войти
              </Link>
            </p>
          </div>

          {/* Dev Note */}
          {step === 'code' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700 text-center">
                💡 В режиме разработки код выводится в консоль сервера
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 text-yellow-300 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Быстрая регистрация!
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed">
              Всего один шаг - укажите номер телефона и получите доступ к тысячам объектов
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Бесплатный доступ</h3>
                <p className="text-primary-200">Просматривайте тысячи объектов без ограничений</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Проверенные объекты</h3>
                <p className="text-primary-200">Все объявления проходят модерацию</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Прямая связь</h3>
                <p className="text-primary-200">Общайтесь напрямую с владельцами</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white">15,000+</div>
                <div className="text-sm text-primary-200">Довольных клиентов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="text-sm text-primary-200">Активных объектов</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary-100">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm">Присоединяйтесь к сообществу</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
