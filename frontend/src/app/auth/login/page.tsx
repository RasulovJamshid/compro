'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { sendVerificationCode, verifyCode } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber } from '@/lib/utils/phoneMask'
import { X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const { setUser } = useAuthStore()
  
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('+998 ')
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(120) // 2 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 'code' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const handleSendCode = async () => {
    setError('')
    
    if (!isValidPhoneNumber(phone)) {
      setError(t('invalidPhone'))
      return
    }
    
    setLoading(true)

    try {
      const cleanPhone = unformatPhoneNumber(phone)
      await sendVerificationCode(cleanPhone)
      setStep('code')
      setTimer(120)
      setCodeDigits(['', '', '', '', '', ''])
      // Focus first input after a short delay
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.response?.data?.message || t('sendCodeError'))
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...codeDigits]
    
    // Handle paste
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split('')
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })
      setCodeDigits(newCode)
      // Focus the next empty input or the last one
      const nextEmpty = newCode.findIndex(d => !d)
      const focusIndex = nextEmpty === -1 ? 5 : nextEmpty
      inputRefs.current[focusIndex]?.focus()
    } else {
      newCode[index] = value
      setCodeDigits(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
    
    setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    const fullCode = codeDigits.join('')
    if (fullCode.length !== 6) {
      setError(t('enterFullCode'))
      return
    }

    setError('')
    setLoading(true)

    try {
      const cleanPhone = unformatPhoneNumber(phone)
      const response = await verifyCode(cleanPhone, fullCode)
      setUser(response.user)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || t('invalidCode'))
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const fullCode = codeDigits.join('')
    if (fullCode.length === 6 && !loading && !error) {
      handleVerifyCode()
    }
  }, [codeDigits])

  const isPhoneValid = isValidPhoneNumber(phone)
  const isCodeComplete = codeDigits.join('').length === 6

  return (
    <div className="h-[100dvh] bg-white flex flex-col md:bg-gray-50 md:h-screen md:min-h-screen md:py-12 md:px-4 sm:px-6 lg:px-8 md:items-center md:justify-center overflow-hidden">
      <div className="flex-1 w-full max-w-md mx-auto bg-white md:rounded-3xl md:shadow-xl md:border md:border-gray-100 flex flex-col relative md:h-auto md:min-h-[600px] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <h1 className="text-xl font-bold">{t('loginTitle')}</h1>
          {step === 'code' ? (
            <button 
              onClick={() => setStep('phone')}
              className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <Link href="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 md:p-8">
          {step === 'phone' ? (
            <div className="flex flex-col items-center flex-1">
              <h2 className="text-3xl font-bold mb-3 mt-8">{t('welcome')}</h2>
              <p className="text-center text-gray-600 mb-8 text-sm px-4">
                {t('loginOrSignUp')}
              </p>
              
              <div className="w-full mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('enterSystemPhone')}
                </label>
                <p className="text-sm text-gray-500 mb-2">{t('phoneLabel')}</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-lg">🇺🇿</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-primary-500 focus:border-primary-500 text-base font-medium`}
                    placeholder="+998"
                    maxLength={17}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <div className="mt-auto pt-8 w-full">
                <button
                  onClick={handleSendCode}
                  disabled={!isPhoneValid || loading}
                  className={`w-full py-4 rounded-full font-medium text-lg transition-colors ${
                    isPhoneValid && !loading
                      ? 'bg-[#0066FF] text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {loading ? t('sending') : t('loginBtn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center flex-1">
              <h2 className="text-xl font-bold mb-3 mt-4 text-center">{t('phoneVerification')}</h2>
              <p className="text-center text-gray-600 mb-10 text-sm max-w-[280px]">
                {t('codeSentToPhone')}
              </p>

              <div className="w-full">
                <p className="text-sm text-gray-500 mb-3 text-center">{t('confirmationCode')}</p>
                <div className="flex justify-center gap-3 md:gap-4 mb-6">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl font-semibold rounded-xl border-2 transition-colors ${
                        error
                          ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500'
                          : digit
                            ? 'border-gray-300 bg-white'
                            : 'border-gray-200 bg-white focus:border-[#0066FF] focus:ring-[#0066FF]'
                      }`}
                      maxLength={index === 0 ? 6 : 1}
                    />
                  ))}
                </div>

                {error && <p className="text-center text-sm text-red-600 mb-4">{error}</p>}

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{t('codeValidFor')}</p>
                  {timer > 0 ? (
                    <p className="text-sm font-medium text-[#0066FF]">{formatTime(timer)}</p>
                  ) : (
                    <button 
                      onClick={handleSendCode}
                      className="text-sm font-medium text-[#0066FF] flex items-center justify-center gap-1 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {t('resend')}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-8 w-full">
                <button
                  onClick={handleVerifyCode}
                  disabled={!isCodeComplete || loading}
                  className={`w-full py-4 rounded-full font-medium text-lg transition-colors ${
                    isCodeComplete && !loading
                      ? 'bg-[#0066FF] text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {loading ? t('checking') : t('continue')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
