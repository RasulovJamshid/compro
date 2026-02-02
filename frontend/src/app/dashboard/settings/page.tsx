'use client'

import { Settings } from 'lucide-react'

export default function DashboardSettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Настройки</h1>
        <p className="text-secondary-500">Конфигурация системы и параметры</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-12 text-center">
        <Settings className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Раздел в разработке</h2>
        <p className="text-secondary-500">Функционал настроек будет доступен в ближайшее время</p>
      </div>
    </div>
  )
}
