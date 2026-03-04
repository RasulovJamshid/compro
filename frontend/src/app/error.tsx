'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-secondary-900 text-center mb-2">
            Что-то пошло не так
          </h1>

          <p className="text-secondary-600 text-center mb-6">
            Мы уже знаем об этой проблеме и работаем над её решением. Пожалуйста, попробуйте еще раз.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-mono text-red-600 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-500 mt-2">ID: {error.digest}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Попробовать снова
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-xl font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              На главную
            </Link>
          </div>

          <p className="mt-6 text-xs text-secondary-500 text-center">
            Если проблема не решена,{' '}
            <a href="mailto:support@compro.uz" className="text-primary-600 hover:text-primary-700 font-semibold">
              свяжитесь с поддержкой
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
