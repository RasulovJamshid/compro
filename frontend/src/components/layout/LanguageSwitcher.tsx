'use client'

import { useLocale } from 'next-intl'
import { setLocale } from '@/app/actions/locale'
import { useTransition } from 'react'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'ru', label: 'Рус', fullLabel: 'Русский' },
  { code: 'uz', label: 'O\'zb', fullLabel: 'O\'zbekcha' },
  { code: 'en', label: 'Eng', fullLabel: 'English' },
]

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const currentLocale = useLocale()

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setLocale(e.target.value)
    })
  }

  return (
    <div className="relative flex items-center gap-2">
      <Globe className="w-4 h-4 text-secondary-500 absolute left-2 pointer-events-none" />
      <select
        value={currentLocale}
        onChange={handleLocaleChange}
        disabled={isPending}
        className="pl-8 pr-3 py-1.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </div>
  )
}
