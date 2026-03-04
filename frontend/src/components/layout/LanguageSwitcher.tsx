'use client'

import { useLocale } from 'next-intl'
import { setLocale } from '@/app/actions/locale'
import { useTransition } from 'react'

const locales = [
  { code: 'ru', label: 'Рус' },
  { code: 'uz', label: 'O\'zb' },
  { code: 'en', label: 'Eng' },
]

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return
    startTransition(() => {
      setLocale(newLocale)
    })
  }

  return (
    <div className="flex items-center gap-1 bg-secondary-100 p-1 rounded-lg">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleLocaleChange(code)}
          disabled={isPending}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            locale === code 
              ? 'bg-white text-primary-600 shadow-sm' 
              : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200/50'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
