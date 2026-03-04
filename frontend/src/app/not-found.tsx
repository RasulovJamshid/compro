'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">
            Страница не найдена
          </h2>
          <p className="text-lg text-secondary-600">
            Запрошенная страница не существует или была перемещена.
          </p>
        </div>

        <div className="space-y-3 mt-10">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            На главную
          </Link>

          <Link
            href="/properties"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-xl font-semibold transition-colors"
          >
            <Search className="w-5 h-5" />
            Поиск объектов
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-secondary-200 hover:border-secondary-300 text-secondary-700 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться назад
          </button>
        </div>

        <p className="mt-10 text-sm text-secondary-500">
          Если вы считаете, что это ошибка, пожалуйста, <br />
          <a href="mailto:support@compro.uz" className="text-primary-600 hover:text-primary-700 font-semibold">
            свяжитесь с нами
          </a>
        </p>
      </div>
    </div>
  )
}
