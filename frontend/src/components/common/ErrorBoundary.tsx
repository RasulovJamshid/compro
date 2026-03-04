'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: {
    componentStack: string
  }
}

export default class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState(prev => ({
      ...prev,
      errorInfo
    }))

    // Log to external error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.__NEXT_DATA__?.isPreview === false) {
      // Send to error tracking service
      logErrorToService(error, errorInfo)
    }
  }

  public render() {
    if (this.state.hasError) {
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
                Мы уже знаем об этой проблеме и работаем над её решением. Пожалуйста, попробуйте позже.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-mono text-red-600 break-words">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-3 cursor-pointer">
                      <summary className="text-xs font-semibold text-red-700 hover:text-red-800">
                        Подробности
                      </summary>
                      <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40 bg-white p-2 rounded border border-red-100">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
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
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Helper function to log errors to external service
function logErrorToService(error: Error, errorInfo: { componentStack: string }) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }

  // Send to Sentry, Rollbar, or other error tracking service
  // Example: 
  // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/errors`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData),
  // }).catch(console.error)

  console.error('Error details:', errorData)
}
