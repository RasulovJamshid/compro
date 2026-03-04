'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ApiErrorHandlerProps {
  error: string | null
  onDismiss?: () => void
  autoClose?: number
}

export default function ApiErrorHandler({
  error,
  onDismiss,
  autoClose = 5000,
}: ApiErrorHandlerProps) {
  const [isVisible, setIsVisible] = useState(!!error)

  useEffect(() => {
    setIsVisible(!!error)

    if (error && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, autoClose)

      return () => clearTimeout(timer)
    }
  }, [error, autoClose, onDismiss])

  if (!isVisible || !error) return null

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-white border border-red-200 rounded-xl shadow-lg p-4 flex gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-900">{error}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss?.()
          }}
          className="flex-shrink-0 text-secondary-400 hover:text-secondary-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
